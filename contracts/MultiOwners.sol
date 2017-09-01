pragma solidity ^0.4.11;


contract MultiOwners {
    
    mapping(address => bool) owners;

    function MultiOwners() {
        owners[msg.sender] = true;
    }

    modifier onlyOwner() { 
        require(owners[msg.sender] == true);
        _; 
    }

    function isOwner() constant returns (bool) {
        return owners[msg.sender] ? true : false;
    }

    function checkOwner(address maybe_owner) constant returns (bool) {
        return owners[maybe_owner] ? true : false;
    }


    function grant(address _owner) onlyOwner {
        owners[_owner] = true;
    }

    function revoke(address _owner) onlyOwner {
        require(msg.sender != _owner);
        owners[_owner] = false;
    }
}
