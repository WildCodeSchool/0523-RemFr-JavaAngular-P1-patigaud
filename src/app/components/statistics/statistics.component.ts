import { Component, OnInit } from '@angular/core';
import { Coordinates, GeolocService } from 'src/app/services/geoloc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Badge } from 'src/app/models/badge';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  sub: any;
  users: any;
  userLatitude: number | undefined;
  userLongitude: number | undefined;
  currentUser: any;
  userBadges: Badge[] = [];
  connectedUserPseudo: any = "";
  badgeObtentionDate: any[] = [];
  badgeObtentionNumber: number[] = [];
  badges: Badge[] = []
  badge: Badge = new Badge();
  userFromDb: any;
  retrievedUser: any;

  constructor(
    private userService: UserService,
    private geolocService: GeolocService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase
  ) {
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.checkForConnectedUser();
    this.calculateDistance(this.currentUser);
  }

  checkForConnectedUser() {
    if (localStorage.getItem('pseudo') != null) {
      this.userService.getConnectedUser()
        .subscribe((data: any) => {
          this.users = data;
          this.connectedUserPseudo = localStorage.getItem('pseudo');
          if (this.connectedUserPseudo != null && this.connectedUserPseudo !== undefined) {
            this.userFromDb = this.users.find((userFromDb: any) => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
            this.currentUser = this.userFromDb;
            this.currentUser.distance = 10;
            console.log(this.currentUser);
            this.userBadges = this.currentUser.badges;
            this.calculateDistance(this.currentUser); // Appel de calculateDistance() après avoir défini this.currentUser
          }
        });
    } else {
      this.retrievedUser = null;
    }
  }


  calculateDistance(currentUser: User) {
    this.geolocService.getCurrentPosition().subscribe(
      (position: Coordinates) => {
        const latitudeStart = position.latitude;
        const longitudeStart = position.longitude;
        const latitudeEnd = this.userLatitude !== undefined ? this.userLatitude : 0;
        const longitudeEnd = this.userLongitude !== undefined ? this.userLongitude : 0;
  
        const distanceInMeters = this.calculateDistanceBetweenPoints(
          latitudeStart,
          longitudeStart,
          latitudeEnd,
          longitudeEnd
        );
        this.currentUser.distance = this.convertMetersToKilometers(distanceInMeters);
        console.log(this.currentUser.distance); // Afficher la distance mise à jour avec trois décimales
      },
      (error: any) => {
        console.error('Erreur de géolocalisation :', error);
      }
    );
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
      return 1; // Ou une valeur par défaut appropriée si la distance est invalide
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
    return this.currentUser.badges.length;
    console.log(this.currentUser);
    // return 0;
  }
}
