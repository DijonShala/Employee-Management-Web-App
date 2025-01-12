import { Component, Input } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'payslip-pdf',
  template: '<button class="btn btn-primary btn-sm w-100" (click)="downloadPDF()">Download PDF</button>',
  standalone: true,
  styles: []
})
export class PayslipPdfComponent {
  @Input() user: any;
  @Input() salary: any;
  @Input() conversion: number = 1;
  @Input() selected_currency: string = 'USD';

  downloadPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const address = `${this.user.address.street}, ${this.user.address.zipCode} ${this.user.address.city}, ${this.user.address.country}`;

    const payrollData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      address: address,
      basicSalary: `${(this.salary.basicSalary * this.conversion).toFixed(2)} ${this.selected_currency}`,
      allowances: `${(this.salary.allowances * this.conversion).toFixed(2)} ${this.selected_currency}`,
      deductions: `${(this.salary.deductions * this.conversion).toFixed(2)} ${this.selected_currency}`,
      netSalary: `${((this.salary.basicSalary + (this.salary.allowances || 0) - (this.salary.deductions || 0)) * this.conversion).toFixed(2)} ${this.selected_currency}`,
      payDate: new Date(this.salary.payDate).toLocaleDateString()
    };

    // Extract month and year from payDate
    const payDate = new Date(this.salary.payDate);
    const month = payDate.toLocaleString('default', { month: 'long' });
    const year = payDate.getFullYear();

    // Header
    doc.setFont("arial", "bold");
    doc.setFontSize(20);
    doc.text(`Payslip for ${month.toUpperCase()} ${year}`, 105, 30, { align: "center" });
    doc.setFont("arial", "normal");
    doc.setFontSize(12);
    doc.text("Employee Management Team", 105, 38, { align: "center" });

    // Employee Details
    doc.setFont("arial", "bold");
    doc.setFontSize(12);

    doc.text("First Name:", 25, 60);
    doc.text("Last Name:", 25, 67);
    doc.text("Address:", 25, 74);
    doc.text("Pay Date:", 25, 81);

    doc.setFont("arial", "normal");

    doc.text(`${payrollData.firstName}`, 50, 60);
    doc.text(`${payrollData.lastName}`, 50, 67);
    doc.text(`${payrollData.address}`, 50, 74);
    doc.text(`${payrollData.payDate}`, 50, 81);

    // Table
    doc.line(25, 95, 185, 95);
    doc.line(25, 105, 185, 105);
    doc.line(25, 115, 185, 115);
    doc.line(25, 125, 185, 125);
    doc.line(25, 135, 185, 135);

    doc.line(25, 95, 25, 135);
    doc.line(70, 95, 70, 135);
    doc.line(185, 95, 185, 135);

    // Salary Details
    doc.text("Basic salary:", 30, 102);
    doc.text("Allowances:", 30, 112);
    doc.text("Deductions:", 30, 122);
    doc.setFont("arial", "bold");
    doc.text("Net salary:", 30, 132);

    doc.setFont("arial", "normal");
    doc.text(payrollData.basicSalary, pageWidth - doc.getTextWidth(payrollData.basicSalary) - 30, 102);
    doc.text(payrollData.allowances, pageWidth - doc.getTextWidth(payrollData.allowances) - 30, 112);
    doc.text(payrollData.deductions, pageWidth - doc.getTextWidth(payrollData.deductions) - 30, 122);
    doc.setFont("arial", "bold");
    doc.text(payrollData.netSalary, pageWidth - doc.getTextWidth(payrollData.netSalary) - 30, 132);

    // Save PDF
    const fileName = `Payslip_${month}_${year}.pdf`;
    doc.save(fileName);
  }
}
