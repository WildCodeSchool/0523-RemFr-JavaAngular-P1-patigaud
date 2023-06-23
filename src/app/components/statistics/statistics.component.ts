import { Component, OnInit, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Coordinates, GeolocService } from 'src/app/services/geoloc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { Badge } from 'src/app/models/badge';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { Garden } from 'src/app/models/garden';
import { GardenService } from "src/app/services/garden/garden.service";
import { Location } from "../../location";
import { ApiGardenService } from "src/app/services/api-garden/api-gardens.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewChecked { //OnChanges, 

  sub: any;
  users: any;
  userLatitude: any;
  userLongitude: any;
  public currentUser: any = "";
  userBadges: Badge[] = [];
  connectedUserPseudo: any = "";
  badgeObtentionDate: any[] = [];
  badgeObtentionNumber: number[] = [];
  badges: Badge[] = []
  badge: Badge = new Badge();
  userFromDb: any;
  retrievedUser: any;
  private readyGardens = false
  private readyAPI = false
  private allUsers: User[] = [];
  private gardens: Garden[] = []; 
  private locations!: Location[];
  public totalArea = 0; 
  public numberOfGarden = 0;
  public calculatedDistance = 0;
  public userPseudo : any = "";

  constructor(
    private userService: UserService,
    private geolocService: GeolocService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase,
    private GardenService: GardenService,
    private ApiGardenService: ApiGardenService,
  ) {
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.getAllGardens();
    this.getAllUsers();
    this.getLocations();
    this.calculateDistance()
    this.checkForConnectedUser().subscribe(() => {
      this.calculateDistance();
    });
  }

 /*
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUser']) {
      this.calculateDistance(changes['currentUser'].currentValue);
    }
  } */

  ngAfterViewChecked(): void {
      if(this.readyGardens && this.readyAPI) {
        this.readyGardens = false
        this.readyAPI = false
        this.userPseudo = localStorage.getItem('pseudo')
        this.calcAreas()
      }
  }

  calcAreas(): void {
    const currentUser = localStorage.getItem('pseudo')
    let area = 0
    let foundGarden = 0
    for(let i = 0; i < this.gardens.length; i++) {
        if (this.gardens[i].userKey == currentUser) {
          foundGarden += 1
          for(let j = 0; j < this.locations.length; j++) {
            if (this.locations[j].id == this.gardens[i].gardenId) {
              area += this.locations[j].area

            }
          }
        }
    }
    this.numberOfGarden = foundGarden
    this.totalArea = area
  }  

  getLocations() {
    this.ApiGardenService.getGardenList().subscribe((response) => {
      this.locations = response;
      this.readyAPI = true
    });
  }  

  getAllGardens() {
    this.GardenService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe((data: any) => {
        this.gardens = data;
        this.readyGardens = true
      })    
  }
  
  getAllUsers() {
    this.userService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe((data: any) => {
        this.allUsers = data;
        const currentUser = localStorage.getItem('pseudo')
        for (let i = 0; i < this.allUsers.length; i++) {
          if ((this.allUsers[i].pseudo == currentUser) && this.allUsers[i].distance) {
            this.calculatedDistance = this.allUsers[i].distance
          }
        }
      })     
  }

  checkForConnectedUser(): Observable<any> {
    return new Observable<any>((observer) => {
      if (localStorage.getItem('pseudo') != null) {
        this.userService.getConnectedUser().subscribe((data: any) => {
          this.users = data;
          this.connectedUserPseudo = localStorage.getItem('pseudo');
          if (this.connectedUserPseudo != null && this.connectedUserPseudo !== undefined) {
            this.userFromDb = this.users.find((userFromDb: any) => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
            if (this.userFromDb) {
              this.currentUser = this.userFromDb;
              this.currentUser.distance = 10;
              console.log(this.currentUser);
              this.userBadges = this.currentUser.badges;
              observer.next();
              observer.complete();
            } else {
              observer.error('User not found');
            }
          } else {
            observer.error('Connected user pseudo is null or undefined');
          }
        });
      } else {
        this.retrievedUser = null;
        observer.error('Local storage pseudo is null');
      }
    });
  }


  calculateDistance(): void {
      this.geolocService.getCurrentPosition().subscribe({
        next: ((position: any) => {
          const latitudeStart = position.Lat;
          const longitudeStart = position.Lon;
          const latitudeEnd = this.userLatitude !== undefined ? this.userLatitude : 0;
          const longitudeEnd = this.userLongitude !== undefined ? this.userLongitude : 0;          
          const distanceInMeters = this.calculateDistanceBetweenPoints(
            latitudeStart,
            longitudeStart,
            latitudeEnd,
            longitudeEnd
          );
          if (typeof(this.convertMetersToKilometers(distanceInMeters)) == "number") {
            this.calculatedDistance += this.convertMetersToKilometers(distanceInMeters)
          }                    
       }),
       error: ((error: any) => {
          console.error('Erreur de géolocalisation :', error);
        })
      });
  }

  calculateDistanceBetweenPoints(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadius = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
      Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;
    return distance;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  convertMetersToKilometers(meters: number): number {
    if (isNaN(meters) || meters === undefined) {
      return 0; // Ou une valeur par défaut appropriée si la distance est invalide
    }
    return parseFloat((meters / 1000).toFixed(3)); // Utiliser toFixed(3) pour afficher trois décimales
  }

  disconnectUser(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  deleteUser(): void {
    if (this.currentUser.key) {
      this.userService
        .delete(this.currentUser.key)
        .then(() => {
          this.currentUser.key = '';
          this.currentUser.pseudo = '';
          this.currentUser.gender = '';
          localStorage.clear();
          this.router.navigate(['/']);
        })
        .catch(err => console.log(err));
    }
  }

  getCurrentPosition(): void {
    this.geolocService.getCurrentPosition().subscribe({
      next: (coords: Coordinates) => {
        this.userLatitude = coords.latitude !== undefined ? coords.latitude : 0;
        this.userLongitude = coords.longitude !== undefined ? coords.longitude : 0;
        this.calculateDistance();
      },
      error: (error: string) => {
        console.error(error);
      },
      complete: () => {
        console.log('done');
      }
    });
  }

  getNumberOfUnlockedBadges(): any {
    return this.userBadges.length;
    //console.log(this.currentUser);
    // return 0;
  }
}
