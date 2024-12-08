import { CanActivateFn } from "@angular/router";
import { EmployeeService } from "./employee.service";

import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const loginGuard: CanActivateFn = (route, state) => {
  return inject(EmployeeService).logged_in
    ? true
    : inject(Router).navigate(["/login"], {
        queryParams: { redirected: "true" },
      });
};
