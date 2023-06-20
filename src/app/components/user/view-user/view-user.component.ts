import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  currentUser: User = {
    key: '',
    pseudo: '',
    gender: '',
  };
  sub: any;
  users: any;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): any {
    this.retrieveUsers();
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
            }
          });
        });
      })
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
}
