import { Component, Input, input } from "@angular/core";
import { Leave } from "../../employee";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmployeeService } from "../../services/employee.service";

@Component({
  selector: "app-leavecard",
  imports: [CommonModule, FormsModule],
  templateUrl: "leavecard.html",
  styles: ``,
})
export class LeavecardComponent {
  @Input() leave!: Leave;

  deleted: boolean = false;

  selectedStatus!: string | undefined;
  constructor(public employeeService: EmployeeService) {}
  ngOnInit() {
    this.selectedStatus = this.leave.status;
  }

  changeStatus() {
    if (this.selectedStatus == undefined || this.leave._id == undefined) {
      return;
    }

    this.employeeService
      .updateLeave(this.leave._id, {
        status: this.selectedStatus,
      })
      .subscribe(
        (data) => {
          this.leave.status = this.selectedStatus;
        },
        (error) => {}
      );
  }

  deleteLeave() {
    if (this.selectedStatus == undefined || this.leave._id == undefined) {
      return;
    }

    this.employeeService.removeLeave(this.leave._id).subscribe(
      (data) => {
        this.deleted = true;
      },
      (error) => {}
    );
  }
}
