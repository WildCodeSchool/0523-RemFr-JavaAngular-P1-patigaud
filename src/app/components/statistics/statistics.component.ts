import { Component, OnInit } from '@angular/core';
import { Coordinates, GeolocService } from 'src/app/services/geoloc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Badge } from 'src/app/models/badge';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  currentUser: User = {
    key: '',
    pseudo: '',
    gender: '',
    distance: 10,
    // badges: any = [],
  };
  sub: any;
  users: any;
  userLatitude: number | undefined;
  userLongitude: number | undefined;
  userFromDb: User | undefined;
  retrievedUser: any;
  userBadges: Badge[] = [];
  connectedUserPseudo: string | null = '';
  badgeObtentionDate: any[] = [];
  badgeObtentionNumber: number[] = [];
  badges: Badge[] = []
  badge: Badge = new Badge();

  constructor(
    private userService: UserService,
    private geolocService: GeolocService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.retrieveUsers();
    this.getCurrentPosition();
    this.userService.getConnectedUser()
      .subscribe((data: any) => {
        this.users = data;
        this.connectedUserPseudo = localStorage.getItem('pseudo');
        if (this.connectedUserPseudo != null) {
          this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
          if (this.userFromDb != undefined && this.userFromDb.pseudo === this.connectedUserPseudo) {
            localStorage.setItem('freshlyConnectedUser', 'true'); 
            this.router.navigate(['home']);
          }
        }
      })
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
      },
      (error: any) => {
        console.error('Erreur de géolocalisation :', error);
      }
    );
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
    return meters / 1000;
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
    return this.currentUser;
    console.log(this.currentUser);
    // return 0;
  }
}
