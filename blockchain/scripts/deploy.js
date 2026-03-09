const hre = require("hardhat");

async function main() {

  const Escrow = await hre.ethers.getContractFactory("Escrow");

  const escrow = await Escrow.deploy();

  await escrow.deployed();

  console.log("Escrow contract deployed to:", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});