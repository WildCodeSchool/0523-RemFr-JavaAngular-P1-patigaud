import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users?: User[];
  currentUser?: User;
  currentIndex = -1;
  pseudo = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  refreshList(): void {
    this.currentUser = undefined;
    this.currentIndex = -1;
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
        this.users = data;    this.users!.forEach(user => {      
      });
      });
  
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  removeAllusers(): void {
    this.userService.deleteAll()
    .then(() => this.refreshList())
    .catch(err => console.log(err));
  }

}
