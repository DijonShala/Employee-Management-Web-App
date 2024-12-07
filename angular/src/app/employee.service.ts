import { Injectable } from "@angular/core";
import { Attendance, Employee } from "./employee";
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

  getEmployeeMock(): Employee {
    // TODO
    return this.employee;
  }

  getEmployee(username: string) {
    return this.http.get<Employee>("/api/employee/".concat(username));
  }

  getEmployees() {
    return this.http.get<Employee[]>("/api/employee-all");
  }

  start_hour = new Date("Tue Dec 05 2024 00:00:00 GMT+0100");

  getEmployeeClocks(username: string) {
    return this.attendances;
  }

  clockEmployee() {
    // TODO
    let date = new Date();

    this.employee.clocked_in = !this.employee.clocked_in; // TODO
    this.employee.clocked_in_time = date.getTime(); // TODO
  }

  // LONG Attendance LIST

  attendances: Attendance[] = [
    {
      employee_ID: "admin",
      clock_in_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 1
      ),
      clock_out_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 3
      ),
      status: "work",
    },

    {
      employee_ID: "admin",
      clock_in_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 6
      ),
      clock_out_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 9
      ),
      status: "work",
    },

    {
      employee_ID: "admin",
      clock_in_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 11
      ),
      clock_out_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate(),
        this.start_hour.getHours() + 12,
        this.start_hour.getMinutes() + 30
      ),
      status: "work",
    },

    {
      employee_ID: "admin",
      clock_in_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate() + 3,
        this.start_hour.getHours() + 11
      ),
      clock_out_time: new Date(
        this.start_hour.getFullYear(),
        this.start_hour.getMonth(),
        this.start_hour.getDate() + 5,
        this.start_hour.getHours() + 2,
        this.start_hour.getMinutes() + 30
      ),
      status: "work",
    },
  ];
}
