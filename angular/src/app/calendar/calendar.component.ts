import { Component } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { Attendance, Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { HorizontalTimelineComponent } from "../horizontal-timeline/horizontal-timeline.component";

@Component({
  selector: "app-calendar",
  imports: [CommonModule, HorizontalTimelineComponent],
  templateUrl: "./calendar.html",
  styles: ``,
})
export class CalendarComponent {
  currentDate: Date = new Date();

  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  calendarDays: { date: Date; isCurrentMonth: boolean }[][] = [];

  attendances!: Attendance[];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.attendances = this.employeeService.getEmployeeClocks("admin");
    this.generateCalendar();
  }

  changeMonth(direction: number) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + direction,
      this.currentDate.getDate()
    );

    this.generateCalendar();
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // get days from previous month

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // get days from next month

    let date = new Date(startDate);
    const weeks = [];

    while (date <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: new Date(date),
          isCurrentMonth: date.getMonth() === this.currentDate.getMonth(),
        });
        date.setDate(date.getDate() + 1);
      }
      weeks.push(week);
    }

    this.calendarDays = weeks;
  }

  show(name: Date) {
    console.log(name);
  }
}
