import { Component, Input, HostListener, AfterViewInit, AfterViewChecked, AfterContentChecked } from "@angular/core";
import { Location } from "../../location";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapService } from "src/app/services/map/map.service";
import * as L from "leaflet";

interface optionsForFilters {
  optionsCity: Array<string>;
  optionsPostalCode: Array<number>;
  optionsStructure: Array<string>;
}

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
export class SearchBarComponent implements AfterViewInit, AfterContentChecked {
  @Input() locations!: Location[];
  searchResults: Location[] = [];
  map!: L.Map;
  inputText = '';
  isFocused = false;
  itHasBeenReversed = false;
  city: string = '';
  allCities: string[] = [];
  result: any;
  isOptionsLoaded: boolean = false;
  private readonly DEFAULT_MAP_ZOOM_FLYTO: number = 18;

  constructor(private mapService: MapService) { }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const targetElement = event.target as HTMLElement;
    const isInsideSearchBar = targetElement.closest('.top-bar');
    if (!isInsideSearchBar) {
      this.isFocused = false;
    }
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap()
    if (this.mapService.isLoaded) {
      this.optionsForTheCity();
    }
  }

  ngAfterContentChecked() {
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
  
    for (let marker of markers) {
      this.buildPopup(marker);
    }
  }
  

  optionsForTheCity(optionsForFilters: optionsForFilters = { optionsCity: [], optionsPostalCode: [], optionsStructure: [] }) {
    this.locations.forEach((location: Location) => {
      if (!this.allCities.includes(location.city)) {
        optionsForFilters.optionsCity.push(location.city);
        this.allCities.push(location.city);
        this.allCities.sort();
      }
    });
    new Set(optionsForFilters.optionsCity = this.allCities);
    this.locations.forEach((location: Location) => {});
  }

  buildPopup(object: any) {
    const popupContent = `
      ${object.address} <br> ${object.city}, ${object.postalCode}<br>
      Taille en m²: ${object.area}m²
    `;
    L.marker(object.geoPoint, this.myIcon).addTo(this.map).bindPopup(popupContent);
    if (object.shape && Array.isArray(object.shape) && Array.isArray(object.shape[0])) {
      const coordinatesReversed = object.shape[0].map((coords) => coords);
      this.result = coordinatesReversed.map((coords) => [coords[1], coords[0]]);
      L.polygon(this.result, {
        color: "lightgreen",
      }).addTo(this.map);
    }
  }

  filterByCity() {
    const filteredLocations = this.locations.filter((location: Location) => location.city === this.city);
  
    const previousCity = this.city;  
    if (previousCity !== this.city) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
        if (layer instanceof L.Polygon) this.map.removeLayer(layer);
      });
    }
  
    if (this.city === "") {
      this.buildMarkers(this.locations);
    } else {
      this.buildMarkers(filteredLocations);
    }
  
    if (previousCity !== this.city) {
      this.searchLocations();
    }
  }
  
  
  myIcon = {icon: L.icon({
    iconUrl: "assets/maps.png",
    iconSize: [20, 20],
  })};
  
}
