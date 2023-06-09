import { Component, OnInit } from '@angular/core';
import { ApiGardenService } from 'src/app/services/api-gardens.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patidex',
  templateUrl: './patidex.component.html',
  styleUrls: ['./patidex.component.scss']
})
export class PatidexComponent implements OnInit {

  constructor(private apiGardenService: ApiGardenService) { }

  locations: any
  status = "ready"

  getLocations() {
    this.apiGardenService.getGardenList()
    .subscribe((response) => this.locations = response)
  }

  ngOnInit(): void {
    this.getLocations();
  }
}
