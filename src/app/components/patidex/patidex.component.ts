import { Component, OnInit } from '@angular/core';
//import { ApiGardenService } from 'src/app/services/api-gardens.service';
import { HttpClient } from '@angular/common/http';
import { Location } from 'src/app/location';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiGardenService } from 'src/app/services/api-gardens.service';

@Component({
  selector: 'app-patidex',
  templateUrl: './patidex.component.html',
  styleUrls: ['./patidex.component.scss']
})
export class PatidexComponent implements OnInit {

  constructor(private apiGardenService: ApiGardenService) { }

  locations: any
  status = "loading"

  getLocations() {
    this.apiGardenService.getGardenList()
    .then(() => {
      this.locations = this.apiGardenService.data;
      console.log(this.locations);
      this.status = "ready"
    })
    .catch((error) => {
      console.error(error)
    })   
  }

  ngOnInit(): void {
    this.getLocations();
  }
}
