import { Component } from "@angular/core";
import { Employee, niceForm } from "../../employee";
import { FormsModule, NgForm, Validators } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { retry } from "rxjs";
import { Department } from "../../employee";

@Component({
  selector: "app-register",
  imports: [
    FormsModule,
    JsonPipe,
    CommonModule,
    NiceFormComponent,
    SidebarComponent,
  ],
  templateUrl: "./register.html",
  styles: ``,
})
export class RegisterComponent {
  ngOnInit() {
    this.loadDepartments();
  }

  formcontrol: niceForm[] = [
    {
      name: "username",
      type: "text",
      title: "User name",
      placeholder: "User name",
      default: "",
      validators: [Validators.required, Validators.min(3)],
    },
    {
      name: "firstname",
      type: "text",
      title: "First name",
      placeholder: "First name",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "lastname",
      type: "text",
      title: "Last name",
      placeholder: "Last name",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "email",
      type: "text",
      title: "Email",
      placeholder: "Email",
      default: "",
      validators: [Validators.required, Validators.email],
    },

    {
      name: "phonenumber",
      type: "text",
      title: "Phone number",
      placeholder: "Phone number",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]+")],
    },

    {
      name: "jobtitle",
      type: "text",
      title: "Job title",
      placeholder: "Job title",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "role",
      type: "select",
      title: "Role",
      placeholder: "Role",
      default: "employee",
      validators: [Validators.required],
      options: [
        { label: "Admin", value: "admin" },
        { label: "Employee", value: "employee" },
      ],
    },

    {
      name: "departmentid",
      type: "select",
      title: "Department ID",
      placeholder: "Department ID",
      default: "",
      options: [],
      validators: [Validators.required],
    },

    {
      name: "salary",
      type: "text",
      title: "Salary",
      placeholder: "Salary",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "street",
      type: "text",
      title: "Street",
      placeholder: "Street",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "city",
      type: "text",
      title: "City",
      placeholder: "City",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "zipCode",
      type: "text",
      title: "Zip code",
      placeholder: "Zip code",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "country",
      type: "text",
      title: "Country",
      placeholder: "Country",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "password",
      type: "password",
      title: "Password",
      placeholder: "Password",
      default: "",
      validators: [Validators.required],
    },
  ];
  success_status: string = "NOT SUBMITTED";

  constructor(private employeeService: EmployeeService) {}

  register(data: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    jobtitle: string;
    role: string;
    departmentid: string;
    salary: string;
    street: string;
    city: string;
    country: string;
    zipCode: string;
  }) {
    let employee: any = {
      userName: data.username,
      password: data.password,
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      phoneNumber: data.phonenumber,
      jobTitle: data.jobtitle,
      role: data.role,
      departmentId: data.departmentid,
      hireDate: "2024-11-26T10:21:38.124Z", //new Date().toString(),
      salary: parseInt(data.salary),
      status: "inactive",
      street: data.street,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
    };

    console.log(employee);

    this.employeeService.addEmployee(employee).subscribe(
      (data) => {
        this.success_status = "SUCCESS";
      },
      (error) => {
        this.success_status = "ERROR";
      }
    );
  }

  loadDepartments() {
    this.employeeService
      .getDepartments()
      .pipe(retry(1))
      .subscribe(
        (departments: Department[]) => {
          const departmentOptions = departments.map((dept) => ({
            label: dept.name || "Unknown",
            value: dept._id ?? "",
          }));

          //console.log(departmentOptions);

          const departmentControl = this.formcontrol.find(
            (control) => control.name === "departmentid"
          );

          if (departmentControl && departmentOptions.length > 0) {
            departmentControl.options = departmentOptions;
            departmentControl.default = departmentOptions[0].value;
          }
        },
        (error) => {
          console.error("Error loading departments:", error);
        }
      );
  }
}
