import { Component } from "@angular/core";
import { Employee, niceForm, Task } from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, retry, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { AsyncPipe, CommonModule, JsonPipe } from "@angular/common";
import { AsyncAction } from "rxjs/internal/scheduler/AsyncAction";
import { TaskcardComponent } from "../taskcard/taskcard.component";
@Component({
  selector: "app-tasks",
  imports: [
    TaskcardComponent,
    CommonModule,
  ],
  templateUrl: "tasks.html",
  styles: ``,
})
export class TasksComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router
  ) {}
  tasks: any;
  employee!: Employee;

  ngOnInit() {
    this.getTasks();
    this.getEmployee();
  }

  getTasks() {
    this.employeeService
      .getEmployeeTasks(this.employeeService.username)
      .subscribe((data) => {
        this.tasks = data;
      });
  }
  
  updateTask(taskid: string, value: string) {
    this.employeeService
      .updateTask(taskid, { status: value })
      .subscribe((data) => {
        this.getTasks();
      });
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employee = data;
    });
  }
  



}

