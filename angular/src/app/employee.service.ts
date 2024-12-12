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
import { environment } from '../environments/environment';
@Injectable({
  providedIn: "root",
})

export class EmployeeService {
  logged_in: boolean = false;
  administrator: boolean = false;

  username: string = "";
  token: string = "";

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    //private apiUrl = environment.apiUrl
    this.initialize();
  }

  initialize() {
    let sessionStored_username = window.sessionStorage.getItem("username");
    this.username =
      sessionStored_username == null ? "" : sessionStored_username;

    let sessionStored_token = window.sessionStorage.getItem("token");
    this.token = sessionStored_token == null ? "" : sessionStored_token;

    //console.log(this.username);
    //console.log(this.token);

    if (this.username != "" && this.token != "") {
      this.http.get<Employee>(`${this.apiUrl}/employee/${this.username}`).subscribe(
        (data) => {
          console.log("GOOD TOKEN");
          console.log(this.username);
          console.log(this.token);

          this.logged_in = true;
          if (data.jobTitle == "Administrator") {
            this.administrator = true;
          } else {
            this.administrator = false;
          }
        },
        (error) => {
          console.log("BAD TOKEN");
          console.log(this.username);
          console.log(this.token);

          this.username = "";
          this.token = "";
        }
      );
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ userName: string; password: string }>(
      `${this.apiUrl}/login`,
      {
        userName: username,
        password: password,
      }
    );
  }

  logout() {
    window.sessionStorage.setItem("username", "");

    this.username = "";

    this.logged_in = false;
    this.administrator = false;
  }

  addEmployee(employee: Employee) {
    return this.http.post<Employee[]>(`${this.apiUrl}/employee`, employee);
  }

  getEmployee(username: string = this.username) {
    return this.http.get<Employee>(`${this.apiUrl}/employee/${username}`);
  }

  filterEmployee() {
    return this.http
      .get<Employee>(`${this.apiUrl}/employee-filter?firstName=Admin&nResults=10`)
      .subscribe();
  }

  getEmployees() {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee-all`);
  }

  updateEmployee(username: string = this.username, employee: any) {
    return this.http.put<Employee>(`${this.apiUrl}/employee/${username}`, employee);
  }

  removeEmployee(username: string) {
    return this.http.delete<Employee>(`${this.apiUrl}/employee/${username}`);
  }

  getEmployeeAttendance() {
    return this.http.get<Attendance[]>(
      `${this.apiUrl}/attendanceByUsername/${this.username}`
    );
  }

  clockIn(username: string = this.username) {
    return this.http.post<Attendance[]>(`${this.apiUrl}/clockIn/${username}`, "");
  }

  clockOut(username: string = this.username) {
    return this.http.post<Attendance[]>(`${this.apiUrl}/clockOut/${username}`, "");
  }

  // TASKS

  addTask(task: Task) {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }
  getTasks() {
    return this.http.get(`${this.apiUrl}/tasks`);
  }
  getEmployeeTasks(username: string) {
    return this.http.get(`${this.apiUrl}/tasks/${username}`);
  }
  updateTask(taskid: string, status: { status: string }) {
    return this.http.put<string>(
      `${this.apiUrl}/tasks/${taskid}/status`,
      status
    );
  }
  removeTask(taskid: string) {
    return this.http.delete(`${this.apiUrl}/tasks/${taskid}`);
  }

  // LEAVES

  addLeave(leave: Leave) {
    return this.http.post<Leave>(`${this.apiUrl}/leaves`, leave);
  }
  getLeaves() {
    return this.http.get(`${this.apiUrl}/leaves`);
  }
  getEmployeeLeaves(username: string) {
    return this.http.get(`${this.apiUrl}/leaves/${username}`);
  }
  updateLeave(leaveid: string, status: { status: string }) {
    return this.http.put<{ status: string }>(
      `${this.apiUrl}/leaves/${leaveid}/status`,
      status
    );
  }
  removeLeave(leaveid: string) {
    return this.http.delete(`${this.apiUrl}/leaves/${leaveid}`);
  }

  // SALARIES

  addSalary(salary: Salary) {
    return this.http.post<Salary>(`${this.apiUrl}/salaries`, salary);
  }
  getSalaries(username: string) {
    return this.http.get(`${this.apiUrl}/salaries/${username}`);
  }
  getSalariesMonth(month: number, year: number) {
    return this.http.get(
      `${this.apiUrl}/salaries/month/${month}/year/${year}`
    );
  }
  removeSalary(salaryid: string) {
    return this.http.delete(`${this.apiUrl}/salaries/${salaryid}`);
  }

  // DEPARTMENTS

  addDepartment(department: Department) {
    return this.http.post<Department>(`${this.apiUrl}/department`, department);
  }
  getDepartments() {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }
  getDepartment(departmentid: string) {
    return this.http.get<Department>(`${this.apiUrl}/department/${departmentid}`);
  }
  updateDepartment(departmentid: string, data: Department) {
    return this.http.put<Department>(
      `${this.apiUrl}/department/${departmentid}`,
      data
    );
  }
  deleteDepartment(departmentid: string) {
    return this.http.delete(`${this.apiUrl}/department/${departmentid}`);
  }
}
