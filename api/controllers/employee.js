import Employee from "../models/employee.js";
import { joiemployeeSchema, joiemployeeUpdateSchema } from "../utils/joivalidate.js";
/**
 * @openapi
 * paths:
 *   /employee-all:
 *     get:
 *       summary: Retrieve all employees.
 *       description: Retrieve **employee data** of all employees.
 *       tags:
 *         - Employee
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with employee data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Employee'
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const employeeAll = async (req, res) => {
  try {
    const employee = await Employee.find().select("-_id").exec();
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee/{username}:
 *     get:
 *       summary: Retrieve employee by username.
 *       description: Retrieve **employee data** by employee username.
 *       tags:
 *         - Employee
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: <b>username</b> of the employee
 *           schema:
 *             type: string
 *             minLength: 0
 *             maxLength: 100
 *           example: admin
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with employee data.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Employee'
 *         '404':
 *           description: Employee not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found."
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter 'username' is required"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const employeeReadOne = async (req, res) => {
  try {
    if (
      !req.params.username ||
      req.params.username == undefined ||
      !req.params.username.length < 0
    ) {
      res.status(400).json({
        message: "Query parameter 'username' is required",
      });
      return;
    }
    const employee = await Employee.findOne({
      userName: req.params.username,
    }).exec();
    if (!employee) {
      res.status(404).json({
        message: `Employe with id '${req.params.username}' not found`,
      });
    } else {
      res.status(200).json(employee);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee:
 *     post:
 *       summary: Create a new employee
 *       description: Create a new **employee** with all details.
 *       tags:
 *         - Employee
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                   description: "The unique username of the employee"
 *                   example: "admin"
 *                   minLength: 3
 *                   maxLength: 20
 *                 email:
 *                   type: string
 *                   description: "The unique email of the employee"
 *                   format: email
 *                   example: "admin@test.com"
 *                 firstName:
 *                   type: string
 *                   example: "Admin"
 *                 lastName:
 *                   type: string
 *                   example: "User"
 *                 street:
 *                   type: string
 *                   example: "123 Admin Street"
 *                 city:
 *                   type: string
 *                   example: "Admin City"
 *                 zipCode:
 *                   type: string
 *                   example: "00000"
 *                 country:
 *                   type: string
 *                   example: "Adminland"
 *                 phoneNumber:
 *                   type: string
 *                   example: "123456789"
 *                 jobTitle:
 *                   type: string
 *                   example: "Administrator"
 *                 departmentId:
 *                   type: string
 *                   example: "674573519322d092552e31a4"
 *                 hireDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-26T10:21:38.124Z"
 *                 salary:
 *                   type: number
 *                   format: float
 *                   example: 100000
 *               required:
 *                 - userName
 *                 - firstName
 *                 - lastName
 *                 - email
 *       responses:
 *         '201':
 *           description: <b>Created</b>, with employee data.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Employee'
 *               example:
 *                 userName: "admin"
 *                 address:
 *                   street: "123 Admin Street"
 *                   city: "Admin City"
 *                   zipCode: "00000"
 *                   country: "Adminland"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 email: "admin@test.com"
 *                 phoneNumber: "123456789"
 *                 jobTitle: "Administrator"
 *                 departmentId: "674573519322d092552e31a4"
 *                 hireDate: "2024-11-26T07:05:53.773Z"
 *                 salary: 100000
 *                 status: "active"
 *                 __v: 0
 *         '400':
 *           description: Bad Request with error message.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Username is required."
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const employeeCreate = async (req, res) => {
  try {
    const result = joiemployeeSchema.validate(req.body, { abortEarly: false });
    const { error, value } = result;
    if (error) {
      return res.status(400).json({
        message: "Validation error.",
        details: error.details.map((detail) => detail.message),
      });
    }

    const employee = await Employee.findOne({
      userName: value.userName,
    }).exec();
    if (employee) {
      res.status(400).json({
        message: `Query parameter 'username' must be unique.`,
      });
      return;
    }

    const email = await Employee.findOne({
      email: value.email,
    }).exec();
    if (email) {
      res.status(400).json({
        message: `Query parameter 'email' must be unique.`,
      });
      return;
    }

    doAddEmployee(value, res);
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const doAddEmployee = async (value, res) => {
  try {
    const newEmployee = await Employee.create({
      address: {
        street: value.street,
        city: value.city,
        zipCode: value.zipCode,
        country: value.country,
      },
      userName: value.userName,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phoneNumber: value.phoneNumber,
      jobTitle: value.jobTitle,
      departmentId: value.departmentId,
      hireDate: value.hireDate,
      salary: value.salary,
      status: value.status,
    });

    res.status(200).json({ data: newEmployee });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee/{username}:
 *     put:
 *       summary: Update an existing employee
 *       description: Update the details of an existing employee based on their unique employee ID.
 *       tags:
 *         - Employee
 *       parameters:
 *         - in: path
 *           name: username
 *           required: true
 *           description: The unique ID of the employee to update.
 *           schema:
 *             type: string
 *             example: "admin"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                   description: "The unique username of the employee."
 *                   example: "admin"
 *                   minLength: 3
 *                   maxLength: 20
 *                 firstName:
 *                   type: string
 *                   description: "The first name of the employee."
 *                   example: "Admin"
 *                 lastName:
 *                   type: string
 *                   description: "The last name of the employee."
 *                   example: "User"
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: "The email address of the employee."
 *                   example: "admin@test.com"
 *                 phoneNumber:
 *                   type: string
 *                   description: "The phone number of the employee."
 *                   example: "123456789"
 *                 jobTitle:
 *                   type: string
 *                   description: "The job title of the employee."
 *                   example: "Administrator"
 *                 departmentId:
 *                   type: string
 *                   description: "The department ID the employee belongs to."
 *                   example: "674573519322d092552e31a4"
 *                 hireDate:
 *                   type: string
 *                   format: date-time
 *                   description: "The hire date of the employee."
 *                   example: "2024-11-26T10:21:38.124Z"
 *                 salary:
 *                   type: number
 *                   format: float
 *                   description: "The salary of the employee."
 *                   example: 100000
 *                 status:
 *                   type: string
 *                   description: "The employment status of the employee (e.g., active, inactive)."
 *                   example: "active"
 *                 street:
 *                   type: string
 *                   description: "Street address of the employee."
 *                   example: "123 Admin Street"
 *                 city:
 *                   type: string
 *                   description: "City where the employee lives."
 *                   example: "Admin City"
 *                 zipCode:
 *                   type: string
 *                   description: "Zip code of the employee's address."
 *                   example: "00000"
 *                 country:
 *                   type: string
 *                   description: "Country where the employee resides."
 *                   example: "Adminland"
 *               required:
 *                 - userName
 *                 - firstName
 *                 - lastName
 *                 - email
 *                 - status
 *       responses:
 *         '200':
 *           description: <b>Updated</b> employee data.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Employee'
 *               example:
 *                 userName: "admin"
 *                 address:
 *                   street: "123 Admin Street"
 *                   city: "Admin City"
 *                   zipCode: "00000"
 *                   country: "Adminland"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 email: "admin@test.com"
 *                 phoneNumber: "123456789"
 *                 jobTitle: "Administrator"
 *                 departmentId: "674573519322d092552e31a4"
 *                 hireDate: "2024-11-26T07:05:53.773Z"
 *                 salary: 100000
 *                 status: "active"
 *         '404':
 *           description: Not Found if the employee with the provided ID does not exist.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Employee not found."
 *         '500':
 *           description: Internal Server Error if something goes wrong on the server.
 *           content:
 *             application/json:
 *               example:
 *                 message: "An error occurred while updating the employee."
 */

const employeeUpdateOne = async (req, res) => {
  try {
    const { username } = req.params;
    const { error, value } = joiemployeeUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error.",
        details: error.details.map((detail) => detail.message),
      });
    }
    const employee = await Employee.findOne({ userName: username });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    employee.userName = value.userName || employee.userName;
    employee.firstName = value.firstName || employee.firstName;
    employee.lastName = value.lastName || employee.lastName;
    employee.email = value.email || employee.email;
    employee.phoneNumber = value.phoneNumber || employee.phoneNumber;
    employee.jobTitle = value.jobTitle || employee.jobTitle;
    employee.departmentId = value.departmentId || employee.departmentId;
    employee.hireDate = value.hireDate || employee.hireDate;
    employee.salary = value.salary || employee.salary;
    employee.status = value.status || employee.status;

    if (value.street) employee.address.street = value.street;
    if (value.city) employee.address.city = value.city;
    if (value.zipCode) employee.address.zipCode = value.zipCode;
    if (value.country) employee.address.country = value.country;

    const updatedEmployee = await employee.save();

    res.status(200).json({ data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee/{username}:
 *     delete:
 *       summary: Delete an employee
 *       description: Delete an **employee** by their unique employee ID.
 *       tags:
 *         - Employee
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: The unique ID of the employee to delete.
 *           schema:
 *             type: string
 *             example: "admin"
 *       responses:
 *         '200':
 *           description: <b>OK</b>, employee deleted successfully.
 *           content:
 *              application/json:
 *               example:
 *                 message: "Employee successfully deleted."
 *         '404':
 *           description: <b>Not Found</b>, employee not found.
 *           content:
 *              application/json:
 *               example:
 *                 message: "Employee not found"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Error occurred while deleting employee"
 */

const employeeDeleteOne = async (req, res) => {
  try {
    const { username } = req.params;

    const employee = await Employee.findOneAndDelete({ userName: username });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee successfully deleted." });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee-filter:
 *     get:
 *       summary: List employees with multi-filters
 *       description: Retrieve a list of **employees** filtered by query parameters such as `firstName`, `lastName`, `email`, `jobTitle`, and `address`.
 *       tags:
 *         - Employee
 *       parameters:
 *         - name: firstName
 *           in: query
 *           required: false
 *           description: Filter employees by first name.
 *           schema:
 *             type: string
 *         - name: lastName
 *           in: query
 *           required: false
 *           description: Filter employees by last name.
 *           schema:
 *             type: string
 *         - name: email
 *           in: query
 *           required: false
 *           description: Filter employees by email address.
 *           schema:
 *             type: string
 *         - name: phoneNumber
 *           in: query
 *           required: false
 *           description: Filter employees by phone number.
 *           schema:
 *             type: string
 *         - name: jobTitle
 *           in: query
 *           required: false
 *           description: Filter employees by job title.
 *           schema:
 *             type: string
 *         - name: departmentId
 *           in: query
 *           required: false
 *           description: Filter employees by department ID.
 *           schema:
 *             type: string
 *         - name: hireDate
 *           in: query
 *           required: false
 *           description: Filter employees by hire date.
 *           schema:
 *             type: string
 *             format: date
 *         - name: salary
 *           in: query
 *           required: false
 *           description: Filter employees by salary.
 *           schema:
 *             type: integer
 *         - name: address.city
 *           in: query
 *           required: false
 *           description: Filter employees by their address (e.g., address.city or address.street).
 *           schema:
 *             type: string
 *         - name: address.street
 *           in: query
 *           required: false
 *           description: Filter employees by their address (e.g., address.city or address.street).
 *           schema:
 *             type: string
 *         - name: address.zipcode
 *           in: query
 *           required: false
 *           description: Filter employees by their address (e.g., address.city or address.street).
 *           schema:
 *             type: string
 *         - name: nResults
 *           in: query
 *           required: false
 *           description: The maximum number of employees to return in the response (defaults to 10).
 *           schema:
 *             type: integer
 *             example: 10
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with employee list.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Employee'
 *         '404':
 *           description: <b>Not Found</b>, no employees found matching the provided filters.
 *           content:
 *             application/json:
 *               example:
 *                 message: "No employee found."
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const allowedCodelists = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "jobTitle",
  "departmentId",
  "hireDate",
  "salary",
  "address.city",
  "address.street",
  "address.zipcode",
];

const employeeListByMultiFilter = async (req, res) => {
  let filter = [];

  allowedCodelists.forEach((codelist) => {
    let value = req.query[codelist];
    if (value) {
      if (codelist === "address") {
        Object.keys(req.query).forEach((key) => {
          if (key.startsWith("address.")) {
            let field = key.split(".")[1];
            filter.push({ $match: { [`address.${field}`]: req.query[key] } });
          }
        });
      } else {
        filter.push({ $match: { [codelist]: value } });
      }
    }
  });

  let nResults = parseInt(req.query.nResults);
  nResults = isNaN(nResults) ? 10 : nResults;
  filter.push({ $limit: nResults });

  try {
    let employee = await Employee.aggregate(filter).exec();
    if (!employee || employee.length === 0)
      res.status(404).json({ message: "No employee found." });
    else res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  employeeAll,
  employeeReadOne,
  employeeCreate,
  employeeDeleteOne,
  employeeUpdateOne,
  employeeListByMultiFilter,
};
