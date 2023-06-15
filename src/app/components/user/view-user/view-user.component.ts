import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    pseudo: '',
    gender: '',
  };
  message = '';
  sub: any;
  users: any;
  allUsers: any;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): any {
    this.retrieveUsers();

    this.message = '';
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

  ngOnChanges(): void {
    this.message = '';
  }

  updateUser(): void {
    const data = {
      pseudo: this.currentUser.pseudo,
      gender: this.currentUser.gender
    };

    if (this.currentUser.key) {
      this.userService.update(this.currentUser.key, data)
        .then(() => this.message = 'The user was updated successfully!')
        .catch(err => console.log(err));
    }
  }

  deleteUser(): void {
    if (this.currentUser.key) {
      this.userService.delete(this.currentUser.key)
        .then(() => {
          this.message = 'The user was updated successfully!';
          this.currentUser.key = "";
          this.currentUser.pseudo = "";
          this.currentUser.gender = "";
        })
        .catch(err => console.log(err));
    }
  }
}
