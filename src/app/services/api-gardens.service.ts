import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Location } from "../location";
import { map } from "rxjs";

interface OldLocationArray {
  recordid: string;
  fields: [
    adresse: string,
    aire_en_m: number,
    structure: string,
    code_insee: string,
    libelle: string,
    commune: string,
    geo_shape: {
      coordinates: number[];
    }
  ];
  geometry: number[];
}

interface OldLocationObject {
  records: [];
}

@Injectable({
  providedIn: "root",
})
export class ApiGardenService {
  constructor(private httpClient: HttpClient) {}

  locations: any;
  locationList: any;

  public getGardenList() {
    return this.httpClient
      .get<OldLocationObject>(
        "https://data.tours-metropole.fr/api/records/1.0/search/?dataset=espaces-verts-tours-metropole-val-de-loire&q=&rows=1000&facet=commune&facet=libelle&facet=structure&facet=adresse&facet=aire_en_m"
      )
      .pipe(
        map((response) => {
          return response.records.map(
            (recordLocation: any) =>
              new Location(
                recordLocation.recordid,
                recordLocation.fields.adresse,
                recordLocation.geometry.coordinates,
                recordLocation.fields.aire_en_m,
                recordLocation.fields.structure,
                recordLocation.fields.code_insee,
                recordLocation.fields.libelle,
                recordLocation.fields.commune,
                recordLocation.fields.geo_shape?.coordinates
              )
          );
        })
      );
  }
}
