import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patidex',
  templateUrl: './patidex.component.html',
  styleUrls: ['./patidex.component.scss']
})
export class PatidexComponent implements OnInit {

  locationList: any

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadGardenList();
  }

  loadGardenList() {
    this.httpClient
      .get("https://data.tours-metropole.fr/api/records/1.0/search/?dataset=espaces-verts-tours-metropole-val-de-loire&q=&facet=commune&facet=libelle&facet=structure&facet=adresse&facet=aire_en_m")
      .subscribe((response) => {
        this.locationList = response as any
      }) ;

  }
  
}
