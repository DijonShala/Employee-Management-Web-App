import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ClockinComponent } from "./clockin/clockin.component";
import { Component } from "@angular/core";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RegisterComponent } from "./register/register.component";

export const routes: Routes = [
  { path: "", component: ClockinComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  //{ path: "analytics/:id", component: SidebarComponent },
  { path: "**", redirectTo: "" },
];
