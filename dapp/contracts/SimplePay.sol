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
    address[] public employeeAddresses;

    event EmployeeAdded(
        address indexed employee,
        uint256 basicSalary,
        uint256 allowances,
        uint256 deductions,
        uint256 timestamp
    );

    event SalaryTransferred(
        address indexed employee,
        uint256 netSalary,
        uint256 timestamp
    );

    event ContractFunded(address indexed sender, uint256 amount, uint256 timestamp);

    uint256 public constant WEI_PER_ETHER = 1e18;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function fundContract() external payable {
        require(msg.value > 0, "You must send some Ether");

         emit ContractFunded(msg.sender, msg.value, block.timestamp);
    }

    function addEmployeeWallet(
        address _wallet,
        uint256 _basicSalary,
        uint256 _allowances,
        uint256 _deductions
    ) public onlyAdmin {
        require(_wallet != address(0), "Invalid wallet address");

        if(!employees[_wallet].exists){

        employees[_wallet] = Employee({
            wallet: _wallet,
            basicSalary: _basicSalary,
            allowances: _allowances,
            deductions: _deductions,
            exists: true
        });
        employeeAddresses.push(_wallet);

        emit EmployeeAdded(
                _wallet,
                _basicSalary,
                _allowances,
                _deductions,
                block.timestamp
            );
        }else{
            updateEmployeeSalary(_wallet, _basicSalary, _allowances, _deductions);
        }
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

        uint indexToRemove = findIndex(_wallet);
        employeeAddresses[indexToRemove] = employeeAddresses[employeeAddresses.length - 1];
        employeeAddresses.pop();
    }

    function findIndex(address _wallet) internal view returns (uint) {
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employeeAddresses[i] == _wallet) {
                return i;
            }
        }
        revert("Address not found");
    }

    function transferSalary(address _wallet) public onlyAdmin {
        require(employees[_wallet].exists, "Employee does not exist");
        Employee memory emp = employees[_wallet];

        uint256 netSalary = (emp.basicSalary + emp.allowances - emp.deductions) * 300 / 1000000 * WEI_PER_ETHER;

        require(
            address(this).balance >= netSalary,
            "Insufficient contract balance."
        );

        if (!payable(emp.wallet).send(netSalary)) revert();

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

    function isAdmin() public view returns (bool){
        return msg.sender == admin;
    }

    function getAllEmployees() public view returns (Employee[] memory) {
        uint256 employeeCount = employeeAddresses.length;
        Employee[] memory allEmployees = new Employee[](employeeCount);

        for (uint256 i = 0; i < employeeCount; i++) {
            address employeeWallet = employeeAddresses[i];
            allEmployees[i] = employees[employeeWallet];
        }

        return allEmployees;
    }
}
