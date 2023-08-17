const { ethers } = require("ethers");
const MyToken = require("./artifacts/contracts/MyToken.sol/MyToken.json");
require("dotenv").config();

const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const PUBLIC_KEY = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const LOCALHOST_URL = process.env.LOCALHOST_URL;

const run = async function (contractAddress) {
  const provider = new ethers.JsonRpcProvider(LOCALHOST_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const myTokenContract = new ethers.Contract(
    contractAddress,
    MyToken.abi,
    wallet
  );
  balanceOf = await myTokenContract.balanceOf(PUBLIC_KEY);
  allowance = await myTokenContract.allowance(PUBLIC_KEY, PUBLIC_KEY);
  console.log("balanceOf:", balanceOf.toString());
  console.log("allowance:", allowance.toString());

  const approveTx = await myTokenContract.approve(PUBLIC_KEY, 99);
  await approveTx.wait();
  allowance = await myTokenContract.allowance(PUBLIC_KEY, PUBLIC_KEY);
  console.log("allowance after approval:", allowance.toString());

  const burnTx = await myTokenContract.burn(5);
  await burnTx.wait();
  balanceOf = await myTokenContract.balanceOf(PUBLIC_KEY);
  console.log("balanceOf after burn 1:", balanceOf.toString());

  setTimeout(async () => {
    const burnTx2 = await myTokenContract.burnFrom(PUBLIC_KEY, 10);
    await burnTx2.wait();
    balanceOf = await myTokenContract.balanceOf(PUBLIC_KEY);
    console.log("balanceOf after burn 2:", balanceOf.toString());
  }, 5000);
};

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log("Usage: node interact <smart contract address>");
  process.exit(1);
}

run(args[0]);
