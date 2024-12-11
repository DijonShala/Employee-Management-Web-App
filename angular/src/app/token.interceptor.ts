import { HttpInterceptorFn } from "@angular/common/http";
import { EmployeeService } from "./employee.service";
import { inject } from "@angular/core";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from the service.
  const authToken = inject(EmployeeService).token;

  // Clone the request and replace the original headers with
  // cloned headers, updated with the authorization.
  const authReq = req.clone({
    headers: req.headers.set("Authorization", authToken),
  });

  // send cloned request with header to the next handler.

  console.log(authReq);

  return next(authReq);
};
