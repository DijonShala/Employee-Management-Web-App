import { CanActivateFn, Router } from "@angular/router";
import { EmployeeService } from "./services/employee.service";

import { inject } from "@angular/core";

export const notLoginGuard: CanActivateFn = (route, state) => {
  return inject(EmployeeService).logged_in
    ? inject(Router).navigate(["/clockin"], {})
    : true;
};
