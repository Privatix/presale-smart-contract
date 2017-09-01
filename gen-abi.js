var abi = require('ethereumjs-abi')

var encoded = abi.rawEncode([ "uint256", "address" ], [ 1505397600, "0x2186c5c738260c4577c849ee5c3de721e9af14d8"]);

console.log(encoded.toString('hex'));