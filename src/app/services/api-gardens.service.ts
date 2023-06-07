import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Location } from '../location';

@Injectable({
  providedIn: 'root'
})
export class ApiGardenService {

  constructor(private httpClient: HttpClient) { }

  locations: any

  public async getGardenList() {
    await firstValueFrom(this.httpClient
      .get("https://data.tours-metropole.fr/api/records/1.0/search/?dataset=espaces-verts-tours-metropole-val-de-loire&q=&facet=commune&facet=libelle&facet=structure&facet=adresse&facet=aire_en_m")
    )
      .then((value) => {
        let locationList = value as any;
        this.locations = locationList.records;
      })
      .then(() => {
        this.creatingNewList()
      })

  }
  data: any = []
  creatingNewList() {
    let i = 0;
    this.locations.forEach((location: Location) => {

      location = new Location(
        location.address = this.locations[i].fields.adresse,
        location.shape = this.locations[i].fields.geo_shape.coordinates,
      );

      this.data.push(location);
  
      i++;
    }); 
      return this.data;
  }
}
