import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions:any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

var userName: string;
var password: string;
var validated: boolean;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: any;
  shopCompActive:boolean = false;
  
  constructor(private http: HttpClient) { }



  register(ev: any): Observable<any> {
    
    return this.http.post('/api/register', ev,
      httpOptions);
  }

  getAllUsers(ev: any): Observable<any> {


    return this.http.post('/api/allusers', {
        ID: ev.ID,
        userName: ev.userName,
        password: ev.password
    }, httpOptions);
    
  }
  
  

  checkSession(): Observable<any> {
    return this.http.get('/api/prelog');
  }

  auth(ev: any): void {
    this.user = ev;
    
    userName = ev.userName,
      password = ev.password
  }

  authStep2(): boolean {

    this.getAllUsers({ userName: userName, password: password }).subscribe(data => {
      
      if (userName === data.userName && password === data.password) {
        
        validated = true;
      }
      else {
        validated = false;
      }
    });

    return validated;


  }

  logOut(): Observable<any> {
    return this.http.get('/api/logout');
  }

  searchUserProducts(ev: any): Observable<any> {
    return this.http.get('/api/searchUserProducts', {
      params: {
        cartID: ev
      }
    });
  }
  
  
  categories(): Observable<any> {
    return this.http.get('/api/category');
  }

  getProducts():Observable<any> {
    return this.http.get('/api/products');
}

  getOrders():Observable<any> {
    return this.http.get('/api/allOrders');
}

searchCart(ev: string): Observable<any> {
  return this.http.get('/api/searchCart', {
    params: {
      userID: ev
    }
  });
}

searchOrder(ev: string): Observable<any> {
  return this.http.get('/api/searchOrder', {
    params: {
      userID: ev
    }
  });
}

downloadApiDoc(file:string): Observable<any>{
  var body:any = {filename:file};
  return this.http.post('/shopping/api', body,{
    responseType:'blob',
    headers: new HttpHeaders().append('Content-Type','application/json')
  });
}

}
