import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import hbsRouter from "./hbs/routes/hbs.js";
import apiRouter from "./api/routes/api.js";

/**
 * Swagger and OpenAPI
 */
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ppid } from "process";
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Clock In",
      version: "0.1.0",
      description: " **Rest API** used for LP-12 project" ,
    },
    tags: [
      {
        name: "Employee",
        description: "<b>Employee</b> (users)",
      },
      {
        name: "Attendance",
        description: "Employee's <b>attendance</b>",
      },
      {
        name: "Task",
        description: "Employee's <b>tasks</b>",
      },
      {
        name: "Leave",
        description: "Employee's <b>leaves</b>",
      },
      {
        name: "Salary",
        description: "Employee's <b>salaries</b>",
      },
      {
        name: "Department",
        description: "<b>Department</b>",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://sp-2024-2025.fly.dev/api",
        description: "Production server",
      },
    ],
  },
  components: {
    schemas: {
      Employee: {
        type: "object",
        properties: {
          userName: {
            type: "string",
            description: "The employee's username.",
            example: "admin",
          },
          firstName: {
            type: "string",
            description: "The employee's first name.",
            example: "Admin",
          },
          lastName: {
            type: "string",
            description: "The employee's last name.",
            example: "User",
          },
          email: {
            type: "string",
            format: "email",
            description: "The employee's email address.",
            example: "admin@test.com",
          },
          phoneNumber: {
            type: "string",
            description: "The employee's phone number.",
            example: "123456789",
          },
          jobTitle: {
            type: "string",
            description: "The employee's job title.",
            example: "Administrator",
          },
          departmentId: {
            type: "string",
            description: "The department ID to which the employee belongs.",
            example: "674573519322d092552e31a4",
          },
          hireDate: {
            type: "string",
            format: "date-time",
            description: "The employee's hire date.",
            example: "2024-11-26T07:05:53.773Z",
          },
          salary: {
            type: "number",
            format: "float",
            description: "The employee's salary.",
            example: 100000,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            description: "The employee's status.",
            example: "active",
          },
        },
        required: [
          "userName",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "jobTitle",
          "departmentId",
          "hireDate",
          "salary",
          "status",
        ],
      },
      Attendance: {
        type: "object",
        properties: {
          userName: {
            type: "string",
            description: "The employee's username.",
            example: "admin",
          },
          clock_in_time: {
            type: "string",
            format: "date-time",
            description: "Clock in time.",
          },
          clock_out_time: {
            type: "string",
            format: "date-time",
            description: "Clock out time.",
          },
          status: {
            type: "string",
            description: "Status of clockin.",
          },
          _id: {
            type: "string",
          },
          _v: {
            type: "number",
          },
        },
        required: ["userName"],
      },
      Leave: {
        type: "object",
        properties: {
          userName: {
            type: "string",
            description: "The employee's username.",
            example: "admin",
          },
          leaveType: {
            type: "string",
            description: "Type of leave (e.g., Sick, Casual, Vacation).",
            example: "Sick",
          },
          startDate: {
            type: "string",
            format: "date",
            description: "Start date of leave.",
            example: "2024-11-25",
          },
          endDate: {
            type: "string",
            format: "date",
            description: "End date of leave.",
            example: "2024-11-30",
          },
          status: {
            type: "string",
            enum: ["Pending", "Approved", "Rejected"],
            description: "Status of the leave request.",
            example: "Pending",
          },
          reason: {
            type: "string",
            description: "Reason for the leave request.",
            example: "Medical reasons",
          },
        },
        required: [
          "userName",
          "leaveType",
          "startDate",
          "endDate",
          "status",
        ],
      },
      Task: {
        type: "object",
        properties: {
          userName: {
            type: "string",
            description: "The employee's username.",
            example: "admin",
          },
          description: {
            type: "string",
            description: "Description of the task.",
            example: "Complete the monthly report",
          },
          startDate: {
            type: "string",
            format: "date-time",
            description: "Task start date.",
            example: "2024-11-25T08:00:00.000Z",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            description: "Due date for the task.",
            example: "2024-11-30T17:00:00.000Z",
          },
          status: {
            type: "string",
            enum: ["Todo", "In Progress", "Done"],
            description: "Current status of the task.",
            example: "Todo",
          },
        },
        required: [
          "userName",
          "description",
          "startDate",
          "dueDate",
          "status",
        ],
      },
      Salary: {
        type: "object",
        properties: {
          userName: {
            type: "string",
            description: "The employee's username.",
            example: "admin",
          },
          basicSalary: {
            type: "number",
            description: "Basic salary amount.",
            example: 5000,
          },
          allowances: {
            type: "number",
            description: "Additional allowances.",
            example: 1000,
          },
          deductions: {
            type: "number",
            description: "Salary deductions.",
            example: 500,
          },
          netSalary: {
            type: "number",
            description: "Net salary after deductions.",
            example: 4500,
          },
          payDate: {
            type: "string",
            format: "date-time",
            description: "Date of salary payment.",
            example: "2024-11-25T12:00:00.000Z",
          },
        },
        required: [
          "userName",
          "basicSalary",
          "allowances",
          "deductions",
          "netSalary",
          "payDate",
        ],
      },
      Department: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the department.",
            example: "Accounting",
          },
          description: {
            type: "string",
            description: "Description of the department.",
            example: "The accounting department manages financial records, ensures compliance with regulations, and oversees budgeting, payroll, and financial reporting.",
          },
          _id: {
            type: "string",
            description: "Unique identifier for the department.",
          },
          __v: {
            type: "integer",
            description: "MongoDB version key.",
            readOnly: true,
          },
        },
        required: ["name"],
      },
      ErrorMessage: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message describing the error.",
          },
        },
        required: ["message"],
      },
    },
  },
  apis: [
    "./api/models/employee.js",
    "./api/models/attendance.js",
    "./api/models/leave.js",
    "./api/models/salary.js",
    "./api/models/task.js",
    "./api/models/department.js",
    "./api/models/db.js",
    "./api/controllers/*.js",
  ],
});

/**
 * Database connection
 */
import "./api/models/db.js";

/**
 * Create server
 */
const port = process.env.PORT || 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json());

/**
 * Static pages
 */
app.use(express.static(join(__dirname, "public")));

/**
 * Body parser (application/x-www-form-urlencoded)
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * View engine (HBS) setup
 */
app.set("views", join(__dirname, "hbs", "views"));
app.set("view engine", "hbs");

/**
 * HBS routing
 */
app.use("/", hbsRouter);

/**
 * API routing
 */
app.use("/api", apiRouter);
/**
 * Swagger file and explorer
 */
apiRouter.get("/swagger.json", (req, res) => res.status(200).json(swaggerDocument));
apiRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);
/**
 * Start server
 */
app.listen(port, () => {
  console.log(
    `Demo app started in ${
      process.env.NODE_ENV || "development"
    } mode listening on port ${port}!`
  );
});
