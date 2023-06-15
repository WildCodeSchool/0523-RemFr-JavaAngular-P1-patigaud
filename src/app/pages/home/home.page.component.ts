import { Component } from '@angular/core';
import { Location } from '../../location';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent {
  locations!: Location[];

  constructor(private apiGardenService: ApiGardenService) { }

  ngOnInit() {
    this.getLocations();
  }

  getLocations() {
    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
    });
  }
}
