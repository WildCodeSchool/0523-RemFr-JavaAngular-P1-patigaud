import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Coordinates, GeolocService } from 'src/app/services/geoloc.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  userId = 'ID_UTILISATEUR';
  userName = '';
  userGender = '';
  distance = 0;

  constructor(private userService: UserService, private geolocService: GeolocService) {}

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUser(this.userId).subscribe(
      (user: any) => {
        this.userName = user.name;
        this.userGender = user.gender;
        this.calculateDistance(user);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
      }
    );
  }

  calculateDistance(user: any) {
    this.geolocService.getCurrentPosition().subscribe(
      (position: Coordinates) => {
        const latitudeStart = position.latitude;
        const longitudeStart = position.longitude;
        const latitudeEnd = user.latitude;
        const longitudeEnd = user.longitude;

        const distanceInMeters = this.calculateDistanceBetweenPoints(
          latitudeStart,
          longitudeStart,
          latitudeEnd,
          longitudeEnd
        );
        this.distance = this.convertMetersToKilometers(distanceInMeters);
      },
      (error: any) => {
        console.error('Erreur de géolocalisation :', error);
      }
    );
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
}