// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimplePay {
    address public admin;

    struct Employee {
        address wallet;
        uint256 basicSalary;
        uint256 allowances;
        uint256 deductions;
        bool exists;
    }

    mapping(address => Employee) public employees;

    event SalaryTransferred(
        address indexed employee,
        uint256 netSalary,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addEmployee(
        address _wallet,
        uint256 _basicSalary,
        uint256 _allowances,
        uint256 _deductions
    ) public onlyAdmin {
        require(!employees[_wallet].exists, "Employee already exists");
        require(_wallet != address(0), "Invalid wallet address");

        employees[_wallet] = Employee({
            wallet: _wallet,
            basicSalary: _basicSalary,
            allowances: _allowances,
            deductions: _deductions,
            exists: true
        });
    }

    function updateEmployeeSalary(
        address _wallet,
        uint256 _basicSalary,
        uint256 _allowances,
        uint256 _deductions
    ) public onlyAdmin {
        require(employees[_wallet].exists, "Employee does not exist");

        employees[_wallet].basicSalary = _basicSalary;
        employees[_wallet].allowances = _allowances;
        employees[_wallet].deductions = _deductions;
    }

    function removeEmployee(address _wallet) public onlyAdmin {
        require(employees[_wallet].exists, "Employee does not exist");
        delete employees[_wallet];
    }

    function transferSalary(address _wallet) public onlyAdmin {
        require(employees[_wallet].exists, "Employee does not exist");
        Employee memory emp = employees[_wallet];

        uint256 netSalary = emp.basicSalary + emp.allowances - emp.deductions;

        require(
            address(this).balance >= netSalary,
            "Insufficient contract balance"
        );

        payable(emp.wallet).transfer(netSalary);

        emit SalaryTransferred(emp.wallet, netSalary, block.timestamp);
    }

    function deposit() public payable onlyAdmin {}

    function withdraw(uint256 _amount) public onlyAdmin {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(admin).transfer(_amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
