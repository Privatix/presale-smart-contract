pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';


contract Token is MintableToken {

    string public constant name = 'Privatix Presale';
    string public constant symbol = 'PRIXY';
    uint256 public constant decimals = 8;

    function transferFrom(address from, address to, uint256 value) returns (bool) {
        revert();
    }

    function transfer(address _to, uint256 _value) returns (bool) {
        revert();
    }

}
