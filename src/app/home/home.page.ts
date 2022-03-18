import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userInfo: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe(userInfo => this.userInfo = JSON.stringify(userInfo));
  }

  signOut() {
    this.userService.signOut();
  }
}
