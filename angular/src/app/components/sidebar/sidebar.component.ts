import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";
import { Employee } from "../../employee";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-sidebar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class SidebarComponent {
  isCollapsed: boolean = false;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(public employeeService: EmployeeService) {}

  employees!: Observable<Employee[]>;

  ngOnInit() {
    this.employees = this.employeeService.getEmployees();
  }
}
