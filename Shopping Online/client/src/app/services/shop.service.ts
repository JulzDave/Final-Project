import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  order: any;
  orderCost: number;
  user: any;
  cart: any;

  constructor(private http: HttpClient) { }


  createCart(ev: string): Observable<any> {
    return this.http.post('/api/createCart', {
      userID: ev,
    }, httpOptions);
  }

  insertToCart(ev: any): Observable<any> {
    return this.http.get('/api/insertToCartMethod', {
      params: {
        cart: ev.cart,
        chosenProductID: ev.chosenProductID,
        amount: ev.amount,
        totalPrice: ev.totalPrice,
      }
    });
  }

  searchUserCart(ev: any): Observable<any> {
    return this.http.get('/api/searchUserCart', {
      params: {
        userID: ev
      }
    });
  }

  displayUserProducts(ev: any): Observable<any> {
    return this.http.get('/api/displayUserProducts', {
      params: {
        prod: ev.map((prod) => { return prod.prodID })
      }
    });
  }

  deleteProd(id): Observable<any> {
    return this.http.delete('/api/del/' + id.product, {
      params: {
        cartID: id.cart
      }
    });
  }

  deleteCart(cartID: string): Observable<any> {
    return this.http.delete('/api/delCart/' + cartID);
  }

  discardCart(cartID: string) {
    return this.http.delete('/api/discardCart/' + cartID);
  }

  goToOrder(ev: any): void {
    this.order = ev.myProducts;
    this.orderCost = ev.orderCost;
    this.user = ev.user;
    this.cart = ev.cart
  }

  CreateNewOrder(ev: any): Observable<any> {
    return this.http.post('/api/order', {
      userID: ev.myCart[0].client,
      cartID: ev.myCart[0]._id,
      debit: parseFloat(ev.orderCost),
      city: ev.orderDetails.city.value,
      street: ev.orderDetails.street.value,
      houseNum: ev.orderDetails.houseNumber.value,
      apt: ev.orderDetails.aptNumber.value,
      scheduled: ev.orderDetails.deliveryDate.value.toString(),
      generated: new Date().toString(),
      card: parseInt(ev.orderDetails.creditCard.value.toString().substr(-4)),
      cvv: ev.orderDetails.cvv.value,
      cardExp: ev.orderDetails.expirationDate.value.toString()
    }, httpOptions);
  }

  lockCartProd(ev: any): Observable<any> {
    return this.http.put('/api/lockCartProd/', {
      cartID: ev.cartID,
      generated: ev.generated
    }, httpOptions);
  }

  lockCart(ev: any): Observable<any> {
    return this.http.put('/api/lockCart/', {
      userID: ev.userID,
      generated: ev.generated
    }, httpOptions);
  }

  getOrders(): Observable<any> {
    return this.http.get('/api/allOrders');
  }

  adminAdd(ev: any): Observable<any> {
    return this.http.post('/api/adminProduct', {
      title: ev.title,
      type: ev.type,
      description: ev.description,
      url: ev.url,
      price: ev.price
    }, httpOptions);
  }

  adminSearchProduct(ev: string): Observable<any> {
    return this.http.get('/api/adminProduct', {
      params: {
        prodID: ev
      }
    });
  }

  adminEditProduct(ev: any): Observable<any> {
    return this.http.put('/api/adminProduct/', {
      prodID: ev.prodID,
      title: ev.title,
      type: ev.type,
      description: ev.description,
      url: ev.url,
      price: ev.price
    }, httpOptions);
  }

  adminUploadImage(ev: File): Observable<any> {
    const myFormData = new FormData();
    const imageDate = new Date();
    const imgName = ev.name.split(".")[0] + "_" + imageDate.getTime() + "." + ev.name.split(".")[1];
    myFormData.append("productImage", ev, imgName);
    return this.http.post("api/admin_img_upload", myFormData)
  }

}
