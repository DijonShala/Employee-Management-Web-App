import { Component, Input, input } from "@angular/core";
import { Task } from "../employee";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-taskcard",
  imports: [CommonModule],
  templateUrl: "taskcard.html",
  styles: ``,
})
export class TaskcardComponent {
  @Input() task!: Task;
}
