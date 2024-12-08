import { Injectable } from "@angular/core";
import { Attendance, Employee } from "./employee";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  logged_in: boolean = false;
  username = "";

  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    let username_or_null = window.sessionStorage.getItem("username");

    if (username_or_null != null && username_or_null != "") {
      this.username = username_or_null;
      this.logged_in = true;
    }

    if (this.logged_in) {
      this.getEmployee();
    }
  }

  login(username: string) {
    window.sessionStorage.setItem("username", "admin");
    this.initialize();
  }

  logout() {
    window.sessionStorage.setItem("username", "");

    this.logged_in = false;
    this.username = "";
  }

  addEmployee(employee: Employee) {
    return this.http.post<Employee[]>("/api/employee", employee);
  }

  getEmployee() {
    this.http.get<Employee>("/api/employee/".concat(this.username)).subscribe(
      (data) => {
        this.employee = data;

        this.employee_set = true;
        return this.employee;
      },
      (error) => {}
    );
  }

  getEmployees() {
    return this.http.get<Employee[]>("/api/employee-all");
  }

  employee_ID = "674737c3aaed835895f993d1";
  updateEmployee() {
    this.http
      .put<Employee>("api/employee/".concat(this.employee_ID), this.employee)
      .subscribe(
        (data) => {},
        (error) => {}
      );
  }

  getEmployeeAttendance() {
    return this.http.get<Attendance[]>(
      "/api/attendanceByUsername/".concat(this.username)
    );
  }

  clockEmployee() {
    if (this.employee.status == "active") {
      this.clockOut();
    } else {
      this.clockIn();
    }
  }

  clockIn() {
    console.log("Clocked in");

    this.employee.status = "active";
    this.updateEmployee();
    this.http
      .post<Attendance[]>("/api/clockIn/".concat(this.username), "")
      .subscribe(
        (data) => {},
        (error) => {}
      );
  }

  clockOut() {
    console.log("Clocked out");

    this.employee.status = "inactive";
    this.updateEmployee();
    this.http
      .post<Attendance[]>("/api/clockOut/".concat(this.username), "")
      .subscribe(
        (data) => {},
        (error) => {}
      );
  }

  employee_set: boolean = false;

  employee!: Employee;
}
