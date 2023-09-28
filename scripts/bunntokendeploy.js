const hre = require("hardhat");

async function main() {
  const BunnToken = await hre.ethers.getContractFactory("BunnToken");
  const bunnToken = await BunnToken.deploy(100000000, 50);

  await bunnToken.deployed;

  console.log("Bunn Token deployed: ", bunnToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});