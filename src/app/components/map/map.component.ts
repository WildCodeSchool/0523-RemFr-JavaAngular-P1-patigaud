import * as L from "leaflet";
import { Location } from "../../location";
import { ApiGardenService } from "src/app/services/api-garden/api-gardens.service";
import { MapService } from "src/app/services/map/map.service";
import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  map!: L.Map;
  locations!: Location[];
  status = "loading";
  private readonly DEFAULT_MAX_BOUND: L.LatLngBoundsExpression | any = [[42.361, -4.76667],[51.0833, 8.181]];
  private readonly DEFAULT_MAP_COORD: L.LatLngExpression = [47.383333, 0.683333];
  private readonly DEFAULT_ZOOM: number = 13;
  private readonly DEFAULT_MAX_ZOOM: number = 19;
  private readonly DEFAULT_MIN_ZOOM: number = 6;
  
  
  constructor(private apiGardenService: ApiGardenService, private MapService: MapService) { }

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

  public drawPolygons(locations: Location[]) {
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
        ${location.address} <br> ${location.city}, ${location.postalCode}<br>
        Taille en m²: ${location.area}m²
        `);
    });
  }
  initMap(): void {
    this.map = L.map("map", {
      maxBounds: this.DEFAULT_MAX_BOUND,
      minZoom: this.DEFAULT_MIN_ZOOM,
      zoomControl: false,
    }).setView(this.DEFAULT_MAP_COORD, this.DEFAULT_ZOOM);

    this.MapService.setMap(this.map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "©OpenStreetMap, ©CartoDB",
        subdomains: "abcd",
        maxZoom: this.DEFAULT_MAX_ZOOM,
      }
    ).addTo(this.map);
  }

  private myIcon = L.icon({
    iconUrl: "assets/maps.png",
    iconSize: [20, 20],
  });
}
