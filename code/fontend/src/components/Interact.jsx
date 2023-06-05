
import React, { useContext, useState, useEffect } from "react";
import { Tabs, Alert, Spin, Col, Divider, Row,Button, message,Modal, Space} from "antd";
import {ethers} from 'ethers';
import {Web3Provider, tokenAddress} from "../App"
import {ChainId, Fetcher,Route,Token,TokenAmount,Trade,TradeType,Pair, Router} from "@uniswap/sdk"
import { useCallback } from 'react';
import ABI from "../ABI/baseERC20ABI.json"

const style = {
  padding: '8px 0',
  marginLeft: '30px',
  marginRight: '10px',
  fontSize: '20px',
  fontWeight: 'bold'
};







const Interact = (props) => {
  const web3Interface=useContext(Web3Provider);
  const tokens =useContext(tokenAddress);
  const [isHandle,setIsHandle]=useState(false);
  const {FromToken, ToToken, EOAInfo,amount,isInteract,setIsInteract} = props;
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState();
  const [confirmModalContent, setConfirmModalContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [transaction,setTransaction]=useState({amountOut:"",amountIn:amount,From:FromToken,To:ToToken});

  const [balances,setBalances] = useState({ETH:'',WETH:'',UNI:''});
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
      await sentTx.wait();
      setModalContent("交易发送成功");

    } catch (error) {
      console.error('交易失败', error);
      setModalContent("发送交易失败!")
    } finally {
      setLoading(false);
    }
  }


  
async function ETH2UNI() {

}

async function UNI2ETH() {

}

async function approve(){
  const signer = getSigner();
  const approveContract_ABI = ABI[FromToken];
  const Contract = new ethers.Contract(tokens.get(FromToken), approveContract_ABI, signer);
  const currentNonce = await provider.getTransactionCount(address, 'latest');
  try {
      const tx = await Contract.populateTransaction.approve(
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        ethers.utils.parseUnits(balances[FromToken],18),
      );
  
    const signedTx = await signer.signTransaction(tx);
    const sentTx = await provider.sendTransaction(signedTx);
    await sentTx.wait();
    console.log("授权成功")

  } catch (error) {
    console.error('授权失败', error);
  } 
}


async function WETH2UNI() {
  await approve();

  const signer = getSigner();

  const from = new Token(ChainId.GÖRLI,tokens.get(FromToken), 18);
  const to = new Token(ChainId.GÖRLI, tokens.get(ToToken), 18);
  const pair = await Fetcher.fetchPairData(from, to);
  const router = new Route([pair],from)
  const trade = new Trade(router,new TokenAmount(from,amount),TradeType.EXACT_INPUT);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置20分钟的交易截止时间
  const amountIn = ethers.utils.parseUnits(amount, from.decimals);
  const amountOutMinimum = trade.minimumAmountOut(new Percent('0.1')); // 设置最小兑换量

  // 构建交易对象
  const uniswapRouterAddress = '0x4648a43B2C14Da09FdF82B161150d3F634f40491'; // Uniswap Router 合约地址
  const uniswapRouterAbi = ABI['ROUTER']; // Uniswap Router 合约 ABI
  const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, signer);

  try{ const tx = await uniswapRouterContract.swapExactTokensForTokens(
    amountIn,
    amountOutMinimum,
    [from.address, to.address],
    signer.address,
    deadline,
    { gasLimit: 200000 }
  );
  const signedTx = await signer.signTransaction(tx);
  const sentTx = await provider.sendTransaction(signedTx);
  await sentTx.wait();
    setModalContent("交易发送成功");}catch(e){
    console.log(e)
    setModalContent("发送交易失败!")
  }
 
  

}

async function UNI2WETH() {
  
 }

async function getBalances(){
  console.log("balance",balances)
    
  try{
    if(FromToken == "ETH"){
      console.log("ETH")
      let ETH = await  web3Interface.getBalance(EOAInfo.wallet.address);
      console.log(ETH)
      setBalances((pre)=>({...pre,ETH:ETH}));
    }else if(FromToken == "WETH"){
      
      console.log(FromToken)
      console.log(ABI[FromToken])
      const fromContract = new ethers.Contract(tokens.get(FromToken), ABI[FromToken], web3Interface);
     
      console.log(fromContract)
      let balance = ethers.utils.formatEther(await fromContract.balanceOf(EOAInfo.wallet.address));
      console.log("fromBalance",balance)
      setBalances((pre)=>({...pre,WETH:balance}));
      console.log("balances",balances)
    }else{
      console.log(FromToken)
      console.log(ABI[FromToken])
      const fromContract = new ethers.Contract(tokens.get(FromToken), ABI[FromToken], web3Interface);
      console.log(fromContract)
      let balance = ethers.utils.formatEther(await fromContract.balanceOf(EOAInfo.wallet.address));
      console.log("fromBalance",balance)
      setBalances((pre)=>({...pre,UNI:balance}));
      console.log("balances",balances)
    }

    if(ToToken == "ETH"){
      let ETH = await  web3Interface.getBalance(EOAInfo.wallet.address);
      setBalances((pre)=>({...pre,ETH:ETH}));
      console.log("balance",balances)
    }else if(ToToken == "UNI"){
      console.log(ToToken)
      const toContract = new ethers.Contract(tokens.get(ToToken), ABI[ToToken], web3Interface);
      let balance = ethers.utils.formatEther(await toContract.balanceOf(EOAInfo.wallet.address));
      console.log("toBalnce",balance)
      setBalances((pre)=>({...pre,UNI:balance}));
      console.log("balances",balances)
    }else{
      console.log(ToToken)
      const toContract = new ethers.Contract(tokens.get(ToToken), ABI[ToToken], web3Interface);
      let balance = ethers.utils.formatEther(await toContract.balanceOf(EOAInfo.wallet.address));
      console.log("toBalnce",balance)
      setBalances((pre)=>({...pre,WETH:balance}));
      console.log("balances",balances)
    }
 
    }catch(e){
      
  }
}

async function quote(){
 try{
  const tokenA = new Token(ChainId.GÖRLI, tokens.get(FromToken), 18);
  const tokenB = new Token(ChainId.GÖRLI, tokens.get(ToToken), 18);
  const pair = await Fetcher.fetchPairData(tokenA, tokenB,web3Interface);
  const router = new Route([pair],tokenA);
  const amountIn = new TokenAmount(tokenA, amount);
  const trade = new Trade(router, amountIn, TradeType.EXACT_INPUT);
  
  const amountOutMin = trade.executionPrice.toSignificant(6);
  return Number.parseFloat(amountOutMin)*Number.parseFloat(amount);
 }catch(e){
  console.log(e);
  Modal.error({title:"error",content:'转化出错:给出的amount太少'})
 }
}
useEffect(async()=>{
  
  if (isInteract){
       getBalances();
      let out='计算中...';
      await quote().then((data)=>{
        out=data;
      })
      setTransaction((pre)=>({...pre,amountOut:out}));
  }
},[props.FromToken,props.ToToken])

async function swap(){
  checkBalance();
  const pair =  FromToken+'_'+ToToken;

  if(pair =="ETH_WETH" || pair=="WETH_ETH"){
    ETH2WETH();
  }else if (pair == "UNI_WETH" || pair == "WETH_UNI"){
    WETH2UNI();
  }else if (pair == "UNI_ETH"){
    UNI2ETH();
  }else if(pair == "ETH_UNI"){
    ETH2UNI();
  }
}

function checkBalance(){
  if(balances[FromToken] < amount){
    messageApi.open({
      type: 'error',
      content: '余额不足',
    });
  }
  return ;
}


return (
  
 
  <Modal  style={{
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
  }} onCancel={() => setIsInteract(false)}open={isInteract} title="交易" footer={null}>

    <>
      <Divider orientation="left">你支付</Divider>
      <Row gutter={8} style={{background: '#00a0e9'}}>
        <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center'}}>
          <div style={style}>{amount}</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{FromToken}</div>

        </Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'center'}} offset={8}>
        <div style={style}>余额</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{balances[FromToken]}</div>
        </Col>
      </Row>
      <Divider orientation="left">你获得</Divider>
      <Row gutter={8} style={{background: '#00a0e9'}}>
        <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center'}}>
          <div style={style}>{transaction.amountOut}</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{ToToken}</div>

        </Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'center'}} offset={8}>
        <div style={style}>余额</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{balances[ToToken]}</div>
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


