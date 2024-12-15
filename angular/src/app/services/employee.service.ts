import { Inject, Injectable } from "@angular/core";
import {
  Attendance,
  Department,
  Employee,
  Leave,
  Salary,
  Task,
} from "../employee";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { BROWSER_STORAGE } from "../classes/storage";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  logged_in: boolean = false;
  administrator: boolean = false;

  username: string = "";
  role: string = "";
  token: string = "";

  constructor(
    private readonly http: HttpClient,
    @Inject(BROWSER_STORAGE) private readonly storage: Storage
  ) {
    this.initialize();
  }
  private apiUrl = environment.apiUrl;
  initialize(): Observable<boolean> {
    let sessionStored_username = window.sessionStorage.getItem("username");
    this.username =
      sessionStored_username == null ? "" : sessionStored_username;

    let sessionStored_role = window.sessionStorage.getItem("role");
    this.role =
        sessionStored_role == null ? "" : sessionStored_role;

    let sessionStored_token = window.sessionStorage.getItem("token");
    this.token = sessionStored_token == null ? "" : sessionStored_token;

    if (this.username != "" && this.token != "") {
      return this.http
        .get<Employee>(`${this.apiUrl}/employee/${this.username}`)
        .pipe(
          map((data) => {
            this.logged_in = true;
            this.administrator = data.role === "admin";

            return true;
          }),
          catchError((error) => {
            this.username = "";
            this.token = "";

            return of(false);
          })
        );
    }

    return of(false);
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
    this.deleteCookie("username");
    this.deleteCookie("token");
    this.deleteCookie("role");
    window.sessionStorage.setItem("username", "");
    window.sessionStorage.setItem("role", "");

    this.username = "";

    this.logged_in = false;
    this.administrator = false;
  }

  deleteCookie(name: string) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  addEmployee(employee: Employee) {
    return this.http.post<Employee[]>(`${this.apiUrl}/employee`, employee);
  }

  getEmployee(username: string = this.username) {
    return this.http.get<Employee>(`${this.apiUrl}/employee/${username}`);
  }

  filterEmployee() {
    return this.http
      .get<Employee>(
        `${this.apiUrl}/employee-filter?firstName=Admin&nResults=10`
      )
      .subscribe();
  }

  getEmployees() {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee-all`);
  }

  updateEmployee(username: string = this.username, employee: any) {
    return this.http.put<Employee>(
      `${this.apiUrl}/employee/${username}`,
      employee
    );
  }

  removeEmployee(username: string) {
    return this.http.delete<Employee>(`${this.apiUrl}/employee/${username}`);
  }

  getEmployeeAttendance() {
    return this.http.get<Attendance[]>(
      `${this.apiUrl}/attendanceByUsername/${this.username}`
    );
  }

  clockIn() {
    return this.http.post<Attendance[]>(`${this.apiUrl}/clockIn`, "");
  }

  clockOut() {
    return this.http.post<Attendance[]>(`${this.apiUrl}/clockOut`, "");
  }

  // TASKS

  addTask(task: Task) {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }
  getTasks() {
    return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/tasks`).pipe(
      map((response) => response.tasks)
    );
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
    return this.http.get<{ leaves: Leave[] }>(`${this.apiUrl}/leaves`).pipe(
      map((response) => response.leaves)
    );
  }
  getEmployeeLeaves(username: string) {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves/${username}`);
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
    return this.http.get<Salary[]>(`${this.apiUrl}/salaries/${username}`);
  }
  getSalariesMonth(month: number, year: number): Observable<Salary[]> {
    return this.http
      .get<{ message: string; salaries: Salary[] }>(`${this.apiUrl}/salaries/month/${month}/year/${year}`)
      .pipe(
        map((response) => response.salaries)
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
    return this.http.get<Department>(
      `${this.apiUrl}/department-data/${departmentid}`
    );
  }
  findEmployeesInDepartment(depname: string) {
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${depname}`);
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
  // DB
  addInitialData() {
    return this.http.post(`${this.apiUrl}/db`, {});
  }

  deleteData() {
    return this.http.delete(`${this.apiUrl}/db`);
  }
}
