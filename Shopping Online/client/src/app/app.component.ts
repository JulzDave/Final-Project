import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  loading:boolean = false
constructor(private userService:UserService){}

  get user(): any { return this.userService.user; }
  get shopComp(): boolean { return this.userService.shopCompActive; }


  logOut() {
    this.loading = true
    this.userService.logOut().subscribe(data=>{});
    window.location.reload();
  };


 fixOverflow(){
  (document.getElementsByTagName("body") as HTMLCollectionOf<HTMLBodyElement>)[0].style.overflowY = "auto";
 }

 downloadApiDoc(){
   var filename = "api_doc_JB-Brunch.pdf";
   this.userService.downloadApiDoc(filename).subscribe(
     data => saveAs(data, filename),
     error => console.log(error)
     );
 }

}
