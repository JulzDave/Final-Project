import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { ErrComponent } from './comp/err/err.component';
import { ShopComponent } from './comp/shop/shop.component';
import { AuthGuard } from './auth.guard';
import { OrderComponent } from './comp/order/order.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'shop', redirectTo:'shop', pathMatch:'full',},
  {path:'shop',  canActivate:[AuthGuard], component:ShopComponent},
  {path:'order', redirectTo:'order', pathMatch:'full',},
  {path:'order',  canActivate:[AuthGuard], component:OrderComponent},
  { path: '**', pathMatch: 'full', redirectTo: '/404' },
  { path: '404', component: ErrComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
