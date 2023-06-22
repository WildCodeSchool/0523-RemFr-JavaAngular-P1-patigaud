import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Badge } from 'src/app/models/badge';
import { User } from 'src/app/models/user';
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
  reference: any;
  id: any;
  badges: any[] = [];
  sub: any;
  users: User[] = [];
  connectedUserPseudo: any = "";
  userFromDb: any;
  retrievedUser: any;
  userBadges: any[] = [];
  userBadge: any;
  result: any;
  obtention_date: Date = new Date();
  badgeObtentionDate: any[] = [];
  badgeObtentionNumber: number[] = [];
  private gardens: any[] = [];
  locations: any;
  public connectedBadge!: string | null;
  foundedGardens: any[] = [];
  numberOfBadgesByUser: number = 0;
  matchingResult: any = []

  constructor(
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private gardenService: GardenService,
  ) {
    this.badgeRef = db.list(this.dbPath);
  }

  ngOnInit(): void {
    this.getConnectedBadge();
    this.getVisitedgardens();
  }
  test: any = [];
  checkForConnectedUser() {
    if (localStorage.getItem('pseudo') != null) {
      this.userService.getConnectedUser()
        .subscribe((data: any) => {
          this.users = data;
          this.connectedUserPseudo = localStorage.getItem('pseudo');
          this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
          this.retrievedUser = this.userFromDb;
          this.userBadges = this.retrievedUser.badges;
          this.giveBadges()
          if (this.userBadges != undefined) {

            next: {
              this.retrievedUser = this.userFromDb;

              console.log(this.userBadges);
              this.badges;
              for (let i = 0; i < this.badges.length; i++) {
                let matchingBadge = this.userBadges.find((badge: any) => badge.name === this.badges[i].name);
                this.badges[i].gotIt = matchingBadge ? true : false;
                this.matchingResult.push(matchingBadge)
              }
            }
          }
        });


      // console.log(this.badges);


      // this.numberOfBadgesByUser = Object.keys(this.userBadges).length;
      // for (const propriety in this.userBadges) {
      //   this.badgeObtentionDate.push(this.userBadges[propriety].obtention_date);
      //   this.badgeObtentionNumber.push(this.userBadges[propriety].obtention_number);

      //   this.test.push(propriety);
      // } console.log(this.badgeObtentionNumber);

      // this.test = Object.entries(this.userBadges).map((badge: any) => {
      //   badge[1].gotIt = true;
      //   return badge;
      // })

      // for (let i = 0; i < this.numberOfBadgesByUser; i++) {


      //     this.badgeObtentionDate[i] = this.userBadges[i].obtention_date;
      //     this.badgeObtentionNumber[i] = this.userBadges[i].obtention_number;
      //   }     
    } else {
      this.retrievedUser = null;
    }
  }

  getAll(): AngularFireList<Badge> {
    return this.badgeRef;
  }

  getVisitedgardens() {
    this.gardenService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.gardens = data;
      })

  }

  giveBadges() {
    console.log(this.foundedGardens);



    const gardensLentgh = this.foundedGardens.length;
    if (this.badge = this.badges.find(badge => badge.name === "badge_1")){    

      let newBadge = { ...this.badge, obtention_number: 1 };
           this.userService.update(`${this.retrievedUser.key}/badges/1`, newBadge);
    }

    // switch (gardensLentgh) {

    //   case 1: this.badge = this.badges.find(badge => badge.name === "badge_1");
    //     let newBadge = { ...this.badge, obtention_date: date, obtention_number: 1 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/1`, newBadge);
    //     break
    //   case 2: this.badge = this.badges.find(badge => badge.name === "badge_2");
    //     let newBadge2 = { ...this.badge, obtention_date: date, obtention_number: 2 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/2`, newBadge2);
    //     break
    //   case 3: this.badge = this.badges.find(badge => badge.name === "badge_3");
    //     let newBadge3 = { ...this.badge, obtention_date: date, obtention_number: 3 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/3`, newBadge3);
    //     break
    //   case 4: this.badge = this.badges.find(badge => badge.name === "badge_4");
    //     let newBadge4 = { ...this.badge, obtention_date: date, obtention_number: 4 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/4`, newBadge4);
    //     break
    //   case 5: this.badge = this.badges.find(badge => badge.name === "badge_5");
    //     let newBadge5 = { ...this.badge, obtention_date: date, obtention_number: 5 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/5`, newBadge5);
    //     break
    //   case 6: this.badge = this.badges.find(badge => badge.name === "badge_6");
    //     let newBadge6 = { ...this.badge, obtention_date: date, obtention_number: 6 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/6`, newBadge6);
    //     break
    //   case 7: this.badge = this.badges.find(badge => badge.name === "badge_7");
    //     let newBadge7 = { ...this.badge, obtention_date: date, obtention_number: 7 };
    //     this.userService.update(`${this.retrievedUser.key}/badges/7`, newBadge7);
    //     break
    // }
    this.foundedGardens = this.gardens.map((garden: any) => {
      if (garden.userKey === this.retrievedUser.pseudo) {
        this.foundedGardens.push(garden);
      }
    })
    console.log(this.foundedGardens.length);

  }

  create(badge: Badge): any {

    const test = this.badgeRef.push(badge);
    const key = test.key;
    return key
  }

  update(key: any, value: any): Promise<void> {
    return this.badgeRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.badgeRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.badgeRef.remove();
  }

  public getConnectedBadge(): any {
    return this.badgeRef.snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.badges = data;
        this.checkForConnectedUser();
      })
  }

  isClicked: boolean = false;
  selectedBadge: any = -1;
  audio: HTMLAudioElement = new Audio("/assets/sounds/coin2.mp3");

  turnBadge(index: number) {
    this.selectedBadge = index;
    this.isClicked = !this.isClicked;
    this.audio.play();
  }
}
