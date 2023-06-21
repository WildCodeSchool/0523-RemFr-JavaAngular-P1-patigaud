import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiGardenService } from "./api-garden/api-gardens.service";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: "root",
})
export class GeolocService {
  locations: any;
  private spooflat = 47.3806797848;
  private spooflng = 0.70160855649;
  private spoofcoords = { lat: this.spooflat, lon: this.spooflng };

  constructor(private apiGardenService: ApiGardenService) {}

  getLocations(mylat: number, mylong: number) {
    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.checkMyLoc(response, mylat, mylong);
    });
  }

  haversineLaw(lat1: number, lon1: number, lat2: number, lon2: number) {
    // generally used geo measurement function
    const R = 6378.137; // Radius of earth in KM
    const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
    const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
  }

  distanceTwoDim(x: number, y: number, u: number, w: number) {
    const a = x - u;
    const b = y - w;
    return Math.sqrt(a * a + b * b);
  }

  getIsPointInsidePolygon(point: number[], vertices: number[][]) {
    const x = point[0]; //long, x, 0.7
    const y = point[1]; //lat, y, 47
    //vertices [long,lat]

    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i][0],
        yi = vertices[i][1];
      const xj = vertices[j][0],
        yj = vertices[j][1];

      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  checkMyLoc(locationsArray: any, mylat: number, mylong: number) {
    for (const poi of locationsArray) {
      const myPos = [mylat, mylong];
      if (poi.shape && this.getIsPointInsidePolygon(myPos, poi.shape[0])) {
        return poi.id;
      }
    }
    return false;
  }

  getCurrentPosition(): Observable<Coordinates> {
    return new Observable<any>((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          //(position) => observer.next(position.coords), //current position unused for now
          () => observer.next(this.spoofcoords), //using testing set of coordinates
          (error) => observer.error(error)
        );
      } else {
        observer.error("Geolocation is not supported by this browser.");
      }
    });
  }
}
