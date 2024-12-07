export interface Attendance {
  employee_ID: string;

  clock_in_time: Date;
  clock_out_time: Date;

  status: string;
}

export interface Employee {
  userName: string;

  firstName: string;
  lastName: string;

  email: string;
  phoneNumber: string;

  jobTitle: string;
  departmentId: string;

  hireDate: string;

  salary: number;

  adress?: {
    street?: string;
    city?: string;
    zipcode?: string;
    country?: string;
  };

  status?: string;

  clock_in_time?: number;
  clock_out_time?: number;

  clocked_in?: boolean;
  clocked_in_time?: number;
}
