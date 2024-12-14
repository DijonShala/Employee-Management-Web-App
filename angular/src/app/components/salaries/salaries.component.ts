import { Component } from "@angular/core";
import { Employee, niceForm, Salary } from "../../employee";
import { Validators } from "@angular/forms";
import { BehaviorSubject, Observable, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { AsyncPipe, CommonModule, JsonPipe } from "@angular/common";
import { AsyncAction } from "rxjs/internal/scheduler/AsyncAction";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-salaries",
  imports: [
    NiceFormComponent,
    AsyncPipe,
    JsonPipe,
    CommonModule,
    NgxChartsModule,
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
  employee!: Employee;

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

  ngOnInit() {
    this.setEmployee();
  }

  setEmployee() {
    this.employeeService
      .getEmployee(this.employeeService.username)
      .subscribe((data) => {
        this.employee = data;
        this.employee_salaries = this.employeeService.getSalaries(
          this.employee.userName
        );

        this.setSalaryData();
      });
  }

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
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
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
}
