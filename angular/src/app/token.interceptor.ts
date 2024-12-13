import { HttpInterceptorFn } from "@angular/common/http";
import { EmployeeService } from "./services/employee.service";
import { inject } from "@angular/core";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from the service.
  const authToken = "Bearer ".concat(inject(EmployeeService).token);

  // Clone the request and replace the original headers with
  // cloned headers, updated with the authorization.
  const authReq = req.clone({
    headers: req.headers.set("Authorization", authToken),
  });

  //console.log(authReq);

  // send cloned request with header to the next handler.
  return next(authReq);
};
