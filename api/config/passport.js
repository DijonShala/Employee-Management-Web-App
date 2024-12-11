import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Employee from "../models/employee.js";

passport.use(
    new LocalStrategy(
      {
        usernameField: "userName",
        passwordField: "password",
      },
      async (username, password, cbDone) => {
        try {
          let employee = await Employee.findOne({ userName: username });
          if (!employee || !(await employee.validPassword(password))) {
            return cbDone(null, false, { message: "Incorrect username or password." });
          }
          return cbDone(null, employee);
        } catch (err) {
          return cbDone(err);
        }
      }
    )
  );