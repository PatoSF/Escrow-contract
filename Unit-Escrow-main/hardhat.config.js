require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/ApqTNbY4WrSVwuemd5oknv-uvbXhBAN1", //API KEY from Alchemy
      accounts: ["d5e3258933e0b440cc225c8a72583c31105b0cffa0c3783d5906054c80c21a3b"] //YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY
    },
  },
};
