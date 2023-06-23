import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private userService: UserService) { }

  users: User[] = [];
  connectedUserPseudo: any = "";
  userFromDb: any;
  retrievedUser: any;

  ngOnInit(): void {
    this.checkForConnectedUser();
  }

  checkForConnectedUser() {
    if (localStorage.getItem('pseudo') != null) {
      this.userService.getConnectedUser()
        .subscribe((data: any) => {
          this.users = data;
          this.connectedUserPseudo = localStorage.getItem('pseudo');
          this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
          this.retrievedUser = this.userFromDb;
        })
    } else {
      this.retrievedUser = null;
    }
  }
}
