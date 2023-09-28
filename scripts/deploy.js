const { ethers } = require('hardhat');
// const bunnToken=0xEca947EfF4A9E4451C7Cf29dadcaBbeDDF73A790;

async function main() {
  // Getting the address of the Deployer
  const [deployer] = await ethers.getSigners();

  console.log('Deploying ICOBUNN contracts with the account:', deployer.address);

  // Deploying my ICO contract
  const ICOBUNN = await ethers.getContractFactory('ICOBUNN');
  const icoContract = await ICOBUNN.deploy(deployer, '0xEca947EfF4A9E4451C7Cf29dadcaBbeDDF73A790'); 

  await icoContract.deployed;

  console.log('ICOBUNN Contract deployed to:', icoContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
