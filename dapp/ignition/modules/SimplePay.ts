import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const SimplePayModule = buildModule("SimplePayModule", (m) => {
  const simplePay = m.contract("SimplePay");
  return { simplePay };
});
export default SimplePayModule;