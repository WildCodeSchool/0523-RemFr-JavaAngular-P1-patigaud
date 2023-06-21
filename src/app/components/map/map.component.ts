import { Component, OnInit, OnDestroy } from "@angular/core";
import * as L from "leaflet";
import { ApiGardenService } from "src/app/services/api-garden/api-gardens.service";
import { GeolocService } from "src/app/services/geoloc.service";
import { Location } from "../../location";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MapService } from "src/app/services/map/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})

export class MapComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private polygons: Map<string, L.Polygon> = new Map();
  locations!: Location[];
  status = "loading";
  private unsubscribe$: Subject<void> = new Subject<void>();
  private myLong = 0;
  private myLat = 0;
  private myPosMarker: any;
  private readonly DEFAULT_MAX_BOUND: L.LatLngBoundsExpression | any = [[42.361, -4.76667],[51.0833, 8.181]];
  private readonly DEFAULT_MAP_COORD: L.LatLngExpression = [47.383333, 0.683333];
  private readonly DEFAULT_ZOOM: number = 13;
  private readonly DEFAULT_MAX_ZOOM: number = 19;
  private readonly DEFAULT_MIN_ZOOM: number = 6;

  constructor(private apiGardenService: ApiGardenService, private GeolocService: GeolocService, private MapService: MapService) {}

  ngOnInit() {
    this.initMap();
    this.getLocations();
    this.updateMyPosEvery5Sec();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateMyPosEvery5Sec() {
    interval(3000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.UpdateMyPosMarker();
        if (this.locations && this.myLong && this.myLat) {
          const polyid = this.GeolocService.checkMyLoc(
            this.locations,
            this.myLat,
            this.myLong
          );
          if (polyid) {
            const poly = this.polygons.get(polyid); // using get and set methods from Leaflet
            if (poly) {
              poly.setStyle({ color: "lightgreen" });
            }
          }
        }
      });
  }

  UpdateMyPosMarker() {
    this.GeolocService.getCurrentPosition().subscribe({
      next: (coords: any) => {
        if (this.myPosMarker != undefined) {
          this.map.removeLayer(this.myPosMarker);
          this.myLong = this.myLong - 4 / 10000; // testing purposes (increment longitude every few seconds)
          this.myPosMarker = L.marker([this.myLat, this.myLong], {
            icon: this.cloudIcon,
          }).addTo(this.map);
        } else {
          this.myLong = coords.lon;
          this.myLat = coords.lat;
          this.myPosMarker = L.marker(coords, { icon: this.cloudIcon }).addTo(
            this.map
          );
        }
      },
      error: (error: string) => {
        console.error(error);
      },
    });
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
        const coordinatesReversed = shape[0].map((coords) => [coords[1], coords[0]]);
        const poly = L.polygon(coordinatesReversed, { color: "darkgrey" });
        this.polygons.set(location.id, poly); // using get and set methods from Leaflet, to recognize marker later
        poly.addTo(this.map);
      }
      L.marker(geopoint, { icon: this.myIcon }).addTo(this.map)
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

  private cloudIcon = L.icon({ //used for position marker
    iconUrl: "assets/maps-inverted.png",
    iconSize: [20, 20],
  });
}
