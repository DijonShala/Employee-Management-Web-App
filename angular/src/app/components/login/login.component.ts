import { Component, EventEmitter } from "@angular/core";
import { FormsModule, NgForm, Validators } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { niceForm } from "../../employee";

@Component({
  selector: "app-login",
  imports: [FormsModule, JsonPipe, CommonModule, NiceFormComponent],
  templateUrl: "./login.html",
  styles: ``,
})
export class LoginComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  invalid: boolean = false;

  formcontrol: niceForm[] = [
    {
      name: "username",
      type: "text",
      title: "User name",
      placeholder: "User name",
      default: "admin",
      validators: [Validators.required],
    },
    {
      name: "password",
      type: "password",
      title: "Password",
      placeholder: "Password",
      default: "admin123",
      validators: [Validators.required],
    },
    {
      name: "check",
      type: "check",
      title: `I have read and agreed to the
        <strong><a href="">Terms of Service</a> *</strong>`,
      default: false,
      validators: [Validators.requiredTrue],
    },
  ];

  login(result: { username: string; password: string; check: boolean }) {
    this.employeeService.login(result.username, result.password).subscribe(
      (data) => {
        let token = JSON.stringify(data).slice(10, -2); // standarden typescript
        window.sessionStorage.setItem("username", result.username);
        window.sessionStorage.setItem("token", token);
        this.employeeService.initialize();

        //this.router.navigate(["/clockin"]);
      },
      (error) => {}
    );
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
