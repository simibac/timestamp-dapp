pragma solidity ^0.5.0;

contract TimeStamper{
    
    mapping (address => mapping(string => uint)) timestamps;
    
    function timestamp(string memory hash) public{
        timestamps[msg.sender][hash] = block.timestamp;
    }
    
    function verify(string memory hash) public view returns(uint){
        return timestamps[msg.sender][hash];
    }
    
}