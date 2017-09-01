pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Token.sol';


contract Presale {
    using SafeMath for uint256;

    // Miniml possible cap
    uint256 public minimalCap;

    // Maximum possible cap
    uint256 public maximumCap;

    // Presale token
    Token public token;

    // Early bird ether
    uint256 public early_bird_minimal;

    // Withdraw wallet
    address public wallet;

    // Minimal token buy
    uint256 public minimal_token_sell;

    // Token per ether
    uint256 public wei_per_token;

    // start and end timestamp where investments are allowed (both inclusive)
    uint256 public startTime;
    uint256 public endTime;


    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function Presale(uint256 _startTime, address _wallet) {
        require(_startTime >=  now);
        require(_wallet != 0x0);

        token = new Token();
        wallet = _wallet;
        startTime = _startTime;
        minimal_token_sell = 1e10;
        endTime = _startTime + 86400 * 7;
        wei_per_token = 62500000;  // 1e10 / 160
        early_bird_minimal = 30e18;
        maximumCap = 1875e18 / wei_per_token;
        minimalCap = 350e18 / wei_per_token;
    }

    /*
     * @dev fallback for processing ether
     */
    function() payable {
        return buyTokens(msg.sender);
    }

    /*
     * @dev calculate amount
     * @return token amount that we should send to our dear investor
     */
    function calcAmount() internal returns (uint256) {
        if (now < startTime && msg.value >= early_bird_minimal) {
            return (msg.value / wei_per_token / 60) * 70;   
        }
        return msg.value / wei_per_token;
    }

    /*
     * @dev sell token and send to contributor address
     * @param contributor address
     */
    function buyTokens(address contributor) payable {
        uint256 amount = calcAmount();

        require(contributor != 0x0) ;
        require(minimal_token_sell < amount);
        require((token.totalSupply() + amount) <= maximumCap);
        require(validPurchase());

        token.mint(contributor, amount);
        TokenPurchase(0x0, contributor, msg.value, amount);
        Transfer(0x0, contributor, amount);
        wallet.transfer(msg.value);
    }

    // @return user balance
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return token.balanceOf(_owner);
    }

    // @return true if the transaction can buy tokens
    function validPurchase() internal constant returns (bool) {
        bool withinPeriod = ((now >= startTime  || msg.value >= early_bird_minimal) && now <= endTime);
        bool nonZeroPurchase = msg.value != 0;

        return withinPeriod && nonZeroPurchase;
    }

    // @return true if crowdsale event has ended
    function hasStarted() public constant returns (bool) {
        return now >= startTime;
    }

    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        return now > endTime || token.totalSupply() == maximumCap;
    }

}Ч
