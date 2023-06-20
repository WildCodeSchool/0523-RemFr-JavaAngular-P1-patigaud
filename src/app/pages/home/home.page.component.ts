import { Component, OnInit } from '@angular/core';
import { Location } from '../../location';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent implements OnInit {
  locations!: Location[];
  isLoading = true;
  loadingImg = './assets/loadingImg.png'
  users: any[] = [];
  userPseudo: any = "";
  userFromDb: any;
  retrievedUser: any;
  freshlyConnectedUser?: string | null;
  constructor(private apiGardenService: ApiGardenService, public userService: UserService, private router: Router) { }

  ngOnInit() {
    this.getLocations();

    this.userService.getConnectedUser()
      .subscribe((data: any) => {
        this.users = data;
        this.userPseudo = localStorage.getItem('pseudo');
        this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.userPseudo.toLowerCase());
        this.retrievedUser = this.userFromDb;
      })
  }

  getLocations() {
    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.simulateMinimumLoadingTime();
    });
  }

  simulateMinimumLoadingTime() {
    this.freshlyConnectedUser = localStorage.getItem('freshlyConnectedUser');

    if (this.freshlyConnectedUser === 'true') {
      setTimeout(() => {
        this.isLoading = false;
        localStorage.setItem('freshlyConnectedUser', 'false');
      }, 5000);
    } else {
      setTimeout(() => {
        this.isLoading = false;
      }, 0);
    }
  }

}
