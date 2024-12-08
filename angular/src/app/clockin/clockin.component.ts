import { CommonModule, NgClass } from "@angular/common";
import { Component } from "@angular/core";
import { Attendance, Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { HorizontalTimelineComponent } from "../horizontal-timeline/horizontal-timeline.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-clockin",
  imports: [CommonModule, HorizontalTimelineComponent],
  templateUrl: "./clockin.html",
  styles: ``,
})
export class ClockinComponent {
  timeline_start: Date = new Date(); // Timeline shows 24 hours

  ontime: boolean = false;
  clocked_time: number = 0;

  check_onTime() {
    let day_time = this.current_time.getTime() % 86400000;

    if (
      this.employeeService.employee.clock_out_time != null &&
      day_time < this.employeeService.employee.clock_out_time &&
      this.employeeService.employee.clock_in_time != null &&
      day_time > this.employeeService.employee.clock_in_time
    ) {
      this.ontime = true;
    } else {
      this.ontime = false;
    }
  }

  current_time: Date = new Date();

  set_time() {
    this.current_time = new Date();
    //this.check_onTime();
  }

  clock() {
    this.employeeService.clockEmployee();

    if (this.employeeService.employee.clocked_in_time != null) {
      this.clocked_time =
        this.current_time.getTime() -
        this.employeeService.employee.clocked_in_time;
    }
  }

  constructor(
    public employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.timeline_start = new Date(
      this.timeline_start.getFullYear(),
      this.timeline_start.getMonth(),
      this.timeline_start.getDate()
    );

    this.set_time();

    window.setInterval(() => {
      this.set_time();
    }, 1000);
  }
}
