const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {

  let escrow;
  let customer;
  let driver;

  beforeEach(async function () {

    const accounts = await ethers.getSigners();

    customer = accounts[1];
    driver = accounts[2];

    const Escrow = await ethers.getContractFactory("Escrow");

    escrow = await Escrow.deploy();

    await escrow.deployed();
  });

  it("Should create an escrow order", async function () {

    const payment = ethers.utils.parseEther("1");

    await escrow.connect(customer).createOrder(driver.address, {
      value: payment
    });

    const order = await escrow.orders(1);

    expect(order.customer).to.equal(customer.address);
    expect(order.driver).to.equal(driver.address);
  });

  it("Driver submits delivery proof", async function () {

    const payment = ethers.utils.parseEther("1");

    await escrow.connect(customer).createOrder(driver.address, {
      value: payment
    });

    await escrow.connect(driver).submitDelivery(1, "proof_hash");

    const order = await escrow.orders(1);

    expect(order.proofHash).to.equal("proof_hash");
  });

  it("Customer confirms delivery and payment is released", async function () {

    const payment = ethers.utils.parseEther("1");

    await escrow.connect(customer).createOrder(driver.address, {
      value: payment
    });

    await escrow.connect(driver).submitDelivery(1, "proof_hash");

    const driverBalanceBefore = await ethers.provider.getBalance(driver.address);

    await escrow.connect(customer).confirmDelivery(1);

    const driverBalanceAfter = await ethers.provider.getBalance(driver.address);

    expect(driverBalanceAfter).to.be.gt(driverBalanceBefore);
  });

});