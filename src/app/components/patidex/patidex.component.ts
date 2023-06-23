import { Component, OnInit } from '@angular/core';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';

@Component({
  selector: 'app-patidex',
  templateUrl: './patidex.component.html',
  styleUrls: ['./patidex.component.scss']
})
export class PatidexComponent implements OnInit {
  openedIndex: number = -1;
  constructor(private apiGardenService: ApiGardenService) { }

  locations: any
  status = "ready"

  getLocations() {
    this.apiGardenService.getGardenList()
    .subscribe((response) => this.locations = response);
  }

  openDetails(index: number) {
    this.openedIndex = index === this.openedIndex ? -1 : index;
  }

  close(index: number) {
    this.openedIndex = -1;
  }

  ngOnInit(): void {
    this.getLocations();
  }
}
