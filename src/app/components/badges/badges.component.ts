import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Badge } from 'src/app/models/badge';
import { User } from 'src/app/models/user';
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

  public connectedBadge!: string | null;


  constructor(private db: AngularFireDatabase, private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.badgeRef = db.list(this.dbPath);
  }

  ngOnInit(): void {
    this.getConnectedBadge();
  }

  checkForConnectedUser() {
    if (localStorage.getItem('pseudo') != null) {
      this.userService.getConnectedUser()
        .subscribe((data: any) => {
          this.users = data;
          this.connectedUserPseudo = localStorage.getItem('pseudo');
          this.userFromDb = this.users.find(userFromDb => userFromDb.pseudo?.toLowerCase() === this.connectedUserPseudo.toLowerCase());
          this.retrievedUser = this.userFromDb;
          this.userBadges = this.retrievedUser.badges;

          for (let i = 0; i < this.badges.length; i++) {
            for (let j = 0; j < this.userBadges.length; j++) {
              if (this.badges[i].name === this.userBadges[j].name) {
                this.badges[i].gotIt = true;
                this.badgeObtentionDate[i] = this.userBadges[j].obtention_date;
                this.badgeObtentionNumber[i] = this.userBadges[j].obtention_number;
              }
            }
          }
        });
    } else {
      this.retrievedUser = null;
    }
  }

  getAll(): AngularFireList<Badge> {
    return this.badgeRef;
  }

  create(badge: Badge): any {
    console.log(badge);

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
