import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../employee.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [FormsModule, JsonPipe, CommonModule],
  templateUrl: "./login.html",
  styles: ``,
})
export class LoginComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  userName: string = "";
  password: string = "";

  login(employeeForm: NgForm) {
    this.employeeService.getEmployee(this.userName).subscribe(
      (data) => {
        console.log(data.salary);
        this.router.navigate(["/"]);
      },
      (error) => {
        console.log("ERROR HAS OCCURED");
      }
    );

    employeeForm.reset();
  }
}
