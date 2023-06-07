import { Injectable } from '@angular/core';

interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})

export class GeolocService {
  getCurrentPosition(): Promise<Coordinates> {
    return new Promise<Coordinates>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('doesnt work, geoloc might not be set');
      }
    });
  }
} 