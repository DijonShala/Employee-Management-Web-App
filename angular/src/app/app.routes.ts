import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ClockinComponent } from "./clockin/clockin.component";
import { Component } from "@angular/core";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RegisterComponent } from "./register/register.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { loginGuard } from "./login.guard";
import { UserpageComponent } from "./userpage/userpage.component";
import { adminGuard } from "./admin.guard";

export const routes: Routes = [
  { path: "clockin", component: ClockinComponent, canActivate: [loginGuard] },
  { path: "calendar", component: CalendarComponent, canActivate: [loginGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent, canActivate: [adminGuard] },
  {
    path: "user/:name",
    component: UserpageComponent,
    canActivate: [adminGuard],
  },
  //{ path: "analytics/:id", component: SidebarComponent },
  { path: "**", redirectTo: "clockin" },
];
