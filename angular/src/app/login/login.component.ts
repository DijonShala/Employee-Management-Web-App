import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../employee.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [FormsModule, JsonPipe, CommonModule],
  templateUrl: "./login.html",
  styles: ``,
})
export class LoginComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  userName: string = "admin";
  password: string = "123";

  agreement: boolean = false;

  invalid: boolean = false;

  login(employeeForm: NgForm) {
    this.employeeService.login(this.userName);
    this.router.navigate(["/clockin"]);

    employeeForm.reset();
  }

  redirected: boolean = false;
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["redirected"] == "true") {
        this.redirected = true;
      } else {
        this.redirected = false;
      }
    });
  }
}
