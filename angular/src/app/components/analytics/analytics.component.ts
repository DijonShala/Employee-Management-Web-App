import { Component } from "@angular/core";
import {
  Employee,
  niceForm,
  Salary,
  Task,
  Leave,
  Department,
} from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, retry, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { AsyncPipe, CommonModule, JsonPipe } from "@angular/common";

@Component({
  selector: "app-analytics",
  imports: [NiceFormComponent, AsyncPipe, JsonPipe, CommonModule],
  templateUrl: "analytics.html",
  styles: ``,
})
export class AnalyticsComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.initFilterEmploye();
  }

  formcontrol!: niceForm[];

  monthform: niceForm[] = [
    {
      name: "month",
      type: "text",
      title: "Month: ",
      placeholder: "Enter month (1-12)",
      default: "",
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
    },
    {
      name: "year",
      type: "text",
      title: "Year: ",
      placeholder: "Enter year",
      default: "",
      validators: [Validators.required, Validators.min(1900)],
    },
  ];

  fetchSalariesByMonthYear(data: { month: number; year: number }) {
    const { month, year } = data;

    this.employeeService.getSalariesMonth(month, year).subscribe(
      (salaries: Salary[]) => {
        this.filteredSalaries = salaries;
      },
      (error) => {
        console.error("Error fetching salaries for the month/year:", error);
        this.filteredSalaries = [];
      }
    );
  }
  getAllLeaves() {
    this.employeeService
      .getLeaves()
      .pipe(retry(1))
      .subscribe(
        (leaves: Leave[]) => {
          this.allLeaves = leaves;
        },
        (error) => {
          this.allLeaves = [];
        }
      );
  }
  filteredSalaries: Salary[] = [];
  allTasks: Task[] = [];
  allLeaves: Leave[] = [];

  initFilterEmploye() {
    this.employeeService
      .getDepartments()
      .pipe(retry(1))
      .subscribe(
        (departments: Department[]) => {
          const departmentOptions = departments.map((dept) => ({
            label: dept.name || "Unknown",
            value: dept._id ?? "",
          }));

          departmentOptions.push({ label: "None", value: "" });

          this.setFormcontrolFilterEmployee(departmentOptions);
        },
        (error) => {
          console.error("Error loading departments:", error);
          return [];
        }
      );
  }

  showFilterEmployeeForm: Boolean = false;
  formFilterEmployee!: niceForm[];
  FilteredEmployee!: Employee[];
  limit10 = false;
  data: any = null;

  setFormcontrolFilterEmployee(
    departments: { label: string; value: string }[]
  ) {
    this.formFilterEmployee = [
      {
        name: "firstname",
        type: "text",
        title: "First name: ",
        placeholder: "First name",
        default: "",
        validators: [],
      },
      {
        name: "lastname",
        type: "text",
        title: "Last name: ",
        placeholder: "Last name",
        default: "",
        validators: [],
      },
      {
        name: "email",
        type: "text",
        title: "Email: ",
        placeholder: "Email",
        default: "",
        validators: [Validators.email],
      },

      {
        name: "phonenumber",
        type: "text",
        title: "Phone number: ",
        placeholder: "Phone number",
        default: "",
        validators: [Validators.pattern("[0-9]+")],
      },

      {
        name: "jobtitle",
        type: "text",
        title: "Job title: ",
        placeholder: "Job title",
        default: "",
        validators: [],
      },

      {
        name: "role",
        type: "select",
        title: "Role",
        placeholder: "Role",
        default: "",
        validators: [],
        options: [
          { label: "admin", value: "admin" },
          { label: "employee", value: "employee" },
          { label: "None", value: "" },
        ],
      },

      {
        name: "departmentid",
        type: "select",
        title: "Department",
        placeholder: "Department",
        default: "",
        options: departments,
        validators: [],
      },

      {
        name: "salary",
        type: "text",
        title: "Salary: ",
        placeholder: "Salary",
        default: "",
        validators: [],
      },
    ];
    this.showFilterEmployeeForm = false;
    setTimeout(() => (this.showFilterEmployeeForm = true), 0);
  }

  fetchFilterEmployee(data: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    jobtitle: string;
    role: string;
    departmentid: string;
    salary: string;
  }) {
    this.data = data;
    let employeeFilter = {
      firstName: data.firstname == "" ? undefined : data.firstname,
      lastName: data.lastname == "" ? undefined : data.lastname,
      email: data.email == "" ? undefined : data.email,
      phoneNumber: data.phonenumber == "" ? undefined : data.phonenumber,
      jobTitle: data.jobtitle == "" ? undefined : data.jobtitle,
      role: data.role == "" ? undefined : data.role,
      departmentId: data.departmentid == "" ? undefined : data.departmentid,
      salary: data.salary == "" ? undefined : parseInt(data.salary),
    };

    this.employeeService
      .filterEmployee(employeeFilter, !this.limit10)
      .pipe(retry(1))
      .subscribe(
        (data) => {
          this.FilteredEmployee = data;
          console.log(data);
        },
        (error) => {
          this.allLeaves = [];
        }
      );
  }

  showMoreThen10() {
    this.limit10 = true;
    this.fetchFilterEmployee(this.data);
  }
}
