import { CommonModule } from "@angular/common";
import { Component, TemplateRef } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";


@Component({
  selector: "app-navbar",
  imports: [RouterModule, CommonModule],
  templateUrl: "./navbar.html",
  template: ``,
  styles: ``,
})
export class NavbarComponent {
  constructor(
    public employeeService: EmployeeService, // PUBLIC : accessible from navbar.html
    private router: Router,
    private modalService: BsModalService
  ) {}
  ngOnInit() {}

  modalRef?: BsModalRef;
  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true
    });
  }
  
  logout() {
    this.employeeService.logout();
    this.router.navigate(["/login"]);
  }
  addData() {
    this.employeeService.addInitialData().subscribe({
      next: () => {},
      error: (err) => {},
    });
  }

  deleteData() {
    this.employeeService.deleteData().subscribe({
      next: () => {},
      error: (err) => {},
    });
  }
}
