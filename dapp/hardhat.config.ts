import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      accounts: {
        count: 20,
        accountsBalance: "100000000000000000000",
      },
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
export default config;