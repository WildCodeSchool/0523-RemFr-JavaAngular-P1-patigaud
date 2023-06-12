import { Component, Input, HostListener, AfterViewInit } from "@angular/core";
import { Location } from "../../location";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapService } from "src/app/services/map/map.service";
import * as L from "leaflet";

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
export class SearchBarComponent implements AfterViewInit {
  @Input() locations!: Location[];
  searchResults: Location[] = [];
  map!: L.Map;
  inputText = '';
  isFocused = false;
  itHasBeenReversed = false;

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
    this.map = this.mapService.getMap();
  }

  locationsReverse() {
    this.locations.forEach((location: Location) => {
      location.geoPoint.reverse();
    });
  }

  onInput(event: any) {
    this.inputText = event.target.value;
    this.searchLocations();
  }

  toggleFocus(event: Event) {
    event.stopPropagation();
    this.isFocused = true;
    if (!this.itHasBeenReversed) {
      this.locationsReverse();
    }
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
    this.map.flyTo(geopoint, 18);
    setTimeout(() => this.map.openPopup(popup), 400);
  }
}
