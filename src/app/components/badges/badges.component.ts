import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Badge } from 'src/app/models/badge';
import { User } from 'src/app/models/user';
import { ApiGardenService } from 'src/app/services/api-garden/api-gardens.service';
import { GardenService } from 'src/app/services/garden/garden.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
  private dbPath = '/badge';

  badge: Badge = new Badge();
  badgeRef: AngularFireList<Badge>;
  badges: any[] = [];
  users: User[] = [];
  connectedUserPseudo: any = "";
  retrievedUser: any;
  userBadges: any;
  matchingResult: any = [];
  gardensLoaded = false;
  allGardensAPI: any[] = [];
  selectedBadge = -1;
  audio: HTMLAudioElement = new Audio("/assets/sounds/coin2.mp3");

  constructor(
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private gardenService: GardenService,
    private apiGardenService: ApiGardenService
  ) {
    this.badgeRef = db.list(this.dbPath);
  }

  ngOnInit(): void {
    this.getConnectedBadge();
    this.checkForConnectedUser();
    this.getAllAPIGardens();
  }

  checkForConnectedUser() {
    const localStoragePseudo = localStorage.getItem('pseudo');
    if (localStoragePseudo) {
      this.userService.getConnectedUser().subscribe((data: any) => {
        this.users = data;
        this.connectedUserPseudo = localStoragePseudo;
        this.retrievedUser = this.users.find((userFromDb: any) =>
          userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase()
        );
        this.userBadges = this.retrievedUser?.badges || [];

        this.getVisitedGardens();

        if (typeof this.userBadges === 'object') {
          this.badges.forEach((badge: any) => {
            const matchingBadge = this.userBadges[badge.name];
            badge.gotIt = !!matchingBadge;
            this.matchingResult.push(matchingBadge);
          });
        }
      });
    } else {
      this.retrievedUser = null;
    }
  }

  giveBadges(gardens: any[]) {
    const allGardensConnectedUser = gardens.filter(garden => garden.userKey === this.retrievedUser.pseudo);
    const biggestGarden = this.allGardensAPI.reduce((prev, current) => (prev.area > current.area) ? prev : current);
    const smallestGarden = this.allGardensAPI.reduce((prev, current) => (prev.area < current.area) ? prev : current);
    const allGardensInTheCityOfTours = this.allGardensAPI.filter(garden => garden.city === "Tours");

    const date = new Date();

    for (let i = 0; i < allGardensConnectedUser.length; i++) {
      const garden = allGardensConnectedUser[i];

      if (allGardensConnectedUser.length === 1 && this.userBadges["badge_1"] === undefined) {
        this.updateUserBadge("badge_1", date, 1);
      }

      if (allGardensConnectedUser.length === 2 && this.userBadges["badge_2"] === undefined) {
        this.updateUserBadge("badge_2", date, 2);
      }

      if (garden.gardenId === biggestGarden.id && this.userBadges["badge_3"] === undefined) {
        this.updateUserBadge("badge_3", date, 3);
      }

      if (allGardensConnectedUser.length === allGardensInTheCityOfTours.length && this.userBadges["badge_4"] === undefined) {
        this.updateUserBadge("badge_4", date, 4);
      }

      if (allGardensConnectedUser.length === 10 && this.userBadges["badge_5"] === undefined) {
        this.updateUserBadge("badge_5", date, 5);
      }

      if (garden.gardenId === smallestGarden.id && this.userBadges["badge_6"] === undefined) {
        this.updateUserBadge("badge_6", date, 6);
      }

      if (allGardensConnectedUser.length >= 100 && this.userBadges["badge_7"] === undefined) {
        this.updateUserBadge("badge_7", date, 7);
      }
    }
  }



  updateUserBadge(badgeName: string, date: Date, number: number) {
    const badge = this.badges.find(b => b.name === badgeName);
    if (badge) {
      const newBadge = { ...badge, obtention_date: date, obtention_number: number };
      this.userService.updateUserBadge(this.retrievedUser.key, newBadge);
    }
  }

  create(badge: Badge) {
    if (!this.retrievedUser.badges) {
      this.retrievedUser.badges = [];
    }

    badge.obtention_date = new Date().toLocaleDateString();
    badge.obtention_number = this.retrievedUser.badges.length + 1;

    this.retrievedUser.badges.push(badge);
    this.userService.update(this.retrievedUser.key, { badges: this.retrievedUser.badges })
      .then(() => {
        this.matchingResult.push(badge);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVisitedGardens() {
    if (!this.gardensLoaded) {
      this.gardenService.getAll().snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c =>
              ({ key: c.payload.key, ...c.payload.val() })
            )
          )
        ).subscribe(data => {
          this.gardensLoaded = true;
          this.giveBadges(data);
        });
    }
  }

  getAllAPIGardens() {
    this.apiGardenService.getGardenList().subscribe((data: any) => {
      this.allGardensAPI = data;
    });
  }

  getConnectedBadge(): any {
    return this.badgeRef.snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.badges = data;
      });
  }

  turnBadge(index: number) {
    this.selectedBadge = index;
    this.audio.play();
  }
}
