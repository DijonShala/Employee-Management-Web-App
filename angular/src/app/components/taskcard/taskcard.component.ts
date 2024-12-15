import { Component, Input, input } from "@angular/core";
import { Task } from "../../employee";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmployeeService } from "../../services/employee.service";

@Component({
  selector: "app-taskcard",
  imports: [CommonModule, FormsModule],
  templateUrl: "taskcard.html",
  styles: ``,
})
export class TaskcardComponent {
  @Input() task!: Task;

  deleted: boolean = false;

  selectedStatus!: string | undefined;
  constructor(public employeeService: EmployeeService) {}
  ngOnInit() {
    this.selectedStatus = this.task.status;
  }

  changeStatus() {
    if (this.selectedStatus == undefined || this.task._id == undefined) {
      return;
    }

    this.employeeService
      .updateTask(this.task._id, {
        status: this.selectedStatus,
      })
      .subscribe(
        (data) => {
          this.task.status = this.selectedStatus;
        },
        (error) => {}
      );
  }

  deleteTask() {
    if (this.selectedStatus == undefined || this.task._id == undefined) {
      return;
    }

    this.employeeService.removeTask(this.task._id).subscribe(
      (data) => {
        this.deleted = true;
      },
      (error) => {}
    );
  }
}
