import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from 'rxjs';
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

  public getConnectedUser(): any {
    return this.userRef.snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      )
  }
}
