import { Component } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { NgForm, Validators } from "@angular/forms";
import {
  Department,
  Employee,
  Leave,
  niceForm,
  Salary,
  Task,
} from "../../employee";
import { ActivatedRoute, Router } from "@angular/router";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";
import { CommonModule } from "@angular/common";
import { Observable, retry } from "rxjs";
import { TaskcardComponent } from "../taskcard/taskcard.component";
import { LeavecardComponent } from "../leavecard/leavecard.component";

import { AgGridAngular } from "ag-grid-angular";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-userpage",
  imports: [
    SidebarComponent,
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    CommonModule,
    TaskcardComponent,
    LeavecardComponent,
    AgGridAngular,
  ],
  templateUrl: "userpage.html",
  styles: ``,
  providers: [DatePipe],
})
export class UserpageComponent {
  employee!: Employee;
  formcontrol!: niceForm[];
  departmentOptions!: { label: string; value: string }[];
  showForm = false;

  filteredSalaryDefs: ColDef[] = [
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

  strongstring(s: string) {
    return `<strong> ` + s + ` </strong>`;
  }

  setformcontrol() {
    this.formcontrol = [
      {
        name: "firstname",
        type: "text",
        title: "First name: " + this.strongstring(this.employee.firstName),
        placeholder: "First name",
        default: "",
        validators: [],
      },
      {
        name: "lastname",
        type: "text",
        title: "Last name: " + this.strongstring(this.employee.lastName),
        placeholder: "Last name",
        default: "",
        validators: [],
      },
      {
        name: "email",
        type: "text",
        title: "Email: " + this.strongstring(this.employee.email),
        placeholder: "Email",
        default: "",
        validators: [Validators.email],
      },

      {
        name: "phonenumber",
        type: "text",
        title: "Phone number: " + this.strongstring(this.employee.phoneNumber),
        placeholder: "Phone number",
        default: "",
        validators: [Validators.pattern("[0-9]+")],
      },

      {
        name: "jobtitle",
        type: "text",
        title: "Job title: " + this.strongstring(this.employee.jobTitle),
        placeholder: "Job title",
        default: "",
        validators: [],
      },

      {
        name: "role",
        type: "select",
        title: "Role" + this.strongstring(this.employee.role),
        placeholder: "Role",
        default: "",
        validators: [],
        options: [
          { label: "admin", value: "admin" },
          { label: "employee", value: "employee" },
        ],
      },

      {
        name: "departmentid",
        type: "select",
        title:
          "Department" +
          this.strongstring(
            this.departmentOptions.find(
              (x) => x.value == this.employee.departmentId
            )?.label || ""
          ),
        placeholder: "Department",
        default: "",
        options: this.departmentOptions,
        validators: [],
      },

      {
        name: "salary",
        type: "text",
        title: "Salary: " + this.strongstring(String(this.employee.salary)),
        placeholder: "Salary",
        default: "",
        validators: [],
      },
      {
        name: "walletAddress",
        type: "text",
        title: "Wallet Address: " + this.strongstring(String(this.employee.walletAddress)),
        placeholder: "Wallet Adress",
        default: "",
        validators: [],
      },
    ];
    this.showForm = false;
    setTimeout(() => (this.showForm = true), 0);
  }

  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}
  employee_salary: Salary[] = [];
  ngOnInit() {
    this.setEmployee();
  }
  fetchEmployeeSalaries() {
    this.employeeService
      .getSalaries(this.employee.userName)
      .pipe(retry(1))
      .subscribe(
        (response: any) => {
          if (response && Array.isArray(response.salaries)) {
            this.employee_salary = response.salaries;
          } else {
            this.employee_salary = [];
          }
        },
        (error) => {}
      );
  }
  setEmployee() {
    this.route.paramMap.subscribe((param) => {
      let username: string | null = param.get("name");
      if (username != null) {
        this.employeeService.getEmployee(username).subscribe((data) => {
          this.employee = data;

          this.employee_salaries = this.employeeService.getSalaries(
            this.employee.userName
          );
          this.employee_leaves = this.employeeService.getEmployeeLeaves(
            this.employee.userName
          );
          this.employee_tasks = this.employeeService.getEmployeeTasks(
            this.employee.userName
          );

          this.employeeService
            .getDepartments()
            .pipe(retry(1))
            .subscribe(
              (departments: Department[]) => {
                const departmentOptions = departments.map((dept) => ({
                  label: dept.name || "Unknown",
                  value: dept._id ?? "",
                }));

                this.departmentOptions = departmentOptions;

                this.fetchEmployeeSalaries();
                this.getTasks();
                this.getLeaves();
                this.setformcontrol();
              },
              (error) => {
                return [];
              }
            );

          //this.employeeService
          //  .getDepartment(this.employee.userName)
          //  .subscribe((data) => {
          //    this.employee_department = data;
          //    console.log(this.employee_department);
          //  });
        });
      }
    });
  }

  success_status: string = "UNSET";

  update(data: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    jobtitle: string;
    role: string;
    departmentid: string;
    salary: string;
    walletAddress: string;
  }) {
    let updatedEmployee = {
      firstName: data.firstname == "" ? undefined : data.firstname,
      lastName: data.lastname == "" ? undefined : data.lastname,
      email: data.email == "" ? undefined : data.email,
      phoneNumber: data.phonenumber == "" ? undefined : data.phonenumber,
      jobTitle: data.jobtitle == "" ? undefined : data.jobtitle,
      role: data.role == "" ? undefined : data.role,
      departmentId: data.departmentid == "" ? undefined : data.departmentid,
      hireDate: "2024-11-26T10:21:38.124Z", //new Date().toString(),
      salary: data.salary == "" ? undefined : parseInt(data.salary),
      walletAddress:  data.walletAddress == "" ? undefined : data.walletAddress,
    };

    this.employeeService
      .updateEmployee(this.employee.userName, updatedEmployee)
      .subscribe(
        (data) => {
          this.success_status = "SUCCESS";
          this.setEmployee();
        },
        (error) => {
          this.success_status = "ERROR";
        }
      );
  }

  remove() {
    this.employeeService.removeEmployee(this.employee.userName).subscribe(
      (data) => {
        this.router.navigate(["/register"]);
      },
      (error) => {
        //console.log("FAILED TO REMOVE EMPLOYEE!");
      }
    );
  }

  // SALARY FORM ---------------------------------------------------------------------------------------------------------------------------------------------------
  salaryform: niceForm[] = [
    {
      name: "basicSalary",
      type: "text",
      title: "Basic salary: ",
      placeholder: "Basic salary",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]*")],
    },

    {
      name: "allowances",
      type: "text",
      title: "Allowances: ",
      placeholder: "Allowances",
      default: "",
      validators: [Validators.pattern("[0-9]*")],
    },

    {
      name: "deductions",
      type: "text",
      title: "Deductions: ",
      placeholder: "Deductions",
      default: "",
      validators: [Validators.pattern("[0-9]*")],
    },
  ];

  employee_salaries!: Observable<Object>;

  addSalary(data: {
    basicSalary: string;
    allowances: string;
    deductions: string;
  }) {
    let salary: Salary = {
      userName: this.employee.userName,
      basicSalary: parseInt(data.basicSalary),
      allowances: data.allowances == "" ? undefined : parseInt(data.allowances),
      deductions: data.deductions == "" ? undefined : parseInt(data.deductions),
      payDate: String(new Date()),
    };

    this.employeeService.addSalary(salary).subscribe(
      (data) => {
        this.setEmployee();
      },
      (error) => {}
    );
  }

  // REQUEST LEAVE FORM ------------------------------------------------------------------------------------------------------------------------------------------
  leaverequestform: niceForm[] = [
    {
      name: "reason",
      type: "text",
      title: "Reason for request: ",
      placeholder: "Reason",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "startDate",
      type: "date",
      title: "Start date: ",
      placeholder: "Start date",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "endDate",
      type: "date",
      title: "End date: ",
      placeholder: "End date",
      default: "",
      validators: [Validators.required],
    },
  ];

  employee_leaves!: Observable<Object>;

  requestLeave(data: { reason: string; startDate: string; endDate: string }) {
    let leave: Leave = {
      userName: this.employee.userName,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    this.employeeService.addLeave(leave).subscribe(
      (data) => {
        this.setEmployee();
      },
      (error) => {}
    );
  }

  leaves: any;
  getLeaves() {
    this.employeeService
      .getEmployeeLeaves(this.employee.userName)
      .subscribe((data) => {
        this.leaves = data;
      });
  }

  updateLeaves(taskid: string, value: string) {
    this.employeeService
      .updateLeave(taskid, { status: value })
      .subscribe((data) => {
        this.getLeaves();
      });
  }

  // CREATE TASK FORM ------------------------------------------------------------------------------------------------------------------------------------------
  createtaskform: niceForm[] = [
    {
      name: "description",
      type: "text",
      title: "Task description: ",
      placeholder: "Description",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "startDate",
      type: "date",
      title: "Start date: ",
      placeholder: "Start date",
      default: new Date().toISOString().substring(0, 10),
      validators: [Validators.required],
    },

    {
      name: "dueDate",
      type: "date",
      title: "Due date: ",
      placeholder: "Due date",
      default: new Date().toISOString().substring(0, 10),
      validators: [Validators.required],
    },
  ];

  employee_tasks!: Observable<Object>;

  createTask(data: {
    description: string;
    startDate: string;
    dueDate: string;
  }) {
    let task: Task = {
      userName: this.employee.userName,
      description: data.description,
      startDate: data.startDate,
      dueDate: data.dueDate,
    };

    this.employeeService.addTask(task).subscribe(
      (data) => {
        this.setEmployee();
      },
      (error) => {}
    );
  }
  tasks: any;
  getTasks() {
    this.employeeService
      .getEmployeeTasks(this.employee.userName)
      .subscribe((data) => {
        this.tasks = data;
      });
  }

  updateTask(taskid: string, value: string) {
    this.employeeService
      .updateTask(taskid, { status: value })
      .subscribe((data) => {
        this.getTasks();
      });
  }
}
