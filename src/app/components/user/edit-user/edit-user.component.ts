import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  currentUser: User = {
    pseudo: '',
    gender: '',
    key: ''
  };
  message = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentUser = { ...this.currentUser };
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
        })
        .catch(err => console.log(err));
    }
  }
}
