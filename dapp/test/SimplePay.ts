import hre from "hardhat";
import { expect } from "chai";

describe("SimplePay", () => {
  let simplePayInstance: any;
  let admin: any;
  let nonAdmin: any;
  let employee: any;

  beforeEach(async () => {
    [admin, nonAdmin, employee] = await hre.ethers.getSigners();
    simplePayInstance = await hre.ethers.deployContract("SimplePay");
  });

  describe("addEmployeeWallet", () => {
    it("should add an employee successfully by admin", async () => {
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        5000,
        1000,
        500
      );
      const emp = await simplePayInstance.employees(employee.address);
      expect(emp.exists).to.be.true;
      expect(emp.basicSalary).to.equal(5000);
      expect(emp.allowances).to.equal(1000);
      expect(emp.deductions).to.equal(500);
    });

    it("should fail to add an employee by non-admin", async () => {
      await expect(
        simplePayInstance.connect(nonAdmin).addEmployeeWallet(
          employee.address,
          5000,
          1000,
          500
        )
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("should update an already existing employee", async () => {
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        5000,
        1000,
        500
      );
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        6000,
        1200,
        800
      );
      const emp = await simplePayInstance.employees(employee.address);
      expect(emp.basicSalary).to.equal(6000);
      expect(emp.allowances).to.equal(1200);
      expect(emp.deductions).to.equal(800);
    });
  });

  describe("updateEmployeeSalary", () => {
    it("should update an employee's salary successfully", async () => {
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        5000,
        1000,
        500
      );
      await simplePayInstance.connect(admin).updateEmployeeSalary(
        employee.address,
        6000,
        1200,
        800
      );
      const emp = await simplePayInstance.employees(employee.address);
      expect(emp.basicSalary).to.equal(6000);
      expect(emp.allowances).to.equal(1200);
      expect(emp.deductions).to.equal(800);
    });

    it("should fail to update salary for a non-existing employee", async () => {
      await expect(
        simplePayInstance.connect(admin).updateEmployeeSalary(
          employee.address,
          6000,
          1200,
          800
        )
      ).to.be.revertedWith("Employee does not exist");
    });
  });

  describe("removeEmployee", () => {
    it("should remove an employee successfully", async () => {
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        5000,
        1000,
        500
      );
      await simplePayInstance.connect(admin).removeEmployee(employee.address);
      const emp = await simplePayInstance.employees(employee.address);
      expect(emp.exists).to.be.false;
    });

    it("should fail to remove a non-existing employee", async () => {
      await expect(
        simplePayInstance.connect(admin).removeEmployee(employee.address)
      ).to.be.revertedWith("Employee does not exist");
    });
  });

  describe("transferSalary", () => {
    beforeEach(async () => {
      await simplePayInstance.connect(admin).addEmployeeWallet(
        employee.address,
        5000,
        1000,
        500
      );
      await simplePayInstance
        .connect(admin)
        .deposit({ value: hre.ethers.parseEther("10") });
    });

    it("should transfer salary successfully", async () => {
      const initialBalance = await hre.ethers.provider.getBalance(employee.address);
      await simplePayInstance.connect(admin).transferSalary(employee.address);
      const finalBalance = await hre.ethers.provider.getBalance(employee.address);
      const netSalary = BigInt(5000 + 1000 - 500) * 300n / 1000000n * BigInt(1e18);
      expect(finalBalance - initialBalance).to.equal(netSalary);
    });

    it("should fail to transfer salary if contract balance is insufficient", async () => {
      await simplePayInstance
        .connect(admin)
        .withdraw(hre.ethers.parseEther("10"));
      await expect(
        simplePayInstance.connect(admin).transferSalary(employee.address)
      ).to.be.revertedWith("Insufficient contract balance.");
    });

    it("should fail to transfer salary to a non-existing employee", async () => {
      const newEmployee = hre.ethers.Wallet.createRandom();
      await expect(
        simplePayInstance.connect(admin).transferSalary(newEmployee.address)
      ).to.be.revertedWith("Employee does not exist");
    });
  });

  describe("deposit and withdraw", () => {
    it("should allow admin to deposit funds", async () => {
      await simplePayInstance
        .connect(admin)
        .deposit({ value: hre.ethers.parseEther("1") });
      const balance = await simplePayInstance.getBalance();
      expect(balance).to.equal(hre.ethers.parseEther("1"));
    });

    it("should allow admin to withdraw funds", async () => {
      await simplePayInstance
        .connect(admin)
        .deposit({ value: hre.ethers.parseEther("1") });
      await simplePayInstance.connect(admin).withdraw(hre.ethers.parseEther("0.5"));
      const balance = await simplePayInstance.getBalance();
      expect(balance).to.equal(hre.ethers.parseEther("0.5"));
    });

    it("should fail to withdraw more than the contract balance", async () => {
      await expect(
        simplePayInstance.connect(admin).withdraw(hre.ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient balance");
    });

    it("should fail to deposit or withdraw funds by non-admin", async () => {
      await expect(
        simplePayInstance.connect(nonAdmin).deposit({ value: hre.ethers.parseEther("1") })
      ).to.be.revertedWith("Only admin can perform this action");

      await expect(
        simplePayInstance.connect(nonAdmin).withdraw(hre.ethers.parseEther("1"))
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });
});
