import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Attendance } from "../employee";

@Component({
  selector: "app-horizontal-timeline",
  imports: [CommonModule],
  templateUrl: "horizontal-timeline.html",
  styles: [
    `
      .timeline-container {
        display: flex;
        overflow-x: auto;
        padding: 0px;
        //padding: 10px;
      }
      .timeline-item {
        //border-radius: 4px;
        transition: background-color 0.3s ease;
        display: block;
        height: 20px;
        width: 4.16%;
        float: left;
      }
    `,
  ],
})
export class HorizontalTimelineComponent {
  @Input() attendances: Attendance[] = [];
  @Input() timeline_start: Date = new Date();

  timelineData: number[] = [];

  set_added_hours(date: Date, added: number): Date {
    return new Date(
      this.timeline_start.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + added
    );
  }

  ngOnInit() {
    for (let i = 0; i < 24; i++) {
      let portion = 0;
      let start_hour = this.set_added_hours(this.timeline_start, i);
      let end_hour = this.set_added_hours(this.timeline_start, i + 1);

      this.attendances.forEach((attendance) => {
        if (
          attendance.clock_in_time.getTime() < end_hour.getTime() &&
          attendance.clock_out_time.getTime() > start_hour.getTime()
        ) {
          let start_time = attendance.clock_in_time.getTime();
          let end_time = attendance.clock_out_time.getTime();

          if (attendance.clock_in_time.getTime() < start_hour.getTime()) {
            start_time = start_hour.getTime();
          }
          if (attendance.clock_out_time.getTime() > end_hour.getTime()) {
            end_time = end_hour.getTime();
          }

          portion += (end_time - start_time) / 3600000;
        }
      });

      this.timelineData.push(portion);
    }
  }
}

//3600000
//86400000
