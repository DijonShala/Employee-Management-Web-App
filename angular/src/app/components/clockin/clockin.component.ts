import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Employee } from "../../employee";
import { EmployeeService } from "../../services/employee.service";
import { HorizontalTimelineComponent } from "../horizontal-timeline/horizontal-timeline.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-clockin",
  imports: [CommonModule, HorizontalTimelineComponent],
  templateUrl: "./clockin.html",
  styles: ``,
})
export class ClockinComponent {
  timeline_start: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  ontime: boolean = false;
  clocked_time: number = 0;

  employee!: Employee;

  //check_onTime() {
  //  let day_time = this.current_time.getTime() % 86400000;
  //
  //  if (
  //    this.employee.clock_out_time != null &&
  //    day_time < this.employee.clock_out_time &&
  //    this.employee.clock_in_time != null &&
  //    day_time > this.employee.clock_in_time
  //  ) {
  //    this.ontime = true;
  //  } else {
  //    this.ontime = false;
  //  }
  //}
  //
  current_time: Date = new Date();

  set_time() {
    this.current_time = new Date();
    //this.check_onTime();
  }

  clock() {
    if (this.employee.status == "active") {
      this.employeeService.clockOut().subscribe(
        (data) => {
          this.updateStatus("inactive");
        },
        (error) => {
          this.employee.status = "inactive";
        }
      );
    } else {
      this.employeeService.clockIn().subscribe(
        (data) => {
          this.updateStatus("active");
        },
        (error) => {
          this.employee.status = "active";
        }
      );
    }
  }

  updateStatus(status: string) {
    this.employee.status = status;
    this.employeeService
      .updateEmployee(this.employee.userName, { status: this.employee.status })
      .subscribe(
        (data) => {
          this.getEmployee();
        },
        (error) => {}
      );
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employee = data;
    });
  }

  constructor(
    public employeeService: EmployeeService,
    private router: Router
  ) {}


  ngOnInit() {
    this.getEmployee();

    window.setInterval(() => {
      this.set_time();
    }, 1000);
  }
}
