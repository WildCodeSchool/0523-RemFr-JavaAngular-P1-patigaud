import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
    private map!: L.Map;

    constructor() { }

    initMap(): void {
      this.map = L.map('map', {
        maxBounds: [
          [42.361, -4.76667],
          [51.0833, 8.181]
        ],
        minZoom: 6,
      }).setView([47.383333, 0.683333], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);
    }

    ngOnInit() {
      this.initMap();
    }

}
