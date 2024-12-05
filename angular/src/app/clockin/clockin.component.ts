import { CommonModule, NgClass } from "@angular/common";
import { Component } from "@angular/core";
import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-clockin",
  imports: [CommonModule],
  templateUrl: "./clockin.html",
  styles: ``,
})
export class ClockinComponent {
  employee!: Employee;

  ontime: boolean = false;

  clocked_time: number = 0;

  check_onTime() {
    let day_time = this.current_time % 86400000;

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

  current_time: number = 0;

  set_time() {
    let date = new Date();

    this.current_time = date.getTime();
    this.check_onTime();
  }

  clock() {
    let date = new Date();

    this.employeeService.clockEmployee();
    this.employee = this.employeeService.getEmployee();

    if (this.employee.clocked_in_time != null) {
      this.clocked_time = this.current_time - this.employee.clocked_in_time;
    }

    // Toast to worker

    //var toastElList = [].slice.call(document.querySelectorAll(".toast"));
    //var toastList = toastElList.map(function (toastEl) {
    //  return new bootstrap.Toast(toastEl);
    //});
    //toastList.forEach((toast) => toast.show());
  }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employee = this.employeeService.getEmployee();

    this.employeeService.getData();

    this.set_time();

    window.setInterval(() => {
      this.set_time();
    }, 1000);
  }
}
