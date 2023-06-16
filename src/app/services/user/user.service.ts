import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/user';

  userRef: AngularFireList<User>;
  reference: any;
  id: any;
  users: any[] = [];
  userPseudo: any = "";
  userFromDb: any;
  retrievedUser: any;

  public connectedUser!: string | null;

  constructor(private db: AngularFireDatabase) {
    this.userRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<User> {
    return this.userRef;
  }

  create(user: User): any {
    const test = this.userRef.push(user);
    const key = test.key;
    return key
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

  setConnectedUser(connectedUser: User) {
    // this.connectedUser = connectedUser;
  }

  getConnectedUser(): any {

    this.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.users = data; 
        this.userPseudo = localStorage.getItem('pseudo');
        this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.userPseudo.toLowerCase());
        console.log(this.userFromDb);
        return this.retrievedUser = this.userFromDb;
      })
  }
}
