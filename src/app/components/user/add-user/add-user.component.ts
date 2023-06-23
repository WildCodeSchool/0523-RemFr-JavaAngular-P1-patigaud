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
  connectedUserPseudo: any = "";
  freshlyConnectedUser = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveUsers();
    //Get connected user from local storage and by-pass login page if already connected
    this.userService.getConnectedUser()
      .subscribe((data: any) => {
        this.users = data;
        this.connectedUserPseudo = localStorage.getItem('pseudo');
        if (this.connectedUserPseudo != null) {
          this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
          if (this.userFromDb != null && this.userFromDb.pseudo === this.connectedUserPseudo) {
            localStorage.setItem('freshlyConnectedUser', 'true'); 
            this.router.navigate(['home']);
          }
        }
      })
  }

  connectUser(): void {
    this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.user.pseudo.toLowerCase());
    if (this.userFromDb) {
      localStorage.setItem('pseudo', this.userFromDb.pseudo);
      localStorage.setItem('freshlyConnectedUser', 'true');
      
      this.router.navigate(['home']);
    }
    else {
      const createdUserKey = this.userService.create(this.user);
      this.user.key = createdUserKey;
      localStorage.setItem('pseudo', this.user.pseudo);
      localStorage.setItem('freshlyConnectedUser', 'true');
      this.router.navigate(['home']);
    }
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
