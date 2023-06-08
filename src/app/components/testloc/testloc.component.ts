import { Component } from '@angular/core';
import { GeolocService, Coordinates } from 'src/app/services/geoloc.service';

@Component({
  selector: 'app-testloc',
  templateUrl: './testloc.component.html',
  styleUrls: ['./testloc.component.scss']
})
export class TestlocComponent {
  latitude: number | undefined;
  longitude: number | undefined;
  error: string | undefined;

  constructor( private geoloc: GeolocService ) {}

  ngOnInit(): void {
    this.getCurrentPosition();
  }

  getCurrentPosition(): void {
    this.geoloc.getCurrentPosition().subscribe({
      next: (coords: Coordinates) => {
        this.latitude = coords.latitude
        this.longitude = coords.longitude
      },
      error: (error: string) => {
        console.error(error);
      },
      complete: () => {
        console.log('done')
      }
    });
  }
}
