import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../location';

@Injectable({
  providedIn: 'root'
})
export class ApiGardenService {

  constructor(private httpClient: HttpClient) { }

  locations: any
  locationList: any

  public async getGardenList() {
    return this.httpClient
      .get("https://data.tours-metropole.fr/api/records/1.0/search/?dataset=espaces-verts-tours-metropole-val-de-loire&q=&rows=1000&facet=commune&facet=libelle&facet=structure&facet=adresse&facet=aire_en_m")
      .subscribe((response) => {
        this.creatingNewList(response)
      }
      )
  }


  data: any = []
  creatingNewList(response: any) {
    let i = 0;
    this.locationList = response;
    this.locations = this.locationList.records;

    this.locations.forEach((location: Location) => {

      location = new Location(
        location.id = this.locations[i].recordid,
        location.address = this.locations[i].fields.adresse,
        location.geoPoint = this.locations[i].geometry.coordinates,
        location.area = this.locations[i].fields.aire_en_m,
        location.structure = this.locations[i].fields.structure,
        location.postalCode = this.locations[i].fields.code_insee,
        location.label = this.locations[i].fields.libelle,
        location.city = this.locations[i].fields.commune,
        location.shape = this.locations[i].fields.geo_shape?.coordinates,
      );

      this.data.push(location);

      i++;
    });
    return this.data;
  }
}
