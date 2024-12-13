import { CanActivateFn, Router } from "@angular/router";
import { EmployeeService } from "./services/employee.service";

import { inject } from "@angular/core";

export const loginGuard: CanActivateFn = (route, state) => {
  return inject(EmployeeService).logged_in
    ? true
    : inject(Router).navigate(["/login"], {
        queryParams: { redirected: "true" },
      });
};
