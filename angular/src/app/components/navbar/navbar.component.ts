import { CommonModule } from "@angular/common";
import { Component, OnDestroy, TemplateRef } from "@angular/core";
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

  windowWidth: number = window.innerWidth;
  intervalId: any;
  hamburgerMenu: Boolean = false;
  menuHidden: Boolean = true;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (window.innerWidth < 950) {
        this.hamburgerMenu = true;
      } else {
        this.hamburgerMenu = false;
      }
    }, 100); // Check every 100ms
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clean up interval to avoid memory leaks
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  openUrl(url: string) {
    this.menuHidden = true;
    this.router.navigateByUrl(url);
  }

  modalRef?: BsModalRef;
  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  logout() {
    this.employeeService.logout();
    this.openUrl("/login");
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
