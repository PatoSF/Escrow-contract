const { expect, assert } = require('chai');
//const { ethers } = require('hardhat');
var utils = require('ethers').utils;

describe('Escrowx contract', () => {
    let Escrowx, escrowx, owner, benefactor, benefactee;
    beforeEach(async () => {
        let total;
        Escrowx = await ethers.getContractFactory('Escrowx');
        [owner, benefactor, benefactee, _] = await ethers.getSigners();
        escrowx = await Escrowx.deploy(5, owner.address, { value: hre.ethers.utils.parseEther("1000") });
        //The rate cannot be more than 100
        //escrowx = await Escrowx.deploy(101, owner.address, { value: hre.ethers.utils.parseEther("1000") });
        //The rate cannot be a string
        //escrowx = await Escrowx.deploy("Hello World", owner.address, { value: hre.ethers.utils.parseEther("1000") });
        await escrowx.deployed();
        const contractBalance = await hre.ethers.provider.getBalance(escrowx.address);
        console.log("Escrowx contract address: ", escrowx.address);
        console.log("Escrowx contract balance: ", hre.ethers.utils.formatEther(contractBalance));

        const benefactor_balance = await hre.ethers.provider.getBalance(benefactor.address);
        console.log("Benefactor balance: ", ethers.utils.formatEther(benefactor_balance));
    });


    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            expect(await escrowx.owner()).to.equal(owner.address);
        });
        it('should assign the rate to the owner ', async () => {
            const rate = await escrowx.getRate();
            expect(rate).to.equal(5);
            assert.equal(rate, 5);
        });
        //The owner cannot pass a rate bigger than 100
        // it('should assign the rate to the owner ', async () => {
        //     const rate = await escrowx.getRate();
        //     expect(rate).to.equal(101);
        //     assert.equal(rate, 101);
        // });
    });
    describe('Deposittokens', () => {
        it('Benefactor should deposit tokens to the contract', async () => {
            await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
            const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address);
            console.log("New Escrowx contract balance", ethers.utils.formatEther(contractBalance1));
            const benefactor_balance = await hre.ethers.provider.getBalance(benefactor.address);
            console.log("New Benefactor balance: ", ethers.utils.formatEther(benefactor_balance));
        });
        // it('Benefactor cannot deposit more tokens than he has.', async () => {
        //     const value_sent = await hre.ethers.utils.parseEther("50000");
        //     console.log("Benefactor will send", ethers.utils.formatEther(value_sent));
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: value_sent });
        //     const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance1));
        // });
        // it('Benefactor should no be the benefactee', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactor.address, { value: hre.ethers.utils.parseEther("50") });
        //     const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance1));
        // });
        // it('Benefactor should deposit a string', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: "hi" });
        //     const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance1));
        // });
        // it('Benefactor cannot deposit 0 tokens', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("0")});
        //     const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance1));
        // });
    });
    describe('Sign', () => {
        it('Benefactor and benefactee should sign ', async () => {
            //depositTokens()
            await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
            const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
            console.log(ethers.utils.formatEther(contractBalance2));
            assert.equal(await escrowx.readisactive1(), true, "isactive should be true");
            //sign
            await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
            console.log('Signer1 is', await escrowx.check_escrowbenefactor());
            assert.equal(await escrowx.check_signer(), benefactor.address, "signer is benefactor");
            await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
            console.log('Signer2 is', await escrowx.check_escrowbenefactee());
            assert.equal(await escrowx.check_signer(), benefactee.address, "signer is benefactee");
        });
        // it('Benefactor/Benefactee cannot sign twice', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
        //     const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance2));
        //     await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
        //     console.log('Signer1 is', await escrowx.check_escrowbenefactor());
        //     await escrowx.connect(benefactor).sign(1, { from: benefactee.address });
        //     console.log('Signer2 is', await escrowx.check_escrowbenefactee());
        // });
        // it('Benefactor cannot sign with a value less or bigger than 1', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
        //     const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance2));
        //     await escrowx.connect(benefactor).sign(0, { from: benefactor.address });
        //     console.log('Signer1 is', await escrowx.check_escrowbenefactor());
        //     await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
        //     console.log('Signer2 is', await escrowx.check_escrowbenefactee());
        // });
        // it('Benefactee should sign with the same value of the benefactor ', async () => {
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
        //     const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log(ethers.utils.formatEther(contractBalance2));
        //     await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
        //     console.log('Signer1 is', await escrowx.check_escrowbenefactor());
        //     await escrowx.connect(benefactee).sign(2, { from: benefactee.address });
        //     console.log('Signer2 is', await escrowx.check_escrowbenefactee());
        // });
    });
    describe('ReleaseTokens', () => {
        it('Escrow contract should release tokens to the benefactee ', async () => {
            //deposittokens()
            await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
            let tota = parseFloat(escrowx.returnamount());
            const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
            console.log("New Escrow contract balance ", ethers.utils.formatEther(contractBalance2));
            assert.equal(await escrowx.readisactive1(), true, "isactive should be true");
            //sign()
            await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
            console.log('Signer1 is', await escrowx.check_escrowbenefactor());
            assert.equal(await escrowx.check_signer(), benefactor.address, "signer should be the benefactor");
            await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
            console.log('Signer2 is', await escrowx.check_escrowbenefactee());
            assert.equal(await escrowx.check_signer(), benefactee.address, "signer should be the benefactee");
            //releaseTokens()
            assert.equal(await escrowx.check_isactive_conid(), true, "isactive should be true");
            await escrowx.connect(benefactee).releaseTokens(1, { value: tota });
            assert.equal(await escrowx.check_escrowbenefactee2(), benefactee.address, "the msg.sender is the benefactee");
            assert.equal(await escrowx.check_sign1(), true, "benefactor signed");
            assert.equal(await escrowx.check_sign2(), true, "benefactee signed");
            assert.equal(await escrowx.readisactive2(), false, "isactive should be false");
            const benefactee_balance = await hre.ethers.provider.getBalance(benefactee.address);
            console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance));

        });
    });
    describe('Mediate', () => {
        it('Owner should mediate ', async () => {
            //deposittokens()
            await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
            let tota = parseFloat(escrowx.returnamount());
            const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
            console.log("New Escrow contract balance ", ethers.utils.formatEther(contractBalance2));
            assert.equal(await escrowx.readisactive1(), true, "isactive should be true");
            //sign()
            await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
            console.log('Signer1 is', await escrowx.check_escrowbenefactor());
            assert.equal(await escrowx.check_signer(), benefactor.address, "signer should be the benefactor");
            await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
            console.log('Signer2 is', await escrowx.check_escrowbenefactee());
            assert.equal(await escrowx.check_signer(), benefactee.address, "signer should be the benefactee");
            //mediate()
            const contractBalance = await hre.ethers.provider.getBalance(escrowx.address);
            console.log("Escrowx contract balance: ", hre.ethers.utils.formatEther(contractBalance));
            const benefactee_balance2 = await hre.ethers.provider.getBalance(benefactee.address);
            console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance2));
            await escrowx.connect(owner).mediate(1, 1);
            const benefactee_balance = await hre.ethers.provider.getBalance(benefactee.address);
            console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance));
            const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address)
            console.log("Escrowx contract balance: ", hre.ethers.utils.formatEther(contractBalance1));
        });
        // it('Finished is not 1 ', async () => {
        //     //deposittokens()
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
        //     let tota = parseFloat(escrowx.returnamount());
        //     const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log("New Escrow contract balance ", ethers.utils.formatEther(contractBalance2));
        //     assert.equal(await escrowx.readisactive1(), true, "isactive should be true");
        //     //sign()
        //     await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
        //     console.log('Signer1 is', await escrowx.check_escrowbenefactor());
        //     assert.equal(await escrowx.check_signer(), benefactor.address, "signer should be the benefactor");
        //     await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
        //     console.log('Signer2 is', await escrowx.check_escrowbenefactee());
        //     assert.equal(await escrowx.check_signer(), benefactee.address, "signer should be the benefactee");
        //     //mediate()
        //     const contractBalance = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log("Escrowx contract balance: ", hre.ethers.utils.formatEther(contractBalance));
        //     const benefactee_balance2 = await hre.ethers.provider.getBalance(benefactee.address);
        //     console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance2));
        //     // Conid cannot be other than 1
        //     await escrowx.connect(owner).mediate(1, 2);
        //     const benefactee_balance = await hre.ethers.provider.getBalance(benefactee.address);
        //     console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance));
        //     const contractBalance1 = await hre.ethers.provider.getBalance(escrowx.address)
        //     console.log("Escrowx contract balance: ", hre.ethers.utils.formatEther(contractBalance1));
        // });
        // it('Escrow contract should release tokens to the benefactee ', async () => {
        //     //deposittokens()
        //     await escrowx.connect(benefactor).depositTokens(benefactee.address, { value: hre.ethers.utils.parseEther("50") });
        //     let tota = parseFloat(escrowx.returnamount());
        //     const contractBalance2 = await hre.ethers.provider.getBalance(escrowx.address);
        //     console.log("New Escrow contract balance ", ethers.utils.formatEther(contractBalance2));
        //     assert.equal(await escrowx.readisactive1(), true, "isactive should be true");
        //     //sign()
        //     await escrowx.connect(benefactor).sign(1, { from: benefactor.address });
        //     console.log('Signer1 is', await escrowx.check_escrowbenefactor());
        //     assert.equal(await escrowx.check_signer(), benefactor.address, "signer should be the benefactor");
        //     await escrowx.connect(benefactee).sign(1, { from: benefactee.address });
        //     console.log('Signer2 is', await escrowx.check_escrowbenefactee());
        //     assert.equal(await escrowx.check_signer(), benefactee.address, "signer should be the benefactee");
        //     //mediate
        //     await escrowx.connect(owner).mediate(1, 1);
        //     //releaseTokens()
        //     assert.equal(await escrowx.check_isactive_conid(), true, "isactive should be true");
        //     await escrowx.connect(benefactee).releaseTokens(1, { value: tota });
        //     assert.equal(await escrowx.check_escrowbenefactee2(), benefactee.address, "the msg.sender is the benefactee");
        //     assert.equal(await escrowx.check_sign1(), true, "benefactor signed");
        //     assert.equal(await escrowx.check_sign2(), true, "benefactee signed");
        //     assert.equal(await escrowx.readisactive2(), false, "isactive should be false");
        //     const benefactee_balance = await hre.ethers.provider.getBalance(benefactee.address);
        //     console.log("Benefactee balance: ", ethers.utils.formatEther(benefactee_balance));
        // });
    });
});
