import { Component } from "@angular/core";
import { Employee } from "../employee";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-register",
  imports: [FormsModule, JsonPipe, CommonModule],
  templateUrl: "./register.html",
  styles: ``,
})
export class RegisterComponent {
  employee: Employee = {
    adress: {
      street: "",
      city: "",
      zipcode: "",
      country: "",
    },

    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    departmentId: "",
    hireDate: "",
    salary: 0,
    status: "",
  };

  success_message: string = "";

  constructor(private employeeService: EmployeeService) {}

  addEmployee(employeeForm: NgForm) {
    let date: Date = new Date();
    this.employee.hireDate = String(date.getTime());
    this.employeeService
      .addEmployee(this.employee)
      .subscribe(
        (data) => (this.success_message = "Employee added successfully!")
      );

    employeeForm.reset();
  }
}
