const {ethers} = require("hardhat"); 


const main = async() => { 

    //get the deployer
     const [deployer] = await ethers.getSigners();

    //get access of our contract
    const TIMELOCK = await ethers.getContractFactory("Timelock");
    //lets deploy our contract
    const timelock = await TIMELOCK.deploy();
    //lets wait for the contract to depoy
    await timelock.deployed()
    console.log("Address of TimeLock wallet Deployed to ", timelock.address);
};


main()
    .then(()=> { 
        process.exit(0)
    }).catch((error) => { 
        console.error(error);
        process.exit(1);
    })

