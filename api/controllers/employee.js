import Employee from "../models/employee.js";

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
 *         '501':
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
 *           application/x-www-form-urlencoded:
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
    if (!req.body.userName) {
      res.status(400).json({
        message: "Query parameter 'username' is required.",
      });
      return;
    }

    if (!req.body.email || !req.body.firstName || !req.body.lastName) {
      res.status(400).json({
        message:
          "Query parameters 'email', 'firstName', 'lastName' are required.",
      });
      return;
    }

    const employee = await Employee.findOne({
      userName: req.body.userName,
    }).exec();
    if (employee) {
      res.status(400).json({
        message: `Query parameter 'username' must be unique.`,
      });
      return;
    }

    const email = await Employee.findOne({
      email: req.body.email,
    }).exec();
    if (email) {
      res.status(400).json({
        message: `Query parameter 'email' must be unique.`,
      });
      return;
    }

    doAddEmployee(req, res);
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const doAddEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create({
      address: {
        street: req.body.street,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
      },
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      jobTitle: req.body.jobTitle,
      departmentId: req.body.departmentId,
      hireDate: req.body.hireDate,
      salary: req.body.salary,
      status: "active",
    });

    res.status(200).json({ data: newEmployee });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee/{employeeId}:
 *     put:
 *       summary: Update an existing employee
 *       description: Update the details of an existing employee based on their unique employee ID.
 *       tags:
 *         - Employee
 *       parameters:
 *         - in: path
 *           name: employeeId
 *           required: true
 *           description: The unique ID of the employee to update.
 *           schema:
 *             type: string
 *             example: "674573519322d092552e31a4"
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
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
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    employee.userName = req.body.userName || employee.userName;
    employee.firstName = req.body.firstName || employee.firstName;
    employee.lastName = req.body.lastName || employee.lastName;
    employee.email = req.body.email || employee.email;
    employee.phoneNumber = req.body.phoneNumber || employee.phoneNumber;
    employee.jobTitle = req.body.jobTitle || employee.jobTitle;
    employee.departmentId = req.body.departmentId || employee.departmentId;
    employee.hireDate = req.body.hireDate || employee.hireDate;
    employee.salary = req.body.salary || employee.salary;
    employee.status = req.body.status || employee.status;

    if (req.body.street) employee.address.street = req.body.street;
    if (req.body.city) employee.address.city = req.body.city;
    if (req.body.zipCode) employee.address.zipCode = req.body.zipCode;
    if (req.body.country) employee.address.country = req.body.country;

    const updatedEmployee = await employee.save();

    res.status(200).json({ data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /employee/{employeeId}:
 *     delete:
 *       summary: Delete an employee
 *       description: Delete an **employee** by their unique employee ID.
 *       tags:
 *         - Employee
 *       parameters:
 *         - name: employeeId
 *           in: path
 *           required: true
 *           description: The unique ID of the employee to delete.
 *           schema:
 *             type: string
 *             example: "60b8d8f776cfae53d0d1a8f3"
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
    const { employeeId } = req.params;

    const employee = await Employee.findByIdAndDelete(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee successfully deleted." });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export default {
  employeeAll,
  employeeReadOne,
  employeeCreate,
  employeeDeleteOne,
  employeeUpdateOne,
};
