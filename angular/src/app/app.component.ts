import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ClockinComponent } from "./components/clockin/clockin.component";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { LoginComponent } from "./components/login/login.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { tokenInterceptor } from "./token.interceptor";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    NavbarComponent,
    ClockinComponent,
    SidebarComponent,
    LoginComponent,
  ],
  template: `
    <div class="container-fluid">
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent {}
