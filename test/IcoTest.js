const { expect } = require('chai');

describe('ICOBUNN', function () {
  let ICOBUNN;
  let icoContract;
  let deployer;
  let user1;
  const bunnToken = 0xEca947EfF4A9E4451C7Cf29dadcaBbeDDF73A790;

  beforeEach(async function () {
    // Deploy the ICO contract
    ICOBUNN = await ethers.getContractFactory('ICOBUNN');
    [deployer, user1] = await ethers.getSigners();
    icoContract = await ICOBUNN.deploy(deployer.target, bunnToken); 
    await icoContract.deployed;
  });

  it('Should allow a user to register for the ICOBUNN', async function () {
    // Register user1 for the ICO
    await expect(icoContract.connect(user1).register())
      .to.emit(icoContract, 'Registered')
      .withArgs(user1.address);

    // Check if user1 is registered
    expect(await icoContract.registeredAddresses(user1.address)).to.be.true;
  });

  it('Should not allow registration after ICO ends', async function () {
    // Increase time to simulate ICO end
    await network.provider.send('evm_increaseTime', [86401]); // Move time by 86401 seconds (1 second more than ICO duration)

    // Try to register user1 for the ICO after it ended
    await expect(icoContract.connect(user1).register()).to.be.revertedWith('ICO registration period ended');
  });

  it('Should allow a user to claim tokens after ICO ends', async function () {
    // Register user1 for the ICO
    await icoContract.connect(user1).register();

    // Increase time to simulate ICO end
    await network.provider.send('evm_increaseTime', [86401]); // Move time by 86401 seconds (1 second more than ICO duration)

    // Claim tokens for user1
    await expect(icoContract.connect(user1).claim(user1.address))
      .to.emit(icoContract, 'TokensClaimed')
      .withArgs(user1.address, user1.address);

    // Check if user1 has claimed tokens
    expect(await icoContract.claimedAddresses(user1.address)).to.be.true;
  });

  it('Should not allow a user to claim tokens before ICO ends', async function () {
    // Register user1 for the ICO
    await icoContract.connect(user1).register();

    // Try to claim tokens for user1 before ICO ends
    await expect(icoContract.connect(user1).claim(user1.address)).to.be.revertedWith('ICO has not ended');
  });
});