import { Component } from "@angular/core";
import { Employee, niceForm, Salary } from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, retry, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import {
  AsyncPipe,
  CommonModule,
  JsonPipe,
  KeyValuePipe,
} from "@angular/common";
import { AsyncAction } from "rxjs/internal/scheduler/AsyncAction";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-salaries",
  imports: [
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    KeyValuePipe,
    CommonModule,
    NgxChartsModule,
    FormsModule,
  ],
  templateUrl: "salaries.html",
  styles: ``,
})
export class SalariesComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.setEmployee();
    this.loadUserNames();

    this.currencySetup();
  }

  salaryform: niceForm[] = [
    {
      name: "userName",
      type: "select",
      title: "User Name: ",
      placeholder: "User Name",
      default: "",
      validators: [Validators.required],
      options: [],
    },
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
  /*
  monthform: niceForm[] = [
    {
      name: "month",
      type: "string",
      title: "Month: ",
      placeholder: "Enter month",
      default: "",
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
    },
    {
      name: "year",
      type: "string",
      title: "Year: ",
      placeholder: "Enter year",
      default: "",
      validators: [Validators.required, Validators.min(1900)],
    },
  ];
  */
  employee_salaries!: Observable<Object>;
  employee_salary: Salary[] = [];
  employee!: Employee;

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

  addSalary(data: {
    userName: string;
    basicSalary: string;
    allowances: string;
    deductions: string;
  }) {
    let salary: Salary = {
      userName: data.userName,
      basicSalary: parseInt(data.basicSalary),
      allowances: data.allowances == "" ? undefined : parseInt(data.allowances),
      deductions: data.deductions == "" ? undefined : parseInt(data.deductions),
      payDate: String(new Date()),
    };

    this.employeeService.addSalary(salary).subscribe(
      (data) => {
        this.success = true;
        this.error = false;

        this.setEmployee();
        this.fetchEmployeeSalaries();
      },
      (error) => {
        this.error = true;
      }
    );
  }

  setEmployee() {
    this.employeeService
      .getEmployee(this.employeeService.username)
      .subscribe((data) => {
        this.employee = data;
        this.employee_salaries = this.employeeService.getSalaries(
          this.employee.userName
        );
        this.fetchEmployeeSalaries();
        this.setSalaryData();
      });
  }

  error: boolean = false;
  success: boolean = false;

  loadUserNames() {
    this.employeeService.getEmployees().subscribe(
      (employees: Employee[]) => {
        const userNames = employees.map((emp) => ({
          label: emp.userName,
          value: emp.userName,
        }));

        const userNameControl = this.salaryform.find(
          (control) => control.name === "userName"
        );
        if (userNameControl) {
          userNameControl.options = userNames;
          userNameControl.default = userNames[0]?.value || "";
        }
      },
      (error) => {
        //console.error("Error loading usernames:", error);
      }
    );
  }

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

  filteredSalaries: Salary[] = [];

  salarydata$: BehaviorSubject<
    { name: string; series: { value: number; name: string }[] }[]
  > = new BehaviorSubject<
    { name: string; series: { value: number; name: string }[] }[]
  >([]);

  setSalaryData(): void {
    // Initialize an empty data structure
    const salarydata: {
      name: string;
      series: { value: number; name: string }[];
    }[] = [
      { name: "Basic salary", series: [] },
      { name: "Allowances", series: [] },
      { name: "Deductions", series: [] },
      { name: "Net pay", series: [] },
    ];

    this.employee_salaries.pipe(take(1)).subscribe((data: any) => {
      const salaries = data.salaries || [];

      salaries.forEach((salary: Salary) => {
        const payDate = new Date(salary.payDate).toLocaleDateString();

        salarydata[0].series.push({ value: salary.basicSalary, name: payDate });
        salarydata[1].series.push({
          value: salary.allowances ?? 0,
          name: payDate,
        });
        salarydata[2].series.push({
          value: salary.deductions ?? 0,
          name: payDate,
        });
        salarydata[3].series.push({
          value:
            (salary.basicSalary ?? 0) +
            (salary.allowances ?? 0) -
            (salary.deductions ?? 0),
          name: payDate,
        });
      });

      this.salarydata$.next(salarydata);
    });
  }

  JSONparse(st: string) {
    return JSON.parse(st);
  }

  onSelect(data: any): void {
    //console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  view: [number, number] = [700, 300];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Time";
  yAxisLabel: string = "Money";
  timeline: boolean = true;

  colorScheme = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };

  rates: any = undefined;

  selected_currency: string = "USD";
  selected_currency_select_text: string = "USD ($)";

  conversion: number = 1;

  currencySetup() {
    this.employeeService.getCurrencyConversionRates().subscribe(
      (data) => {
        this.rates = data;
      },
      (error) => {}
    );
  }

  change_currency() {
    this.selected_currency = this.selected_currency_select_text.split(" ")[0];
    this.conversion = this.rates.rates[this.selected_currency];
  }
}
