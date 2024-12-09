import { CanActivateFn, Router } from "@angular/router";
import { EmployeeService } from "./employee.service";

import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(EmployeeService).administrator
    ? true
    : inject(Router).navigate(["/login"], {
        queryParams: { redirected: "true" },
      });
};
