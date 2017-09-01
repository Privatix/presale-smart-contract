import increaseTime from 'zeppelin-solidity/test/helpers/increaseTime';
import moment from 'moment';


var Token = artifacts.require("./Token.sol");
var Presale = artifacts.require("./Presale.sol");


contract('Presale', (accounts) => {
    let owner, wallet, client, token, presale, startTime, endTime;
    let testMaxTokens, testMaxEther, testRate;


    before(async () => {
        owner = web3.eth.accounts[0];
        wallet = web3.eth.accounts[1];
        client = web3.eth.accounts[2];
    });

    beforeEach(async function () {
        startTime = web3.eth.getBlock('latest').timestamp + moment.duration(1, 'week').asSeconds();
        presale = await Presale.new(startTime, wallet);
        token = await Token.at(await presale.token());
        testMaxTokens = await presale.maximumCap();
        testRate = await presale.wei_per_token();
        testMaxEther = testMaxTokens * testRate;
    })
  
    it("Before donate", async () => {
        assert.equal(await presale.balanceOf(client), 0, "Must be 0 on the start");
        assert.equal(await token.totalSupply(), 0, "Must be 0 on the start");
    });

    // it("Check owner", async () => {
    //     assert.equal(await presale.isOwner({'from': owner}), true, "Should be an owner");
    //     assert.equal(await presale.isOwner({'from': client}), false, "Should do not be an owner");
    // });

    it("Start Presale", async() => {
        assert.equal((await presale.hasStarted()), false);
        await increaseTime(moment.duration(1, 'week'));
        assert.equal((await presale.hasStarted()), true);
    });

    it("Forbid transfer", async() => {
        await increaseTime(moment.duration(1, 'week'));
        await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(4)});
        let is_has_error = false;
        try {
            await token.transfer(client, 1e8, {from: client});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }        

        try {
            await token.transferFrom(client, client, 1e8, {from: client});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }        
    });

    it("Do not sell less than token", async() => {
        await increaseTime(moment.duration(1, 'week'));
        let is_has_error = false;

        try {
            await web3.eth.sendTransaction({from: client, to: presale.address, value: (web3.toWei(1)/160) - 1});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }        
    });

    it("Check token balance", async() => {
        let balance;

        await increaseTime(moment.duration(1, 'week'));

        balance = await token.balanceOf(client, {from: client});
        assert.equal(balance, 0, "Token balance should be 0");

        await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(1)});

        balance = await token.balanceOf(client, {from: client});
        assert.equal(balance.toNumber(), 1e18/testRate, `Token balance should be equal to ${1e18/testRate}`);
    });

    it("After donate", async () => {
        await increaseTime(moment.duration(1, 'week'));

        assert.equal((await presale.balanceOf(client)), 0, "Client balance must be 0 on the start");
        assert.equal(await token.totalSupply(), 0, "Total Supply must be 0 on the start");

        await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(0.01)});
        assert.equal(web3.toWei(0.01) / testRate, 16e7, "Should equal");
        assert.equal((await presale.balanceOf(client)).toNumber(), 16e7, "Client balance must be 1 ether / testRate");
        assert.equal((await token.totalSupply()).toNumber(), 16e7, "Total supply must be 1 ether / testRate");
    });

    it("Donate before startTime", async () => {
        let is_has_error = false;
        try {
            await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(4)});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }
    });

    it("Donate before startTime, but great than 30 ether", async () => {
        await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(30)});
        assert.equal((web3.toWei(30) / testRate / 160) * 170, 5100e8, "Should equal");
        assert.equal((await presale.balanceOf(client)).toNumber(), 5100e8, "Client balance must be 30 ether");
        assert.equal((await token.totalSupply()).toNumber(), 5100e8, "Total supply must be 30 ether");
    });

    it("Donate after endTime, but great than 30 ether", async () => {
        await increaseTime(moment.duration(3, 'week'));
        let is_has_error = false;
        try {
            await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(30)});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }
    });

    it("Donate after startTime", async () => {
        await increaseTime(moment.duration(1, 'week'));
        await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(4)});
    });

    it("Donate max ether", async () => {
        let is_has_error = false;

        assert.equal((await presale.hasStarted()), false);

        await increaseTime(moment.duration(1, 'week'));
        assert.equal((await presale.hasStarted()), true);

        assert.equal((await presale.hasEnded()), false);
        await web3.eth.sendTransaction({from: client, to: presale.address, value: testMaxEther});
        assert.equal((await presale.hasEnded()), true);

        try {
            await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(1)});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }
    });

    it("Donate after endTime", async () => {
        await increaseTime(moment.duration(3, 'week'));
        let is_has_error = false;
        try {
            await web3.eth.sendTransaction({from: client, to: presale.address, value: web3.toWei(4)});
        } catch(err) {
            is_has_error = true;
        } finally {
            assert.equal(is_has_error, true, "Should has an error");
        }
        assert.equal((await presale.hasEnded()), true);
    });
});
