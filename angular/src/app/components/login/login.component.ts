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
      title: $localize`User name`,
      placeholder: $localize`User name`,
      default: "admin",
      validators: [Validators.required],
    },
    {
      name: "password",
      type: "password",
      title: $localize`Password`,
      placeholder: $localize`Password`,
      default: "admin123",
      validators: [Validators.required],
    },
    {
      name: "check",
      type: "check",
      title: $localize`I have read and agreed to the
        <strong><a href="">Terms of Service</a> *</strong>`,
      default: false,
      validators: [Validators.requiredTrue],
    },
  ];

  login(result: { username: string; password: string; check: boolean }) {
    this.employeeService.login(result.username, result.password).subscribe(
      (data) => {
        let token = JSON.stringify(data).slice(10, -2); // standarden typescript
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload
        const role = payload.role;
        window.sessionStorage.setItem("role", role);
        document.cookie =
          "username=" + result.username + "; path=/; max-age=3600";
        document.cookie = "token=" + token + "; path=/; max-age=3600";
        document.cookie = "role=" + role + "; path=/; max-age=3600";
        this.finishLogin(result.username, token, role);
      },
      (error) => {
        this.invalid = true;
      }
    );
  }

  finishLogin(username: string, token: string, role: string) {
    window.sessionStorage.setItem("username", username);
    window.sessionStorage.setItem("token", token);
    window.sessionStorage.setItem("role", role);
    this.employeeService.initialize().subscribe((data: Boolean) => {
      //console.log(data);
      if (data) {
        this.router.navigate(["/clockin"]);
      }
    });
  }

  redirected: boolean = false;
  ngOnInit() {
    let username = this.getCookie("username");
    let token = this.getCookie("token");
    let role = this.getCookie("role");

    if (username != null && token != null && role != null) {
      this.finishLogin(username, token, role);
    }

    this.route.queryParams.subscribe((params) => {
      if (params["redirected"] == "true") {
        this.redirected = true;
      } else {
        this.redirected = false;
      }
    });
  }

  getCookie(name: string) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
    return null;
  }
}
