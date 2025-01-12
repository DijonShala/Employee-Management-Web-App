import { Injectable, NgZone } from "@angular/core";
import { BrowserProvider, Contract, ethers } from "ethers";
import { environment } from "../../environments/environment";
import Web3 from "web3";
import { Router } from '@angular/router';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Injectable({
  providedIn: "root",
})
export class EthereumService {
  private provider?: BrowserProvider;
  public userAddress?: string;
  private contract?: Contract;
  public errorMessage: string = "";
  private listeningToContractEvents: boolean = false;

  constructor(
    private readonly ngZone: NgZone,
    private router: Router
  ) {
    this.listenToEvents();
  }

  public reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  
  public listenToEvents() {
    ["chainChanged", "accountsChanged"].forEach((event) => {
      window.ethereum.on(event, () => {
        this.ngZone.run(() => this.connectToBC());
      });
    });
  }

  public async listenToContractEvents() {
    if (this.listeningToContractEvents) return;
    else this.listeningToContractEvents = true;

    const startBlockNumber = await this.provider?.getBlockNumber();
    [
      "SalaryTransferred",
      "EmployeeAdded",
      "ContractFunded",
    ].forEach((event) => {
      this.contract?.on(event, (...args) => {
        const e = args[args.length - 1];
        if (startBlockNumber && e.log.blockNumber <= startBlockNumber) return;

        this.ngZone.run(() => this.reloadCurrentRoute())
      });
    });
  }

  public async connectToBC() {
    this.provider = undefined;
    this.userAddress = undefined;
    this.contract = undefined;
    this.errorMessage = "";
    try {
      // Check if MetaMask is installed
      if (window.ethereum == null) {
        throw new Error("Please install MetaMask wallet!");
      } else {
        // Connect to MetaMask
        this.provider = new ethers.BrowserProvider(window.ethereum);
        // Check if connected to the correct network
        let network = await this.provider.getNetwork();
        if (Number(network.chainId) !== environment.allowedChainId) {
          throw new Error(
            `Chain ID is not ${environment.allowedChainId}, please reconnect MetaMask wallet!`
          );
        }
        // Request access to write operations
        let signer = await this.provider.getSigner();
        this.userAddress = await signer.getAddress();
        // Get the contract
        this.contract = new ethers.Contract(
          environment.contractAddress,
          (await (await fetch(environment.contractUrl)).json()).abi,
          signer
        );
        // Check if contract is deployed
        if ((await this.provider.getCode(environment.contractAddress)) == "0x")
          throw new Error("Contract not deployed!");
        this.listenToContractEvents();
      }
    } catch (error: any) {
      this.errorMessage = error.reason || error.message;
    } finally {
      if (this.errorMessage) console.log(this.errorMessage);
    }
  }

  public async getBalance(): Promise<string> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const valueInWei = await this.contract["getBalance"]();
      const valueInEther = Web3.utils.fromWei(valueInWei, "ether");
      //const formattedValue = parseFloat(valueInEther).toFixed(2);

      return valueInEther;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  }

  public async isAdmin() {
    if (!this.contract) return false;
    return await this.contract["isAdmin"]();
  }

  public async addEmployee(
    wallet: string,
    basicSalary: string,
    allowances: string,
    deductions: string
  ) {
    if (!this.contract) return;
    try {
      await this.contract["addEmployeeWallet"](
        wallet,
        basicSalary,
        allowances,
        deductions
      );
      return;
    } catch (error) {
      console.error("Error calling addEmployee:", error);
      return;
    }
  }

  public async getEmployees() {
    if (!this.contract) return;
    return await this.contract["getAllEmployees"]();
  }

  public async transferSalary(wallet: string) {
    if (!this.contract) return;
    try {
      const tx = await this.contract["transferSalary"](wallet);
      await tx.wait(); // Wait for the transaction to be mined
      return true;
    } catch (error: any) {
      console.error(
        "Error transferring salary:",
        error.reason || error.message
      );
      return false;
    }
  }

  public async fundContract() {
    if (!this.contract) return;
    return await this.contract["fundContract"]({
      value: ethers.parseEther("10"),
    });
  }
}
