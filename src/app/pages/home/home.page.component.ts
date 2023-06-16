import { Component, OnInit } from '@angular/core';
import { Location } from '../../location';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent implements OnInit {
  locations!: Location[];
  isLoading = true;
  loadingImg = './assets/loadingImg.png'
  test:any;
  dede:any;

  constructor(private apiGardenService: ApiGardenService, public userService: UserService) { }

  ngOnInit() {
    this.getLocations();
  
  
  }

  getLocations() {   
    this.test = localStorage.getItem('pseudo');
    console.log(this.test);
   console.log(this.userService.getConnectedUser())
    

    this.apiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.simulateMinimumLoadingTime();
    });
  
  }

  simulateMinimumLoadingTime() {
    setTimeout(() => { 
      this.isLoading = false;       
    }, 5000);
  }

}
