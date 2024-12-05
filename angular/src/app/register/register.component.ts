import { Component } from "@angular/core";
import { Employee } from "../employee";
import { FormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-register",
  imports: [FormsModule, JsonPipe],
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

  addEmployee() {
    this.employeeService
      .addEmployee(this.employee)
      .subscribe(
        (data) => (this.success_message = "Employee added successfully!")
      );
  }
}
