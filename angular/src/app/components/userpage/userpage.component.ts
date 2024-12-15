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

@Component({
  selector: "app-userpage",
  imports: [
    SidebarComponent,
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    CommonModule,
    TaskcardComponent,
    LeavecardComponent
  ],
  templateUrl: "userpage.html",
  styles: ``,
})
export class UserpageComponent {
  employee!: Employee;
  formcontrol!: niceForm[];

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
        type: "text",
        title: "Role: " + this.strongstring(this.employee.role),
        placeholder: "Role",
        default: "",
        validators: [],
      },

      {
        name: "departmentid",
        type: "text",
        title:
          "Department ID: " + this.strongstring(this.employee.departmentId),
        placeholder: "Department ID",
        default: "",
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
    ];
  }

  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  employee_salary: Salary[] = [];
  ngOnInit() {
    this.setEmployee();
  }
  fetchEmployeeSalaries() {
        this.employeeService.
        getSalaries(this.employee.userName)
        .pipe(retry(1))
        .subscribe(
          (response: any) => {
            if (response && Array.isArray(response.salaries)) {
              this.employee_salary = response.salaries;
            } else {
              console.error("Invalid response format: Expected `leaves` array.");
              this.employee_salary = [];
            }
          },
          (error) => {
            console.error("Failed to fetch employee leaves:", error);
          }
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
          //this.employeeService
          //  .getDepartment(this.employee.userName)
          //  .subscribe((data) => {
          //    this.employee_department = data;
          //    console.log(this.employee_department);
          //  });
          this.fetchEmployeeSalaries();
          this.getTasks();
          this.getLeaves();
          this.setformcontrol();
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
  }) {
    let employee = {
      firstName: data.firstname == "" ? undefined : data.firstname,
      lastName: data.lastname == "" ? undefined : data.lastname,
      email: data.email == "" ? undefined : data.email,
      phoneNumber: data.phonenumber == "" ? undefined : data.phonenumber,
      jobTitle: data.jobtitle == "" ? undefined : data.jobtitle,
      role: data.role == "" ? undefined : data.role,
      departmentId: "674573519322d092552e31a4", //data.departmentid,
      hireDate: "2024-11-26T10:21:38.124Z", //new Date().toString(),
      salary: data.salary == "" ? undefined : parseInt(data.salary),
    };

    this.employeeService
      .updateEmployee(this.employee.userName, employee)
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
        console.log("FAILED TO REMOVE EMPLOYEE!");
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
      type: "text",
      title: "Start date: ",
      placeholder: "Start date",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "endDate",
      type: "text",
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
      type: "text",
      title: "Start date: ",
      placeholder: "Start date",
      default: new Date().toISOString().substring(0, 10),
      validators: [Validators.required],
    },

    {
      name: "dueDate",
      type: "text",
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
      (error) => {
      }
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
