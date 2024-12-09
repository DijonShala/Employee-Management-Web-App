import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Attendance } from "../employee";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-horizontal-timeline",
  imports: [CommonModule],
  templateUrl: "horizontal-timeline.html",
  styleUrl: "horizontal-timeline.css",
})
export class HorizontalTimelineComponent {
  @Input() timeline_start: Date = new Date();

  @Input() type: string = "timeline";

  attendances: Attendance[] = [];

  timelineData: { date: Date; portion: number }[] = [];

  set_added_hours(date: Date, added: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + added
      //date.getMinutes()
    );
  }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployeeAttendance().subscribe((data) => {
      this.attendances = data;
      this.drawTimeline();
    });
  }

  drawTimeline() {
    for (let i = 0; i < 24; i++) {
      let start_hour = this.set_added_hours(this.timeline_start, i);
      let end_hour = this.set_added_hours(this.timeline_start, i + 1);

      let portion = { date: start_hour, portion: 0 };

      this.attendances.forEach((attendance) => {
        let clock_in_time = new Date(attendance.clock_in_time);
        let clock_out_time = new Date();
        if (attendance.clock_out_time != null) {
          clock_out_time = new Date(attendance.clock_out_time);
        }

        if (
          clock_in_time.getTime() < end_hour.getTime() &&
          clock_out_time.getTime() > start_hour.getTime()
        ) {
          let start_time = clock_in_time.getTime();
          let end_time = clock_out_time.getTime();

          if (clock_in_time.getTime() < start_hour.getTime()) {
            start_time = start_hour.getTime();
          }
          if (clock_out_time.getTime() > end_hour.getTime()) {
            end_time = end_hour.getTime();
          }

          portion.portion += (end_time - start_time) / 3600000;
        }
      });

      this.timelineData.push(portion);
    }
  }
}
