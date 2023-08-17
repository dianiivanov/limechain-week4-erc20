import {ethers} from "hardhat";

export async function deployBookLibrary(tokenName: string, tokenSymbol:string, initialSupply:string) {
    const MyTokenFactory = await ethers.getContractFactory("MyToken");
    const mytoken = await MyTokenFactory.deploy(tokenName,tokenSymbol, initialSupply);
    await mytoken.waitForDeployment();

    const tx = await mytoken.deploymentTransaction();
    console.log(`The MyToken contract is deployed to ${mytoken.target}`);
    console.log(`Owner=${tx?.from}, transaction hash: ${tx?.hash}`)
    return tx;
}
