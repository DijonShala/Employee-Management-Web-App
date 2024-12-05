import { Injectable } from "@angular/core";
import { Employee } from "./employee";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  employee: Employee = {
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    departmentId: "",
    hireDate: "",
    salary: 0,

    clock_in_time: 33300000,
    clock_out_time: 36300000,

    clocked_in: false,
    clocked_in_time: 0,
  };

  addEmployee(employee: Employee) {
    return this.http.post<Employee[]>("/api/employee", employee);
  }

  getEmployee(): Employee {
    // TODO
    return this.employee;
  }

  getData() {
    this.http.get<Employee[]>("/api/employee-all").subscribe((employees) => {
      console.log(employees);
    });
  }

  clockEmployee() {
    // TODO
    let date = new Date();

    this.employee.clocked_in = !this.employee.clocked_in; // TODO
    this.employee.clocked_in_time = date.getTime(); // TODO
  }
}
