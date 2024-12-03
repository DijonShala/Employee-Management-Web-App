import { CommonModule, NgClass } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-clockin",
  imports: [CommonModule],
  templateUrl: "./clockin.html",
  styles: ``,
})
export class ClockinComponent {
  clock_in_time: number = 33300000;
  clock_out_time: number = 36300000;

  ontime: boolean = false;

  check_onTime() {
    let day_time = this.current_time % 86400000;

    if (day_time < this.clock_out_time && day_time > this.clock_in_time) {
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

  clocked_in: boolean = false;

  clocked_in_time: number = 0;

  clock_in() {
    let date = new Date();

    if (this.clocked_in) {
      return;
    }

    this.clocked_in = true;
    this.clocked_in_time = date.getTime();
  }

  clocked_time: number = 0;

  clock_out() {
    const date = new Date();
    if (!this.clocked_in) {
      return;
    }
    this.clocked_in = false;
    this.clocked_time = this.current_time - this.clocked_in_time;

    // Toast to worker

    //var toastElList = [].slice.call(document.querySelectorAll(".toast"));
    //var toastList = toastElList.map(function (toastEl) {
    //  return new bootstrap.Toast(toastEl);
    //});
    //toastList.forEach((toast) => toast.show());
  }

  ngOnInit() {
    this.set_time();

    window.setInterval(() => {
      this.set_time();
    }, 1000);
  }
}
