require("babel-polyfill");
require('babel-register')({
     // Ignore everything in node_modules except node_modules/zeppelin-solidity. 
     presets: ["es2015"],
     plugins: ["syntax-async-functions","transform-regenerator"],
     ignore: /node_modules\/(?!zeppelin-solidity)/, 
 });


var provider;
var HDWalletProvider = require('truffle-hdwallet-provider');
var private = '[REDACTED]';

if (!process.env.SOLIDITY_COVERAGE){
    // provider = new HDWalletProvider(private, 'https://rinkeby.infura.io')
    provider = new HDWalletProvider(private, 'https://ropsten.infura.io')
}


module.exports = {
    deploy: [
        "Presale"
    ],
    networks: {
        local: {
            host: 'localhost',
            port: 8545,
            network_id: '*'
        },
        local_geth: {
            host: 'localhost',
            port: 8545,
            network_id: 15
        },

        testnet: {
            provider: provider,
            // gasPrice: 200 * 10**8,
            network_id: 2 // official id of the ropsten network
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,         // <-- If you change this, also set the port option in .solcover.js.   
            gas: 0xfffffffffff, // <-- Use this high gas value  
            gasPrice: 0x01      // <-- Use this low gas price 
        },
    },
    build: "webpack"
};
