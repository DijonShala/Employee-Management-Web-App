import { ɵHttpInterceptingHandler } from "@angular/common/http";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { ValidatorFn } from "@angular/forms";

export interface Attendance {
  employee_ID: string; // username

  clock_in_time: Date;
  clock_out_time: Date;

  status?: string;
  _id?: string;
}

export interface Employee {
  userName: string;
  password: string;

  firstName: string;
  lastName: string;

  email: string;
  phoneNumber: string;

  jobTitle: string;
  role: string;
  departmentId: string;

  hireDate: string;

  salary: number;
  walletAddress?: string;

  adress?: {
    street?: string;
    city?: string;
    zipcode?: string;
    country?: string;
  };

  status?: string;

  clock_in_time?: number;
  clock_out_time?: number;

  clocked_in?: boolean;
  clocked_in_time?: number;
}

export interface Salary {
  userName: string;
  basicSalary: number;

  allowances?: number;
  deductions?: number;
  netSalary?: number;

  payDate: string;
  _id?: string;
}

export interface Leave {
  userName?: string;
  reason: string;
  startDate: string;
  endDate: string;
  status?: string;
  appliedAt?: string;
  _id?: string;
}

export interface Task {
  userName: string;
  description: string;
  startDate: string;
  dueDate: string;
  status?: string;
  updatedAt?: string;
  _id?: string;
}

export interface Department {
  name: string;
  description?: string;
  _id?: string;
}

// Form interface

export interface niceForm {
  name: string;
  type: string | number;
  title?: string;
  placeholder?: string;
  default: string | boolean | Date ;
  validators: ValidatorFn[];
  options?: { label: string; value: string | number }[]; // FOR SELECT
  value?: string;
}
