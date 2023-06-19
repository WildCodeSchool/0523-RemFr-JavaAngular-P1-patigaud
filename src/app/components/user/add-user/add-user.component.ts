import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  user: any = new User();
  users: User[] = [];
  userFromDb: any;
  connectedUser: User = {}
  storedUser: any;
  connectedUserPseudo: any = "";
  retrievedUser: any;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveUsers();
    //Get connected user from local storage and by-pass login page if already connected
    this.userService.getConnectedUser()
      .subscribe((data: any) => {
        this.users = data;
        this.connectedUserPseudo = localStorage.getItem('pseudo');
        this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
        if (this.userFromDb.pseudo === this.connectedUserPseudo) {
          alert(`Utilisateur déjà connecté en tant que ${this.userFromDb.pseudo}, 
      avec le genre ${this.userFromDb.gender} et l'id ${this.userFromDb.key}`);
          this.router.navigate(['home']);
        }
      })
  }

  connectUser(): void {
    this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.user.pseudo.toLowerCase());

    if (this.userFromDb) {
      alert(`Utilisateur reconnu, vous allez être connecté en tant que ${this.userFromDb.pseudo}, 
     avec le genre ${this.userFromDb.gender} et l'id ${this.userFromDb.key}`);

      localStorage.setItem('pseudo', this.userFromDb.pseudo);
      this.router.navigate(['home']);
    }
    else {
      const createdUserKey = this.userService.create(this.user);
      this.user.key = createdUserKey;
      alert(`user created, vous allez être connecté en tant que ${this.user.pseudo}, 
      avec le genre ${this.user.gender} et l'id ${this.user.key}`);
      localStorage.setItem('pseudo', this.user.pseudo);

      this.router.navigate(['home']);
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
