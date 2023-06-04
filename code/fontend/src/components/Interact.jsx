import Modal from 'react-modal'
import React, { useContext, useState, useEffect } from "react";
import { Tabs, Alert, Spin, Col, Divider, Row,Button, message, Space} from "antd";
import {ethers} from 'ethers';
import {tokenAddress} from "../App"

const style = {
  padding: '8px 0',
  marginLeft: '30px',
  marginRight: '10px',
  fontSize: '20px',
  fontWeight: 'bold'
};







const Interact = (props) => {

  const tokens =useContext(tokenAddress);
  const {FromToken, ToToken, EOAInfo,amount,isInteract,setIsInteract} = props;
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState();
  const [confirmModalContent, setConfirmModalContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();


  const getSigner = () => {
    const apiKey = 'VCZ4LuOT-6fu55GygaYXqrOXNqtXOFVH';
    const provider = new ethers.providers.AlchemyProvider('goerli', apiKey);
    const signer = new ethers.Wallet(EOAInfo.wallet.privateKey, provider);
    return signer;

  }

  async function ETH2WETH() {
    const signer = getSigner();

    const address = signer.address;
    console.log(address)

    const gasPrice = ethers.utils.parseUnits('2', 'gwei'); 
    const gasLimit = 300000;

    const WETH_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "draw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }];
    const WETH_Contract = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", WETH_ABI, signer);
    const currentNonce = await provider.getTransactionCount(address, 'latest');
    try {
      let tx = {};
      if(FromToken =="ETH"){
        console.log("ETH2WETH")
         tx = await WETH_Contract.populateTransaction.deposit(
          {
            value: ethers.utils.parseUnits(amount, 18),
            nonce: currentNonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          }
        );
      }else{
        tx = await WETH_Contract.populateTransaction.withdraw (
          ethers.utils.parseUnits(amount, 18),
          {
            nonce: currentNonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          }
        );
      }
      
      const signedTx = await signer.signTransaction(tx);
      const sentTx = await provider.sendTransaction(signedTx);
      console.log(sentTx.hash)
      await sentTx.wait();
      setModalContent("交易发送成功");

    } catch (error) {
      console.error('交易失败', error);
      setModalContent("发送交易失败!")
    } finally {
      setLoading(false);
    }
  }


  
// async function WETH2ETH() {
//   const signer = getSigner();

//     const address = signer.address;
//     console.log(address)

//     const gasPrice = ethers.utils.parseUnits('2', 'gwei'); // 40 Gwei
//     const gasLimit = 300000;

//     const WETH_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }];
//     const WETH_Contract = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", WETH_ABI, signer);
//     const currentNonce = await provider.getTransactionCount(address, 'latest');
//     try {
//       const tx = await WETH_Contract.populateTransaction.withdraw (
//         ethers.utils.parseUnits(amount, 18),
//         {
//           nonce: currentNonce,
//           gasPrice: gasPrice,
//           gasLimit: gasLimit,
//         }
//       );
//       const signedTx = await signer.signTransaction(tx);
//       const sentTx = await provider.sendTransaction(signedTx);
//       console.log(sentTx.hash)
//       await sentTx.wait();
//       setModalContent("交易发送成功");

//     } catch (error) {
//       console.error('交易失败', error);
//       setModalContent("发送交易失败!")
//     } finally {
//       setLoading(false);
//     }
// }

async function ETH2UNI() {

}

async function UNI2ETH() {

}


async function WETH2UNI() {

}

async function UNI2WETH() {
  
 }

async function BalanceOf(){

  
  const signer = getSigner()
  const abi = ERC20_ABI
  const fromContract = new ethers.Contract(tokens[FromToken], abi, signer);
  const toContract = new ethers.Contract(tokens[ToToken], abi, signer);
  try{
     const balance = await  signer.getBalance(EOAInfo.wallet.address);
     setEOAInfo((pre)=>({...pre,balance:ethers.utils.formatEther(balance)+'ETH'}));
     const WETHBalance = ethers.utils.formatEther(await fromContract.balanceOf(EOAInfo.wallet.address));
     setEOAInfo((pre)=>({...pre,WETHbalance:ethers.utils.formatEther(WETHBalance)+'ETH'}));
     const UNIBalance = ethers.utils.formatEther(await toContract.balanceOf(EOAInfo.wallet.address));
     setEOAInfo((pre)=>({...pre,UNIBalance:ethers.utils.formatEther(UNIBalance)+'ETH'}));
    }catch(e){

  }
}

async function quote(){
  return 0;
}

async function swap(){
  checkBalance();
  const pair =  FromToken+ToToken
  if(pair =="ETH_WETH" || pair=="WETH_ETH"){
    ETH2WETH();
  }else if (pair == "UNI_WETH" || pair == "WETH_UNI"){
    UNI2WETH();
  }else if (pair == "UNI_ETH"){
    UNI2ETH();
  }else if(pair == "ETH_UNI"){
    ETH2UNI();
  }
}

function checkBalance(){
  if(1 < amount){
    messageApi.open({
      type: 'error',
      content: '余额不足',
    });
  }
  return ;
}


return (
  
 
  <Modal isOpen={isInteract} onRequestClose={() => setConfirmModalIsOpen(false)}
    style={{
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '600px',
        borderRadius: '10px',
      },
    }}
  >
    <>
      <Divider orientation="left">你支付</Divider>
      <Row gutter={8} style={{background: '#00a0e9'}}>
        <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center'}}>
          <div style={style}>{amount}</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{FromToken}</div>

        </Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'center'}} offset={8}>
        <div style={style}>余额</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{}</div>
        </Col>
      </Row>
      <Divider orientation="left">你获得</Divider>
      <Row gutter={8} style={{background: '#00a0e9'}}>
        <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center'}}>
          <div style={style}>{amount*quote()}</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{ToToken}</div>

        </Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'center'}} offset={8}>
        <div style={style}>余额</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{}</div>
        </Col>
      </Row>
      <Divider orientation="left"></Divider>
    </>
    <div className="pl-10 absolute bottom-5 w-4/5  flex justify-center items-between">
      <Button onClick={swap}>确认兑换</Button>
      {contextHolder}
    </div>

  </Modal>
 
)
}
export default Interact;


