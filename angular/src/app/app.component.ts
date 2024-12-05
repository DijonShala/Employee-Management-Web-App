import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./navbar/navbar.component";
import { ClockinComponent } from "./clockin/clockin.component";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { LoginComponent } from "./login/login.component";

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
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}
