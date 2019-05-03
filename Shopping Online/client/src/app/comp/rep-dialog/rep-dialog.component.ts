import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'
import { Inject } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { UserService } from 'src/app/services/user.service';

var user:any;

@Component({
  selector: 'app-rep-dialog',
  templateUrl: './rep-dialog.component.html',
  styleUrls: ['./rep-dialog.component.css']
})
export class RepDialogComponent implements OnInit {

  chosenProduct: string;
  amount: number;
  totProdPrice: any;
  user: any;
  chosenProductID: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private shopService: ShopService, private userService: UserService) { }

  plusP() {
    this.amount = this.amount + 1;
    this.totProdPrice = parseFloat(this.totProdPrice) + parseFloat(this.data.product.getElementsByTagName("mat-card-subtitle")[0].innerText.split("$")[1]);
    this.totProdPrice = this.totProdPrice.toString().substr(0, 6);
    
  }

  minusP() {
    if (parseFloat(this.totProdPrice) - parseFloat(this.data.product.getElementsByTagName("mat-card-subtitle")[0].innerText.split("$")[1]) > 0) {
      this.amount = this.amount - 1;
      this.totProdPrice = parseFloat(this.totProdPrice) - parseFloat(this.data.product.getElementsByTagName("mat-card-subtitle")[0].innerText.split("$")[1]);
      this.totProdPrice = this.totProdPrice.toString().substr(0, 6);
    }
  }

  addProduct() {
    this.userService.searchCart(this.user._id).subscribe(data => {
      debugger;
      if (!data) {
        this.shopService.createCart(this.user._id).subscribe(data2 => {

          this.shopService.insertToCart({
            cart: data2._id, // cart id
            chosenProductID: this.chosenProductID,
            amount: this.amount,
            totalPrice: this.totProdPrice
          }).subscribe(data3 => {
            
          });
          
        });
      }
      else {
        this.shopService.insertToCart({
          cart: data._id, // cart id
          chosenProductID: this.chosenProductID,
          amount: this.amount,
          totalPrice: this.totProdPrice
        }).subscribe(data3 => {
          
        });
      }
    })
  }

  ngOnInit() {
    this.chosenProduct = this.data.product;
    this.amount = 1;
    debugger;
    this.totProdPrice = this.data.product.getElementsByTagName("mat-card-subtitle")[0].innerText.split("$")[1];
    this.chosenProductID = this.data.product.getElementsByTagName("img")[0].id
    this.user = this.data.user;
    user = this.data.user;
    debugger;
  }
}

