import Joi from "joi";
/**
 * Employee
 */
const joiemployeeSchema = Joi.object({
  userName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.base": "Username must be a string.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username cannot exceed 20 characters.",
      "any.required": "Username is required.",
    }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  jobTitle: Joi.string().required(),
  role: Joi.string().valid('admin', 'employee').required().messages({
    'any.only': `"role" must be one of the following: admin, employee`
  }),
  departmentId: Joi.string().required(),
  hireDate: Joi.date().iso().required(),
  salary: Joi.number().required(),
  status: Joi.string().valid('active', 'inactive').required().messages({
    'any.only': `"status" must be one of the following: active, inactive`
  }),
  street: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
});

const joiemployeeUpdateSchema = Joi.object({
  userName: Joi.string().min(3).max(20).optional().messages({
    "string.base": "Username must be a string.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 20 characters.",
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address.",
  }),
  phoneNumber: Joi.string().optional(),
  jobTitle: Joi.string().optional(),
  role: Joi.string().valid('admin', 'employee').optional().messages({
    'any.only': `"role" must be one of the following: admin, employee`
  }),
  departmentId: Joi.string().optional(),
  hireDate: Joi.date().iso().optional(),
  salary: Joi.number().optional(),
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  country: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').optional().messages({
    'any.only': `"status" must be one of the following: active, inactive`
  })
});

/**
 * Leave
 */
const joiAddLeaveSchema = Joi.object({
  reason: Joi.string().min(1).max(500).required().messages({
    'string.empty': `"reason" is a required field`,
    'string.min': `"reason" must have at least 1 character`,
    'string.max': `"reason" cannot exceed 500 characters`
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': `"startDate" should be a valid date`,
    'any.required': `"startDate" is a required field`
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': `"endDate" should be a valid date`,
    'any.required': `"endDate" is a required field`,
    'date.greater': `"endDate" must be after the "startDate"`
  })
});

const joiUpdateLeaveStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Approved', 'Rejected').required().messages({
    'any.only': `"status" must be one of the following: Pending, Approved, Rejected`,
    'any.required': `"status" is a required field`
  })
});
/**
 * Salary
 */
const joiAddSalarySchema = Joi.object({
  userName: Joi.string().required().messages({
    'any.required': `"userName" is a required field`
  }),
  basicSalary: Joi.number().positive().required().messages({
    'number.positive': `"basicSalary" must be a positive number`,
    'any.required': `"basicSalary" is a required field`
  }),
  allowances: Joi.number().min(0).default(0).messages({
    'number.min': `"allowances" must be greater than or equal to 0`
  }),
  deductions: Joi.number().min(0).default(0).messages({
    'number.min': `"deductions" must be greater than or equal to 0`
  }),
  payDate: Joi.date().required().messages({
    'any.required': `"payDate" is a required field`
  })
});
/**
 * Task
*/
const joiAddTaskSchema = Joi.object({
  userName: Joi.string().required().messages({
    'any.required': `"userName" is a required field`
  }),
  description: Joi.string().min(1).max(500).required().messages({
    'any.required': `"description" is a required field`,
    'string.min': `"description" must have at least 1 character`,
    'string.max': `"description" cannot exceed 500 characters`
  }),
  startDate: Joi.date().required().messages({
    'any.required': `"startDate" is a required field`
  }),
  dueDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'any.required': `"dueDate" is a required field`,
    'date.greater': `"dueDate" must be after "startDate"`
  })
});

const joiUpdateTaskStatusSchema = Joi.object({
  status: Joi.string().valid("Todo", "In progress", "Done").required().messages({
    'any.required': `"status" is a required field`,
    'any.only': `"status" must be one of the following: Todo, In progress, Done`
  })
});
/**
 * Department
 */
const joiInsertDepartmentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be empty`,
    'string.min': `"name" should have a minimum length of 3 characters`,
    'string.max': `"name" should have a maximum length of 50 characters`,
    'any.required': `"name" is a required field`
  }),
  description: Joi.string().allow('').optional().max(255).messages({
    'string.max': `"description" should not exceed 255 characters`
  })
});

const joiUpdateDepartmentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be empty`,
    'string.min': `"name" should have a minimum length of 3 characters`,
    'string.max': `"name" should have a maximum length of 50 characters`,
    'any.required': `"name" is a required field`
  }),
  description: Joi.string().allow('').optional().max(255).messages({
    'string.max': `"description" should not exceed 255 characters`
  })
});

  export {
    joiemployeeSchema,
    joiemployeeUpdateSchema,
    joiAddLeaveSchema,
    joiUpdateLeaveStatusSchema,
    joiAddSalarySchema,
    joiAddTaskSchema,
    joiUpdateTaskStatusSchema,
    joiInsertDepartmentSchema,
    joiUpdateDepartmentSchema,
  }