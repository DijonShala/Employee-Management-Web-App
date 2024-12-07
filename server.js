import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import hbsRouter from "./hbs/routes/hbs.js";
import apiRouter from "./api/routes/api.js";

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
 * Swagger and OpenAPI
 */
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ppid } from "process";
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Clockin",
      version: "0.1.0",
      description: "",
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
    "./api/models/department.js",
    "./api/models/db.js",
    "./api/controllers/*.js",
  ],
});

/**
 * Swagger file and explorer
 */
app.get("/swagger.json", (req, res) => res.status(200).json(swaggerDocument));
app.use(
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
