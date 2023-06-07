import { Component } from '@angular/core';
import { GeolocService } from 'src/app/services/geoloc.service';

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
    this.geoloc.getCurrentPosition()
      .then((coords) => {
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;
      })
      .catch((error) => {
        this.error = error;
      });
  }

}
