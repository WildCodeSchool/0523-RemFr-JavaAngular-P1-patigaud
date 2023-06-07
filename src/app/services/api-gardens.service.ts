import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiGardensService {

  constructor(private http: HttpClient) { }

  apiGardensUrl: string = "https://data.tours-metropole.fr/api/records/1.0/search/?dataset=espaces-verts-tours-metropole-val-de-loire&q=&facet=commune&facet=libelle&facet=structure&facet=adresse&facet=aire_en_m";
  getConfig() {
    console.log(this.apiGardensUrl);
    
    return this.http.get<ApiGardensService>(this.apiGardensUrl);
  } 

}
