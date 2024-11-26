import Employee from "./employee.js";
import mongoose from "mongoose";

const addAddmin = () => {
  Employee.findOne({ email: "admin@test.com" })
    .then((existingEmployee) => {
      if (!existingEmployee) {
        const adminEmployee = new Employee({
          userName: "admin",
          firstName: "Admin",
          lastName: "User",
          email: "admin@test.com",
          phoneNumber: "123456789",
          jobTitle: "Administrator",
          departmentId: new mongoose.Types.ObjectId(),
          hireDate: new Date(),
          salary: 100000,
          status: "active",
          address: {
            street: null,
            city: null,
            zipCode: null,
            country: null,
          },
        });

        return adminEmployee.save();
      } else {
        console.log("Admin employee already exists.");
      }
    })
    .then(() => {
      console.log("Admin employee setup complete.");
    })
    .catch((error) => {
      console.error("Error setting up admin employee:", error);
    });
};

export default {
  addAddmin,
};
