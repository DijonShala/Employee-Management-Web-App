import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-navbar",
  imports: [RouterModule, CommonModule],
  templateUrl: "./navbar.html",
  template: ``,
  styles: ``,
})
export class NavbarComponent {
  constructor(
    public employeeService: EmployeeService, // PUBLIC : accessible from navbar.html
    private router: Router
  ) {}
  ngOnInit() {}

  logout() {
    this.employeeService.logout();
    this.router.navigate(["/login"]);
  }
}
