import { Component } from "@angular/core";
import { Employee, niceForm, Leave } from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, retry, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { AsyncPipe, CommonModule, JsonPipe } from "@angular/common";
import { AsyncAction } from "rxjs/internal/scheduler/AsyncAction";
import { SidebarComponent } from "../sidebar/sidebar.component";
@Component({
  selector: "app-leaves",
  imports: [
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    CommonModule,
  ],
  templateUrl: "leaves.html",
  styles: ``,
})
export class LeavesComponent {
  employee_leaves: Leave[] = [];
  employee!: Employee;
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.setEmployee();
  }
  
  leaveform: niceForm[] = [
    {
      name: "reason",
      type: "text",
      title: "Reason: ",
      placeholder: "Reason",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "startDate",
      type: "text",
      title: "Start Date: ",
      placeholder: "Start Date",
      default: new Date().toISOString().substring(0, 10),
      validators: [Validators.required],
    },

    {
      name: "endDate",
      type: "text",
      title: "End Date: ",
      placeholder: "End Date",
      default: new Date().toISOString().substring(0, 10),
      validators: [Validators.required],
    },
  ];

  fetchEmployeeLeaves() {
    this.employeeService.
    getEmployeeLeaves(this.employee.userName)
    .pipe(retry(1))
    .subscribe(
      (response: any) => {
        if (response && Array.isArray(response.leaves)) {
          this.employee_leaves = response.leaves;
          console.log(this.employee_leaves);
        } else {
          console.error("Invalid response format: Expected `leaves` array.");
          this.employee_leaves = [];
        }
      },
      (error) => {
        console.error("Failed to fetch employee leaves:", error);
      }
    );
  }

  addLeave(data: {
    reason: string;
    startDate: string;
    endDate: string;
  }) {
    let leave: Leave = {
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    this.employeeService.addLeave(leave).subscribe(
      (data) => {
        this.fetchEmployeeLeaves();
      },
      (error) => {
        console.log("LEAVE ERROR", data)
      }
    );
  }

  setEmployee() {
    this.employeeService
      .getEmployee(this.employeeService.username)
      .subscribe((data) => {
        this.employee = data;
        this.fetchEmployeeLeaves();
      });
  }

}
