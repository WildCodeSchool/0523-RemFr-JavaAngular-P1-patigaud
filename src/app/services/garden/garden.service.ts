import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from 'rxjs';
import { Garden } from 'src/app/models/garden';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';


@Injectable({
  providedIn: 'root'
})

export class GardenService {

  private dbPath = '/garden';
  gardenRef: AngularFireList<Garden>;
  gardens: any[] = [];


  constructor(private db: AngularFireDatabase) {
    this.gardenRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Garden> {
    return this.gardenRef;
  }

  create(garden: Garden): any {
    const test = this.gardenRef.push(garden);
    const key = test.key;
    return key
  }

  update(key: any, value: any): Promise<void> {
    return this.gardenRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.gardenRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.gardenRef.remove();
  }

}
