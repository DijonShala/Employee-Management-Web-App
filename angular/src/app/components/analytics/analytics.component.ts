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
import { RouterLink } from "@angular/router";

import { AgGridAngular } from "ag-grid-angular";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-analytics",
  imports: [
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    CommonModule,
    RouterLink,
    AgGridAngular,
  ],
  templateUrl: "analytics.html",
  styles: ``,
  providers: [DatePipe],
})
export class AnalyticsComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.initFilterEmploye();
    this.getAllLeaves();
    this.getAllTasks();
  }

  filteredSalaryDefs: ColDef[] = [
    { field: "userName", sortable: true, filter: true },
    { field: "basicSalary", sortable: true, filter: true },
    { field: "allowances", sortable: true, filter: true },
    { field: "deductions", sortable: true, filter: true },
    {
      field: "payDate",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
    {
      headerName: "Net Salary",
      sortable: true,
      valueGetter: (params) => {
        const basicSalary = params.data.basicSalary || 0;
        const allowances = params.data.allowances || 0;
        const deductions = params.data.deductions || 0;
        return basicSalary + allowances - deductions; // Calculate net salary
      },
      valueFormatter: (params) => {
        return params.value.toFixed(2); // Format to 2 decimal places
      },
    },
  ];

  allLeavesDefs: ColDef[] = [
    {
      field: "userName",
      sortable: true,
      filter: true,
    },
    { field: "reason", sortable: true, filter: true },
    {
      field: "startDate",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
    {
      field: "endDate",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
    { field: "status", sortable: true, filter: true },
    {
      field: "appliedAt",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
  ];

  allTasksDefs: ColDef[] = [
    {
      field: "userName",
      sortable: true,
      filter: true,
    },
    {
      field: "description",
      sortable: true,
      filter: true,
      cellStyle: {
        whiteSpace: "normal",
        overflow: "visible",
        lineHeight: "20px",
      },
      autoHeight: true,
    },
    {
      field: "startDate",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
    {
      field: "dueDate",
      valueFormatter: (params) => {
        return this.datePipe.transform(params.value, "dd/MM/yyyy") || "";
      },
    },
    { field: "status", sortable: true, filter: true },
  ];

  filteredEmployeeDefs: ColDef[] = [
    {
      field: "firstName",
      sortable: true,
      filter: true,
    },
    {
      field: "lastName",
      sortable: true,
      filter: true,
    },
    {
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      field: "phoneNumber",
      sortable: true,
      filter: true,
    },
    {
      field: "jobTitle",
      sortable: true,
      filter: true,
    },
    {
      field: "role",
      sortable: true,
      filter: true,
    },
    {
      field: "salary",
      sortable: true,
      filter: true,
    },
  ];

  formcontrol!: niceForm[];

  monthform: niceForm[] = [
    {
      name: "month",
      type: "text",
      title: $localize`Month: `,
      placeholder: $localize`Enter month (1-12)`,
      default: "",
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
    },
    {
      name: "year",
      type: "text",
      title: $localize`Year: `,
      placeholder: $localize`Enter year`,
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
        this.filteredSalaries = [];
      }
    );
  }
  allLeaves: Leave[] = [];
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
        title: $localize`First name: `,
        placeholder: $localize`First name`,
        default: "",
        validators: [],
      },
      {
        name: "lastname",
        type: "text",
        title: $localize`Last name: `,
        placeholder: $localize`Last name`,
        default: "",
        validators: [],
      },
      {
        name: "email",
        type: "text",
        title: $localize`Email: `,
        placeholder: $localize`Email`,
        default: "",
        validators: [Validators.email],
      },

      {
        name: "phonenumber",
        type: "text",
        title: $localize`Phone number: `,
        placeholder: $localize`Phone number`,
        default: "",
        validators: [Validators.pattern("[0-9]+")],
      },

      {
        name: "jobtitle",
        type: "text",
        title: $localize`Job title: `,
        placeholder: $localize`Job title`,
        default: "",
        validators: [],
      },

      {
        name: "role",
        type: "select",
        title: $localize`Role`,
        placeholder: $localize`Role`,
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
        title: $localize`Department`,
        placeholder: $localize`Department`,
        default: "",
        options: departments,
        validators: [],
      },

      {
        name: "salary",
        type: "text",
        title: $localize`Salary: `,
        placeholder: $localize`Salary`,
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

  getAllTasks() {
    this.employeeService
      .getTasks()
      .pipe(retry(1))
      .subscribe(
        (tasks: Task[]) => {
          this.allTasks = tasks;
        },
        (error) => {
          this.allTasks = [];
        }
      );
  }
}
