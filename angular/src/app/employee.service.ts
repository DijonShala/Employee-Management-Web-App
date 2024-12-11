import { Injectable } from "@angular/core";
import {
  Attendance,
  Department,
  Employee,
  Leave,
  Salary,
  Task,
} from "./employee";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  logged_in: boolean = false;
  administrator: boolean = false;
  username = "";

  token: string = "superSecretPassword";

  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    let sessionStored_username = window.sessionStorage.getItem("username");
    this.username =
      sessionStored_username == null ? "" : sessionStored_username;

    if (this.username != "") {
      this.http.get<Employee>("/api/employee/".concat(this.username)).subscribe(
        (data) => {
          this.logged_in = true;
          if (data.jobTitle == "Administrator") {
            this.administrator = true;
          } else {
            this.administrator = false;
          }
        },
        (error) => {
          this.username = "";
        }
      );
    }
  }

  login(username: string) {
    window.sessionStorage.setItem("username", username);
    this.initialize();
  }

  logout() {
    window.sessionStorage.setItem("username", "");

    this.username = "";

    this.logged_in = false;
    this.administrator = false;
  }

  addEmployee(employee: Employee) {
    return this.http.post<Employee[]>("/api/employee", employee);
  }

  getEmployee(username: string = this.username) {
    return this.http.get<Employee>("/api/employee/".concat(username));
  }

  filterEmployee() {
    return this.http
      .get<Employee>("/api/employee-filter?firstName=Admin&nResults=10")
      .subscribe();
  }

  getEmployees() {
    return this.http.get<Employee[]>("/api/employee-all");
  }

  updateEmployee(username: string = this.username, employee: any) {
    return this.http.put<Employee>("/api/employee/".concat(username), employee);
  }

  removeEmployee(username: string) {
    return this.http.delete<Employee>("/api/employee/".concat(username));
  }

  getEmployeeAttendance() {
    return this.http.get<Attendance[]>(
      "/api/attendanceByUsername/".concat(this.username)
    );
  }

  clockIn(username: string = this.username) {
    return this.http.post<Attendance[]>("/api/clockIn/".concat(username), "");
  }

  clockOut(username: string = this.username) {
    return this.http.post<Attendance[]>("/api/clockOut/".concat(username), "");
  }

  // TASKS

  addTask(task: Task) {
    return this.http.post<Task>("/api/tasks", task);
  }
  getTasks() {
    return this.http.get("/api/tasks");
  }
  getEmployeeTasks(username: string) {
    return this.http.get("/api/tasks/".concat(username));
  }
  updateTask(taskid: string, status: { status: string }) {
    return this.http.put<string>(
      "/api/tasks/".concat(taskid).concat("/status"),
      status
    );
  }
  removeTask(taskid: string) {
    return this.http.delete("/api/tasks/".concat(taskid));
  }

  // LEAVES

  addLeave(leave: Leave) {
    return this.http.post<Leave>("/api/leaves", leave);
  }
  getLeaves() {
    return this.http.get("/api/leaves");
  }
  getEmployeeLeaves(username: string) {
    return this.http.get("/api/leaves/".concat(username));
  }
  updateLeave(leaveid: string, status: { status: string }) {
    return this.http.put<{ status: string }>(
      "/api/leaves/".concat(leaveid).concat("/status"),
      status
    );
  }
  removeLeave(leaveid: string) {
    return this.http.delete("/api/leaves/".concat(leaveid));
  }

  // SALARIES

  addSalary(salary: Salary) {
    return this.http.post<Salary>("/api/salaries", salary);
  }
  getSalaries(username: string) {
    return this.http.get("/api/salaries/".concat(username));
  }
  getSalariesMonth(month: number, year: number) {
    return this.http.get(
      "/api/salaries/month/"
        .concat(String(month))
        .concat("/year/")
        .concat(String(year))
    );
  }
  removeSalary(salaryid: string) {
    return this.http.delete("/api/salaries/".concat(salaryid));
  }

  // DEPARTMENTS

  addDepartment(department: Department) {
    return this.http.post<Department>("/api/department", department);
  }
  getDepartments() {
    return this.http.get<Department[]>("/api/departments");
  }
  getDepartment(departmentid: string) {
    return this.http.get<Department>("/api/department/".concat(departmentid));
  }
  updateDepartment(departmentid: string, data: Department) {
    return this.http.put<Department>(
      "/api/department/".concat(departmentid),
      data
    );
  }
  deleteDepartment(departmentid: string) {
    return this.http.delete("/api/department/".concat(departmentid));
  }
}
