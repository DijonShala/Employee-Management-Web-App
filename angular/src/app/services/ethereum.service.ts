import { Injectable, NgZone } from "@angular/core";
import { BrowserProvider, Contract, ethers } from "ethers";
import { environment } from "../../environments/environment";
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
  constructor(private readonly ngZone: NgZone) {
    this.listenToEvents();
  }
  public listenToEvents() {
    ["chainChanged", "accountsChanged"].forEach((event) => {
      window.ethereum.on(event, () => {
        this.ngZone.run(() => this.connectToBC());
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
      }
    } catch (error: any) {
      this.errorMessage = error.reason || error.message;
    } finally {
      if (this.errorMessage) console.log(this.errorMessage);
    }
  }

  public async getBalance() {
    if (!this.contract) return 0;
    return await this.contract["getBalance"]();
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
    await this.contract["addEmployee"](
      wallet,
      basicSalary,
      allowances,
      deductions
    );
    return;
  }

  public async getEmployees() {
    if (!this.contract) return;
    return await this.contract["getEmployeeDetails"]();
  }
}
