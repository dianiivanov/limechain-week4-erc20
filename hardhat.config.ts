import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { int, string } from "hardhat/internal/core/params/argumentTypes";
dotenv.config();
import { BigNumber } from 'bignumber.js';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_SEPOLIA_URL = `${process.env.INFURA_SEPOLIA_URL}${process.env.INFURA_API_KEY}`
const INFURA_GOERLI_URL = `${process.env.INFURA_GOERLI_URL}${process.env.INFURA_API_KEY}`;
const LOCALHOST_URL = process.env.LOCALHOST_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const MAX_UINT256 = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');
const DEFAULT_TOKEN_NAME = "MyToken";
const DEFAULT_TOKEN_SYMBOL = "MTK";
const DEFAULT_TOKEN_INITIAL_SUPPLY = "1000";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: INFURA_SEPOLIA_URL,
      chainId: 11155111,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    goerli: {
      url: INFURA_GOERLI_URL,
      chainId: 5,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    localhost: {
      url: LOCALHOST_URL,
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};

const lazyImport = async (module: any) => {
  return await import(module);
}


function validateForSolidity(initialSupply: string) {
  const result = new BigNumber(initialSupply);
  if (result.isGreaterThan(MAX_UINT256)) {
    throw new Error('Value exceeds maximum uint256');
  }
}

task("deploy-token", "Deploy MyToken.sol")
.addParam("name", "Token name", DEFAULT_TOKEN_NAME, string)
.addParam("symbol", "The second argument", DEFAULT_TOKEN_SYMBOL, string)
.addParam("initialSupply", "The second argument", DEFAULT_TOKEN_INITIAL_SUPPLY, string)
.setAction(async (args, hre) => {
  validateForSolidity(args.initialSupply);
  await hre.run('compile');
  const{ deployBookLibrary } = await lazyImport("./scripts/deploy-mytoken");
  await deployBookLibrary(args.name,args.symbol, args.initialSupply);
});

export default config;
