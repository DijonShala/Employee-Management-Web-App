import Employee from "./employee.js";
import mongoose from "mongoose";

const addAdmin = async () => {
  try {
    const existingEmployee = await Employee.findOne({ email: "admin@test.com" });
    
    if (!existingEmployee) {
      const adminEmployee = new Employee({
        userName: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        phoneNumber: "123456789",
        jobTitle: "Administrator",
        role: "admin",
        departmentId: new mongoose.Types.ObjectId(),
        hireDate: new Date(),
        salary: 100000,
        status: "active",
        address: {
          street: "123 Admin Street",
          city: "Admin City",
          zipCode: "00000",
          country: "Adminland",
        }
      });

      adminEmployee.setPassword("admin123");

      await adminEmployee.save();

      console.log("Admin employee setup complete.");
    } else {
      console.log("Admin employee already exists.");
    }
  } catch (error) {
    console.error("Error setting up the admin employee:", error);
  }
};

export default {
  addAdmin,
};
