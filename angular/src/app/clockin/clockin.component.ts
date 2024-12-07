import { CommonModule, NgClass } from "@angular/common";
import { Component } from "@angular/core";
import { Attendance, Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { HorizontalTimelineComponent } from "../horizontal-timeline/horizontal-timeline.component";

@Component({
  selector: "app-clockin",
  imports: [CommonModule, HorizontalTimelineComponent],
  templateUrl: "./clockin.html",
  styles: ``,
})
export class ClockinComponent {
  timeline_start: Date = new Date("Tue Dec 05 2024 00:00:00 GMT+0100"); // Timeline shows 24 hours
  attendances!: Attendance[];

  employee!: Employee;

  ontime: boolean = false;
  clocked_time: number = 0;

  check_onTime() {
    let day_time = this.current_time.getTime() % 86400000;

    if (
      this.employee.clock_out_time != null &&
      day_time < this.employee.clock_out_time &&
      this.employee.clock_in_time != null &&
      day_time > this.employee.clock_in_time
    ) {
      this.ontime = true;
    } else {
      this.ontime = false;
    }
  }

  current_time: Date = new Date();

  set_time() {
    this.current_time = new Date();
    this.check_onTime();
  }

  clock() {
    this.employeeService.clockEmployee();
    this.employee = this.employeeService.getEmployeeMock();

    if (this.employee.clocked_in_time != null) {
      this.clocked_time =
        this.current_time.getTime() - this.employee.clocked_in_time;
    }
  }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employee = this.employeeService.getEmployeeMock();
    this.attendances = this.employeeService.getEmployeeClocks("admin");

    this.set_time();

    window.setInterval(() => {
      this.set_time();
    }, 1000);
  }
}
