import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map } from 'rxjs';
import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/user';

  userRef: AngularFireList<User>;
    reference:any;
    id: any;
    users: User[] = []; 

  constructor(private db: AngularFireDatabase) {
    this.userRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<User> {
    return this.userRef;
  }

  create(user: User): any {
    return this.userRef.push(user);
  }

  update(key: any, value: any): Promise<void> {
    return this.userRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.userRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.userRef.remove();
  }
}
