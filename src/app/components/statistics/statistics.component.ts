import { Component, OnInit } from '@angular/core';
import { Coordinates, GeolocService } from 'src/app/services/geoloc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { map } from 'rxjs';
import { User } from 'src/app/models/user';

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
    distance: 10
  };
  sub: any;
  users: any;
  userLatitude: number | undefined;
  userLongitude: number | undefined;

  constructor(private userService: UserService, private geolocService: GeolocService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.retrieveUsers();
    this.getCurrentPosition();
  }

  calculateDistance(currentUser: any) {
    this.geolocService.getCurrentPosition().subscribe(
      (position: Coordinates) => {
        const latitudeStart = position.latitude;
        const longitudeStart = position.longitude;
        const latitudeEnd = currentUser.userLatitude;
        const longitudeEnd = currentUser.userLongitude;

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
        this.sub = this.activatedRoute.paramMap.subscribe((params) => {
          this.currentUser.key = params.get('key');
          this.users.forEach((user: User) => {
  
            if (this.currentUser.key === user.key) {
              this.currentUser.pseudo = user.pseudo;
              //TODO : remove key after all tests
              this.currentUser.key = user.key;
              this.currentUser.gender = user.gender;
              this.calculateDistance(this.currentUser);
            }
          });
        });
      })
  }

  calculateDistanceBetweenPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
    return meters / 1000;
  }


disconnectUser(): void {
  localStorage.clear();
  this.router.navigate(['/']);
}

deleteUser(): void {
  if (this.currentUser.key) {
    this.userService.delete(this.currentUser.key)
      .then(() => {
        this.currentUser.key = "";
        this.currentUser.pseudo = "";
        this.currentUser.gender = "";
        localStorage.clear();
        this.router.navigate(['/']);
      })
      .catch(err => console.log(err));
  }
}

getCurrentPosition(): void {
  this.geolocService.getCurrentPosition().subscribe({
    next: (coords: Coordinates) => {
      this.userLatitude = coords.latitude
      this.userLongitude = coords.longitude
    },
    error: (error: string) => {
      console.error(error);
    },
    complete: () => {
      console.log('done')
    }
  });
}

}
