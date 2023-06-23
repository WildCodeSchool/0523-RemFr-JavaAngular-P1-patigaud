import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public map!: L.Map;
  public isLoaded = false;

  setMap(map: L.Map) {
    this.map = map;
    this.isLoaded = true;
  }

  getMap(): any {
    if (this.isLoaded) return this.map;
  }
}