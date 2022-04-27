//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Timelock { 
    //You going to need a person locking up their funds???
    address _owner; 
    uint256 lockTime;


    constructor() { 
        _owner = msg.sender; 
    } 



    //create a mapping for balance
    mapping(address => uint) balances; 
    //creating a mapping for locktime 
    mapping(address => uint256) LOCKTIME; 

    function owner() public view returns (address) { 
        address owner_ = _owner;
        return owner_;
    } 

    //Depost function -> Deposits money into the contract for a period of time; 

    function deposit() external payable { 
      

        balances[msg.sender] += msg.value; 
        if(lockTime < block.timestamp) { 
            lockTime = block.timestamp + 1 days; 
            LOCKTIME[msg.sender] += lockTime;
        }


    }

    //Lets verify that the balance has been updated into contract
    function getBalances() public view returns(uint) { 
        return balances[msg.sender];
    }
    //lets verify the current locktime of the contract
    function getLocktime() public view returns(uint) { 
        return LOCKTIME[msg.sender];
    }

    function withdraw() public { 
        require(balances[msg.sender] > 0, "No Funds Availabe");
        require(block.timestamp > LOCKTIME[msg.sender], "Dude!!! The time hasn't expired yet"); 
        require(msg.sender == _owner, "You are not the owner of the contract!! dude ");

        uint256 amount = balances[msg.sender]; 

        balances[msg.sender] = 0;

        (bool sent,) = msg.sender.call{value: amount}(""); 
        require(sent, "Failed To Send Ether");
        
    }

    function returnThisContract() public view returns(uint) { 
        return address(this).balance;

    }


    receive() external payable{}
    fallback() external payable{}










}



