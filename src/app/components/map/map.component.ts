import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import { ApiGardenService } from "src/app/services/api-gardens.service";
import { Location } from "../../location";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  locations!: Location[];
  status = "loading";

  constructor(private apiGardenService: ApiGardenService) {}

  ngOnInit() {
    this.initMap();
    this.getLocations();
  }

  getLocations() {
    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.status = "ready";
      this.drawPolygons(this.locations);
    });
  }

  drawPolygons(locations: Location[]) {
    locations.forEach((location: Location) => {
      const geopoint: number[] | any = location.geoPoint;
      const shape: number[] | undefined = location?.shape;
      if (shape && Array.isArray(shape) && Array.isArray(shape[0])) {
        const coordinatesReversed = shape[0].map((coords) => coords.reverse());
        L.polygon(coordinatesReversed, {
          color: "lightgreen",
        }).addTo(this.map);
      }
      L.marker(geopoint.reverse(), { icon: this.myIcon }).addTo(this.map)
        .bindPopup(`
          Adresse: ${location.address}, ${location.city}, ${location.postalCode}<br>
          Taille en m²: ${location.area}
        `);
    });
  }

  initMap(): void {
    this.map = L.map("map", {
      maxBounds: [
        [42.361, -4.76667],
        [51.0833, 8.181],
      ],
      minZoom: 6,
    }).setView([47.383333, 0.683333], 13);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "©OpenStreetMap, ©CartoDB",
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(this.map);
  }

  private myIcon = L.icon({
    iconUrl: "assets/maps.png",
    iconSize: [20, 20],
  });
}
