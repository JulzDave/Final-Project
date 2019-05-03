import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './comp/home/home.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSidenavModule,
  MatButtonModule,
  MatGridListModule,
  MatIconModule,
  MatDialogModule,
  MatNativeDateModule
 } from '@angular/material';

import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrComponent } from './comp/err/err.component';
import { ShopComponent } from './comp/shop/shop.component';
import { AuthGuard } from './auth.guard';
import { RepDialogComponent } from './comp/rep-dialog/rep-dialog.component';
import { OrderComponent } from './comp/order/order.component';
import { NgHighlightModule } from 'ngx-text-highlight';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,

    ErrComponent,

    ShopComponent,

    RepDialogComponent,

    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatDialogModule,
    NgHighlightModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
    
],
  providers: [UserService, AuthGuard, MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents:[RepDialogComponent]
})
export class AppModule { }
