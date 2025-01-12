import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EthereumService } from "../../services/ethereum.service";
import { niceForm } from "../../employee"; // Assuming this is correct
import { NiceFormComponent } from "../nice-form/nice-form.component"; // Ensure NiceFormComponent is standalone or its module is imported
import { Validators } from "@angular/forms";

import { AgGridAngular } from "ag-grid-angular";
import type { ColDef } from "ag-grid-community";

@Component({
  selector: "app-wallet",
  standalone: true,
  imports: [CommonModule, NiceFormComponent, AgGridAngular],
  providers: [EthereumService],
  templateUrl: "wallet.html",
})
export class WalletComponent implements OnInit {
  constructor(public ethereumService: EthereumService) {}

  async ngOnInit() {
    await this.ethereumService.connectToBC();
    this.ethData.balance = await this.ethereumService.getBalance();
    this.ethData.isAdmin = await this.ethereumService.isAdmin();
    console.log(this.ethereumService);

    if (this.ethData.isAdmin) {
      await this.loadEmployees();
    }
  }

  ethData = {
    balance: "",
    isAdmin: false,
  };

  employees: any[] = [];

  employeeColDef: ColDef[] = [
    { field: "wallet" },
    { field: "basicSalary" },
    { field: "allowances" },
    { field: "deductions" },
  ];

  async addEmployee(data: {
    wallet: string;
    basicSalary: string;
    allowances: string;
    deductions: string;
  }) {
    await this.ethereumService.addEmployee(
      data.wallet,
      data.basicSalary,
      data.allowances,
      data.deductions
    );
    await this.loadEmployees();
  }

  // Form configuration
  addEmployeeForm: niceForm[] = [
    {
      name: "wallet",
      type: "text",
      title: "Wallet:",
      placeholder: "0x...",
      default: "",
      validators: [
        Validators.required,
        Validators.pattern(/^0x[a-fA-F0-9]{40}$/),
      ],
    },
    {
      name: "basicSalary",
      type: "text",
      title: "Basic Salary",
      placeholder: "Basic Salary",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]*")],
    },
    {
      name: "allowances",
      type: "text",
      title: "Allowances",
      placeholder: "Allowances",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]*")],
    },
    {
      name: "deductions",
      type: "text",
      title: "Deductions",
      placeholder: "Deductions",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]*")],
    },
  ];

  async loadEmployees() {
    const a = await this.ethereumService.getEmployees();
    const e = a.map((x: any) => {
      return {
        wallet: x["0"],
        basicSalary: x["1"],
        allowances: x["2"],
        deductions: x["3"],
        exists: x["4"],
      };
    });
    this.employees = [...e];
  }

  transferForm: niceForm[] = [
    {
      name: "wallet",
      type: "text",
      title: "Wallet:",
      placeholder: "0x...",
      default: "",
      validators: [
        Validators.required,
        Validators.pattern(/^0x[a-fA-F0-9]{40}$/),
      ],
    },
  ];

  async transfer(data: { wallet: string }) {
    await this.ethereumService.transferSalary(data.wallet);
  }

  async fundContract() {
    await this.ethereumService.fundContract();
  }
}
