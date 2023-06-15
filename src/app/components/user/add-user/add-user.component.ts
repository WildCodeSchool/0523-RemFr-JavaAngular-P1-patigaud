import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  user: any = new User();
  users: User[] = [];
  userFromDb: any;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  saveUser(): void {
    this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.user.pseudo.toLowerCase());
    if(this.userFromDb) {
           alert(`Utilisateur reconnu, vous allez être connecté en tant que ${this.userFromDb.pseudo}, 
     avec le genre ${this.userFromDb.gender} et l'id ${this.userFromDb.key}`);
      //TODO : launch app with this user
    }
  else {
      this.userService.create(this.user);
      alert('user created');
      //TODO : launch app with new User
    };
  }

  retrieveUsers(): void {
    this.userService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.users = data;
      })
  }
}
