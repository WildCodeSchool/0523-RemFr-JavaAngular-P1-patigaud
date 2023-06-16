import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import * as L from "leaflet";
import { ApiGardenService } from "src/app/services/api-gardens.service";
import { GeolocService } from "src/app/services/geoloc.service";
import { Location } from "../../location";
import { NumberValueAccessor } from "@angular/forms";
import { Observable, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  locations!: Location[];
  status = "loading";
  private unsubscribe$: Subject<void> = new Subject<void>();
  private myLong: number = 0;
  private myLat: number = 0;  

  constructor(private apiGardenService: ApiGardenService, private GeolocService: GeolocService) {}

  ngOnInit() {
    this.initMap();
    this.getLocations();
    this.updateMyPosEvery5Sec()
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }  
  
  private myPosMarker: any;

  updateMyPosEvery5Sec() {
    interval(3000).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.UpdateMyPosMarker()
      if (this.locations && this.myLong && this.myLat) {
        this.GeolocService.checkMyLoc(this.locations, this.myLat, this.myLong)
      }
    });
  }

  UpdateMyPosMarker() {
    this.GeolocService.getCurrentPosition().subscribe({
      next: (coords: any) => {
        if (this.myPosMarker != undefined) {
          this.map.removeLayer(this.myPosMarker)
          this.myLong = this.myLong - (3/10000)
          this.myPosMarker = L.marker([this.myLat,this.myLong], { icon: this.myPosIcon }).addTo(this.map)
        } else {
          this.myLong = coords.lon
          this.myLat = coords.lat 
          this.myPosMarker = L.marker(coords, { icon: this.myPosIcon }).addTo(this.map)
        }
      },
      error: (error: string) => {
        console.error(error);
      },
      complete: () => {
        console.log('done')
      }
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

  private myPosIcon = L.icon({
    iconUrl: "assets/maps-inverted.png",
    iconSize: [20, 20],
  });  
}
