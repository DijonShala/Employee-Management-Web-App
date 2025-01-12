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
      title: $localize`User name`,
      placeholder: $localize`User name`,
      default: "",
      validators: [Validators.required, Validators.min(3)],
    },
    {
      name: "firstname",
      type: "text",
      title: $localize`First name`,
      placeholder: $localize`First name`,
      default: "",
      validators: [Validators.required],
    },
    {
      name: "lastname",
      type: "text",
      title: $localize`Last name`,
      placeholder: $localize`Last name`,
      default: "",
      validators: [Validators.required],
    },
    {
      name: "email",
      type: "text",
      title: $localize`Email`,
      placeholder: $localize`Email`,
      default: "",
      validators: [Validators.required, Validators.email],
    },

    {
      name: "phonenumber",
      type: "text",
      title: $localize`Phone number`,
      placeholder: $localize`Phone number`,
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]+")],
    },

    {
      name: "jobtitle",
      type: "text",
      title: $localize`Job title`,
      placeholder: $localize`Job title`,
      default: "",
      validators: [Validators.required],
    },

    {
      name: "role",
      type: "select",
      title: "Role",
      placeholder: $localize`Role`,
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
      title: $localize`Department ID`,
      placeholder: $localize`Department ID`,
      default: "",
      options: [],
      validators: [Validators.required],
    },

    {
      name: "salary",
      type: "text",
      title: $localize`Salary`,
      placeholder: $localize`Salary`,
      default: "",
      validators: [Validators.required],
    },
    {
      name: "walletAddress",
      type: "text",
      title: $localize`Wallet Address`,
      placeholder: $localize`0x...`,
      default: "",
      validators: [
        Validators.pattern("^0x[a-fA-F0-9]{40}$"), // Ethereum format kot primer
      ],
    },
    {
      name: "street",
      type: "text",
      title: $localize`Street`,
      placeholder: $localize`Street`,
      default: "",
      validators: [Validators.required],
    },

    {
      name: "city",
      type: "text",
      title: $localize`City`,
      placeholder: $localize`City`,
      default: "",
      validators: [Validators.required],
    },

    {
      name: "zipCode",
      type: "text",
      title: $localize`Zip code`,
      placeholder: $localize`Zip code`,
      default: "",
      validators: [Validators.required],
    },

    {
      name: "country",
      type: "text",
      title: $localize`Country`,
      placeholder: $localize`Country`,
      default: "",
      validators: [Validators.required],
    },

    {
      name: "password",
      type: "password",
      title: $localize`Password`,
      placeholder: $localize`Password`,
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
    walletAddress: string;
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
      walletAddress: data.walletAddress || null,
      status: "inactive",
      street: data.street,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
    };

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
        (error) => {}
      );
  }
}
