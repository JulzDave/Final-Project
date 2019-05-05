import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean {

   

    if(this.userService.authStep2()){
    return this.userService.authStep2();
  }
  else{
    this.router.navigate(['home']);
  }
  }
}
