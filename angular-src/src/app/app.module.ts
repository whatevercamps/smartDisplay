import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ImagesService } from './services/images.service';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]}
]



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgFlashMessagesModule.forRoot()
  ],
  providers: [ValidateService, AuthService, AuthGuard, ImagesService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
