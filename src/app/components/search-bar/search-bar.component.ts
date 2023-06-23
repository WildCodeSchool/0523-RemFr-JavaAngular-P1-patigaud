import { Component, Input, HostListener, AfterViewInit, OnInit } from "@angular/core";
import { Location } from "../../location";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapService } from "src/app/services/map/map.service";
import * as L from "leaflet";
import { map } from 'rxjs';
import { Garden } from 'src/app/models/garden';
import { GardenService } from "src/app/services/garden/garden.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '60vh' })),
      state('collapsed', style({ height: '80px' })),
      transition('expanded <=> collapsed', animate('1s ease')),
    ]),
  ],
})
export class SearchBarComponent implements AfterViewInit, OnInit {
  @Input() locations!: Location[];
  searchResults: Location[] = [];
  map!: L.Map;
  inputText = '';
  isFocused = false;
  itHasBeenReversed = false;
  city: string = '';
  postalCode: number = 0;
  structure: string = '';
  option: any;
  optionsFilters = {
    optionsCity: Array<string>(),
    optionsPostalCode: Array<string>(),
    optionsStructure: Array<string>(),
  }
  result: any;
  private readonly DEFAULT_MAP_ZOOM_FLYTO: number = 18;
  private readonly DEFAULT_MAP_ZOOM_FLYTO_ZONE: number = 13;
  private gardens: Garden[] = [];
  private gardensLoaded = false;

  constructor(private mapService: MapService, private GardenService: GardenService) { }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const targetElement = event.target as HTMLElement;
    const isInsideSearchBar = targetElement.closest('.top-bar');
    if (!isInsideSearchBar) {
      this.isFocused = false;
    }
  }

  ngOnInit(): void {
    this.getAllGardens();
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap()
    if (this.mapService.isLoaded) {
      this.optionsForTheFilters();
    }
  }

  onInput(event: any) {
    this.inputText = event.target.value;
    this.searchLocations();
  }

  toggleFocus(event: Event) {
    event.stopPropagation();
    this.isFocused = true;
    this.itHasBeenReversed = true;
  }

  getAllGardens() {
    this.GardenService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe((data: any) => {
        this.gardens = data;
        this.gardensLoaded = true;
      })    
  }  

  toggleUnFocus(event: Event) {
    event.stopPropagation();
    this.isFocused = false;
    this.inputText = '';
    this.searchResults = [];
  }

  searchLocations() {
    this.searchResults = this.locations.filter(location =>
      location.address.toLowerCase().includes(this.inputText.toLowerCase()) ||
      location.city.toLowerCase().includes(this.inputText.toLowerCase()) ||
      location.postalCode.toString().includes(this.inputText.toLowerCase())
    );
  }

  goToLocation(location: Location) {
    this.inputText = '';
    if (this.option !== ""){
      this.selectOption('');
    }
    this.searchResults = [];
    this.isFocused = false;
    const geopoint: number[] | any = location.geoPoint;
    const popupContent = `
      ${location.address} <br> ${location.city}, ${location.postalCode}<br>
      Taille en m²: ${location.area}m²
    `;
    const popup: L.Popup = L.popup().setLatLng(geopoint).setContent(popupContent);
    this.map.flyTo(geopoint, this.DEFAULT_MAP_ZOOM_FLYTO);
    setTimeout(() => this.map.openPopup(popup), 400);
  }

  buildMarkers(markers: any) {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) this.map.removeLayer(layer);
      if (layer instanceof L.Polygon) this.map.removeLayer(layer);
    });
    let sumLat = 0;
    let sumLng = 0;
    for (let marker of markers) {
      this.buildPopup(marker);
      sumLat += marker.geoPoint[0];
      sumLng += marker.geoPoint[1];
    }
    const centerMarkers: any = [sumLat / markers.length, sumLng / markers.length];
    this.map.setView(centerMarkers, this.DEFAULT_MAP_ZOOM_FLYTO_ZONE);
  }
  

  optionsForTheFilters() {
    this.locations.forEach((location: Location) => {
      if (!this.optionsFilters.optionsCity.includes(location.city)) {
        this.optionsFilters.optionsCity.push(location.city);
        this.optionsFilters.optionsCity.sort();
      }
      if (!this.optionsFilters.optionsPostalCode.includes(location.postalCode.toString())) {
        this.optionsFilters.optionsPostalCode.push(location.postalCode.toString());
        this.optionsFilters.optionsPostalCode.sort();
      }
      if (!this.optionsFilters.optionsStructure.includes(location.structure)) {
        this.optionsFilters.optionsStructure.push(location.structure);
        this.optionsFilters.optionsStructure.sort();
      }
    });
  }

  buildPopup(object: any) {
    const popupContent = `
      ${object.address} <br> ${object.city}, ${object.postalCode}<br>
      Taille en m²: ${object.area}m²
    `;
    L.marker(object.geoPoint, this.myIcon).addTo(this.map).bindPopup(popupContent);
    if (object.shape && Array.isArray(object.shape) && Array.isArray(object.shape[0])) {
      let foundInDb = false
      if (this.gardensLoaded) {
        const currentUser = localStorage.getItem('pseudo')
        for(let i = 0; i < this.gardens.length; i++) {
          if ((this.gardens[i].userKey == currentUser) && (object.id == this.gardens[i].gardenId )) {
            foundInDb = true
          }
        }
      }
      const coordinatesReversed = object.shape[0].map((coords) => coords);
      this.result = coordinatesReversed.map((coords) => [coords[1], coords[0]]);
      if (foundInDb) {
        L.polygon(this.result, {
          color: "lightgreen",
        }).addTo(this.map);        
      } else {
        L.polygon(this.result, {
          color: "darkgrey",
        }).addTo(this.map);         
      }

    }
  }

  filterTheMap() {
    const filteredLocations = this.locations.filter((location: Location) => {
      return location.city === this.option || 
      location.postalCode === this.option ||
      location.structure === this.option
    });
  
    const previousCity = this.option;  
    if (previousCity !== this.option) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
        if (layer instanceof L.Polygon) this.map.removeLayer(layer);
      });
    }
  
    if (this.option === "") {
      this.buildMarkers(this.locations);
    } else if (this.option !== "") {
      this.buildMarkers(filteredLocations);
    }
  
    if (previousCity !== this.city) {
      this.searchLocations();
    }
  }

  selectOption(text: any) {
    this.option = text;
    this.filterTheMap();
    if (this.selectedIndex !== undefined) {
      this.isDropDownOpen = false;
    }
  }

  isDropDownOpen: any = false;
  selectedIndex: number = 0;
  changeSelection(event: any, index: any) {
    this.selectedIndex = event.target.checked ? index : undefined;
  }

  OpenCloseDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  
  
  myIcon = {icon: L.icon({
    iconUrl: "assets/maps.png",
    iconSize: [20, 20],
  })};
  
}