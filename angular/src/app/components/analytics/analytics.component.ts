import { Component } from "@angular/core";
import { Employee, niceForm, Salary, Task, Leave } from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, retry, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-analytics",
  imports: [
    NiceFormComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: "analytics.html",
  styles: ``,
})
export class AnalyticsComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getAllLeaves();
    this.getAllTasks();
  }

  monthform: niceForm[] = [
    {
      name: "month",
      type: "text",
      title: "Month: ",
      placeholder: "Enter month (1-12)",
      default: "",
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
    },
    {
      name: "year",
      type: "text",
      title: "Year: ",
      placeholder: "Enter year",
      default: "",
      validators: [Validators.required, Validators.min(1900)],
    },
  ];
  
  fetchSalariesByMonthYear(data: { month: number; year: number }) {
    const { month, year } = data;
  
    this.employeeService.getSalariesMonth(month, year).subscribe(
      (salaries: Salary[]) => {
        this.filteredSalaries = salaries;
      },
      (error) => {
        this.filteredSalaries = [];
      }
    );
  }
  allLeaves: Leave[] = [];
  getAllLeaves(){
     this.employeeService
      .getLeaves()
      .pipe(retry(1))
      .subscribe(
        (leaves: Leave[]) => {
          this.allLeaves = leaves;
        },
        (error) => {
          this.allLeaves =  [];
        }
      );
  }
  filteredSalaries: Salary[] = [];

  allTasks: Task[] = [];
  getAllTasks(){
     this.employeeService
      .getTasks()
      .pipe(retry(1))
      .subscribe(
        (tasks: Task[]) => {
          this.allTasks = tasks;
        },
        (error) => {
          this.allTasks =  [];
        }
      );
  }
}