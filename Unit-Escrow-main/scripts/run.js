const main = async () => {
    const accounts = await hre.ethers.getSigners();
    const escrowx = await hre.ethers.getContractFactory("Escrowx");
    const escrowxcontract = await escrowx.deploy(5, accounts[0].address);
    await escrowxcontract.deployed();
    console.log("Contract deployed by:", accounts[0].address);
    console.log("Contract deployed to:", escrowxcontract.address);



};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
};
runMain();