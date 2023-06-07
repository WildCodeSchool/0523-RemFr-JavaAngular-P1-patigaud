import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})

export class GeolocService {
  getCurrentPosition(): Observable<Coordinates> {
    return new Observable<Coordinates> (
      (observer) => {
        if (navigator.geolocation) {
          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

          const watchId = navigator.geolocation.watchPosition(
            (position) => observer.next(position.coords),
            (error) => observer.error(error),
            options
          );
          return () => {
            navigator.geolocation.clearWatch(watchId);
          };
        } else {
          observer.error('we had an issue with geolocation');
          return
        }
      }  
    )
  }
}