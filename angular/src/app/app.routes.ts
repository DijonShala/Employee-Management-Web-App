import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ClockinComponent } from "./components/clockin/clockin.component";
import { Component } from "@angular/core";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { RegisterComponent } from "./components/register/register.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { loginGuard } from "./login.guard";
import { UserpageComponent } from "./components/userpage/userpage.component";
import { adminGuard } from "./admin.guard";
import { DepartmentsComponent } from "./components/departments/departments.component";
import { DepartmentComponent } from "./components/departments/department.component";

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
  {
    path: "departments",
    component: DepartmentsComponent,
    canActivate: [adminGuard],
  },
  {
    path: "department/:id",
    component: DepartmentComponent,
    canActivate: [adminGuard],
  },
  //{ path: "analytics/:id", component: SidebarComponent },
  { path: "**", redirectTo: "clockin" },
];
