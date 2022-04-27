import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {ethers, Contract, utilis,providers } from 'ethers'
import {useState, useEffect, useRef} from 'react';
import {Web3Provider} from 'web3';
import Web3Modal, { setLocal } from 'web3modal';

//Import contract things 
import { TIME_LOCK_ADDRESS, abi } from '../constants';

export default function Home() {
  //Check if wallet is connect
  const [isConnected, setIsConnected] = useState(false);
  //Lets get address
  const [accountAddress, setAccountAddress] = useState('');
  //check if something is loading 
  const [isLoading, setIsLoading] = useState(false); 
  //Get balance of Contract(not current account balance); 
  const [balance, setBalance] = useState(); 
  //Know the withdraw date 
  const [withDrawDate, setWithDrawDate] = useState(); 
  //Get the deposit amoount,
  const [depositAmount, setDepositAmount] = useState("");
  const web3modal = useRef()

  useEffect(() => { 
     if(!isConnected) { 
       web3modal.current = new Web3Modal( { 
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
       })
       Connect();
       thisContractBalance()
     }


  })


  //GetProvider or Signer 
  const getProviderOrSigner = async(needSigner = false) => {
    //get a hold of provider
    const provider = await web3modal.current.connect();
    const web3provider = new providers.Web3Provider(provider);

    //lets get access of the signer 
    const signer = web3provider.getSigner();
    //lets get hold of the address
    const address = await signer.getAddress(); 
    console.log(accountAddress);
    setAccountAddress(address);

    const {chainId} = await web3provider.getNetwork(); 
    
    if(chainId !==4) { 
      window.alert("YOU ARE ON WRONG NETWORK CRYPTONITES");
    }
  
    if(needSigner) { 
      const signer = web3provider.getSigner();
      return signer;
    }

    return web3provider;

  }



  //Connect to Web3 Interface
  const Connect = async() => { 
    try {
      await getProviderOrSigner();
      setIsConnected(true);

    }catch(err) { 
      console.error(err)
    }

  }

  //lets get the balance of the contract
  const getBalances = async() => { 
    try { 
      const provider = await getProviderOrSigner(); 
      const timeLockContract = new Contract ( 
        //Address ABI and Signer(Provider)
        TIME_LOCK_ADDRESS,
        abi,
        provider
      );
      let bal = await timeLockContract.getBalances(); 
      bal = ethers.utils.formatEther(bal); 
      console.log(`${bal} Uah`)
      setBalance(bal); 
      console.log("Balance is ", bal); 
      return balance;

    }catch(err) { 
      console.error(err);
    }
  };

  const thisContractBalance = async() => {

    try {
          const provider = await getProviderOrSigner();
          const timeLockContract = new Contract ( 
            TIME_LOCK_ADDRESS,
            abi,
            provider
          );
          let tx = await timeLockContract.returnThisContract(); 
          console.log(tx.toString())
    }catch(err) { 
      console.error(err)
    }
  }


  //deposit ze money
  const depoist = async() => { 
    try { 
      const signer = await getProviderOrSigner(true);
      const timeLockContract = new Contract ( 
        //Address ABI and Signer(Provider)
        TIME_LOCK_ADDRESS,
        abi,
        signer
      );
      //we want to call the deposit function
      const tx = await timeLockContract.deposit(); 
      isLoading(true);
      await tx.wait(); 
      setIsLoading(false);
    }catch(err) {
       console.error(err)
    }

  }

 // I want my money back function
 const withdraw = async() =>  {
  try { 
    const signer = await getProviderOrSigner(true);
    const timeLockContract = new Contract ( 
        //Address ABI and Signer(Provider)
        TIME_LOCK_ADDRESS,
        abi,
        signer
      );

      const tx = await timeLockContract.withdraw();
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
  }catch(err) { 
    console.error(err);
  }

 }

//get the lockTime 
const getLockTime = async() => { 
  try { 
    const provider = await getProviderOrSigner();
    const timeLockContract = new Contract( 
      TIME_LOCK_ADDRESS,
      abi,
      provider
    );
      let locktime = await timeLockContract.getLocktime(); 
      setWithDrawDate(locktime.toString());
      locktime = new Date(locktime * 1000);
      console.log("Get LockTime", locktime.toString());
      setWithDrawDate(locktime.toString());

  }catch(err) { 
    console.error(err);
  }

}

const loading = () => { 
  return ( 
    <h1>This may take a few seconds</h1>
  )
}

//RenderThisIfConnected
const renderConnected = () => { 
  if(isConnected) { 
    return(
      <>
        <strong>Wallet Address Connected {accountAddress}</strong>
        <strong>Total Amount Locked UP {balance}</strong>
        <div className = "innerBox">
          <label>
          Deposit:
          <input
            id = "deposit"
            type ="number"
            min ="0.01"
            step = "0.01"
            placeholder='Amount Of Eth'
            onChange={(e) => setDepositAmount(e.target.value || "0")}
          >
          </input>
              <button onClick={depoist}>Depost!!!</button>
          </label>
          <button onClick={withdraw}>withdraw</button>
          <button onClick={getBalances}>Return Balance: {balance}</button>
          <button onClick={getLockTime}>Return The LockTime: {withDrawDate}</button>
        </div>
      </>
    )
  }

}






  return (
   <>
    <div className = "container">
      <div className = "flexBox">
        <h1>Welcome CryptoNites!!!</h1>
          Come Drop Off YOUR CRYPTO
          <Image src = "/ChestImage.jpg" width={100} height = {100}></Image>
          {renderConnected()}
          {isLoading == true ? loading() : null}
      </div>


    </div>
   
   </>
  )
}
