require("babel-polyfill");
require('babel-register')({
     // Ignore everything in node_modules except node_modules/zeppelin-solidity. 
    presets: ["es2015"],
    plugins: ["syntax-async-functions","transform-regenerator"],
    ignore: /node_modules\/(?!zeppelin-solidity)/, 
 });

var Token = artifacts.require("./Token.sol");
var Presale = artifacts.require("./Presale.sol");
var moment = require('moment');

module.exports = async function(deployer, network, accounts) {
    web3.eth.getBlock('latest', function(_, block) {
        let startTime = block.timestamp + 120;
        deployer
            .deploy(Presale, _startTime=startTime, _wallet=accounts[0]);
    });
};
