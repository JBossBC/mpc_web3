
import React, { useContext, useState, useEffect } from "react";
import { Tabs, Alert, Spin, Col, Divider, Row, Button, message, Modal, Space } from "antd";
import { ethers } from 'ethers';
import { Web3Provider, tokenAddress } from "../App"
import { ChainId, Fetcher, Route, Token, TokenAmount, Trade, TradeType, Pair, Router,Percent } from "@uniswap/sdk"
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
  const web3Interface = useContext(Web3Provider);
  const tokens = useContext(tokenAddress);
  const [isHandle, setIsHandle] = useState(false);
  const { FromToken, ToToken, EOAInfo, amount, isInteract, setIsInteract } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [transaction, setTransaction] = useState({ amountOut: "", amountIn: amount, From: FromToken, To: ToToken });
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({ ETH: '', WETH: '', UNI: '' });
  const getSigner = () => {
    const provider = web3Interface;
    const signer = new ethers.Wallet(EOAInfo.wallet.privateKey, provider);
    return signer;
  }

  async function ETH2WETH() {
    const signer = getSigner();

    const address = signer.address;
    console.log(address)

    const gasPrice = ethers.utils.parseUnits('2', 'gwei');
    console.log(gasPrice)
    const gasLimit = 300000;

    const WETH_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "draw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }];
    const WETH_Contract = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", WETH_ABI, signer);
    try {
      const currentNonce = await web3Interface.getTransactionCount(EOAInfo.wallet.address, 'latest');
      let tx = {};
      if (FromToken == "ETH") {
        console.log("ETH2WETH")
        tx = await WETH_Contract.populateTransaction.deposit(
          {
            value: ethers.utils.parseUnits(amount, 18),
            nonce: currentNonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          }
        );
      } else {
        tx = await WETH_Contract.populateTransaction.withdraw(
          ethers.utils.parseUnits(amount, 18),
          {
            nonce: currentNonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          }
        );
      }

      const signedTx = await signer.signTransaction(tx);
      const sentTx = await web3Interface.sendTransaction(signedTx);
      await sentTx.wait();
      Modal.success({ title: "success", content: "交易发送成功" });

    } catch (error) {
      console.error('交易失败', error);
      Modal.error({ title: "error", content: "交易失败" });
    }
  }

  async function approve() {
    const gasLimit = '300000';
    const gasPrice = await web3Interface.getGasPrice();
    // const gasPrice = ethers.utils.parseUnits('2', 'gwei'); 
    console.log("gasPricestr:",gasPrice.toString())
    console.log("gasPriceNum:",gasPrice.toNumber())
    console.log("gasPrice:",gasPrice.toBigInt)

    const signer = getSigner();
    const approveContract_ABI = ABI[FromToken];
    const Contract = new ethers.Contract(tokens.get(FromToken), approveContract_ABI, signer);

    try {
      const currentNonce = await web3Interface.getTransactionCount(EOAInfo.wallet.address, 'latest');
      const tx = await Contract.populateTransaction.approve(
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        ethers.utils.parseUnits(balances[FromToken], 18),
        {
          gasLimit: gasLimit,
          gasPrice: gasPrice.toNumber(),
          nonce: currentNonce
        }
      );

      const signedTx = await signer.signTransaction(tx);
      const sentTx = await web3Interface.sendTransaction(signedTx);
      await sentTx.wait();

    } catch (error) {
      console.error('授权失败', error);
      Modal.error({ title: "error", content: "授权失败" });
    }
  }

  async function ETH2Token() {
    const gasLimit = '300000';
    const gasPrice = await web3Interface.getGasPrice();
    const signer = getSigner();

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置20分钟的交易截止时间
    const amountOutMinimum = 0;
        // 创建路由合约对象
    const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap Router 合约地址
    const uniswapRouterAbi = ABI['ROUTER']; // Uniswap Router 合约 ABI
    const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, signer);
    let path =[]
    if(ToToken == "WETH"){
      path = [tokens.get(ToToken)];
    }else{
      path = [tokens.get("WETH"),tokens.get(ToToken)];
    }
    try {
      const currentNonce = await web3Interface.getTransactionCount(EOAInfo.wallet.address,'latest');
      const tx = await uniswapRouterContract.swapExactETHForTokens(
        amountOutMinimum,
        path,
        signer.address,
        deadline,
        {
          value: ethers.utils.parseUnits(amount, 18),
          gasLimit: gasLimit,
          gasPrice: 5000001210,
          nonce: currentNonce
        }
      );
      const signedTx = await signer.signTransaction(tx);
      const sentTx = await web3Interface.sendTransaction(signedTx);
      console.log("hash:",sentTx.hash)
      await sentTx.wait();
      Modal.success({ title: "success", content: "交易发送成功" });

    } catch (error) {
      console.error('交易失败', error);
      Modal.error({ title: "error", content: "交易失败" });
    }
  }
  async function Token2ETH() {
    await approve();
    const gasLimit = '300000';
    const gasPrice = await web3Interface.getGasPrice();

    const signer = getSigner();

    const amountIn = ethers.utils.parseUnits(amount, 18);
    const amountOutMinimum = 0;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置20分钟的交易截止时间
  
    // 创建路由合约对象
    const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap Router 合约地址
    const uniswapRouterAbi = ABI['ROUTER']; // Uniswap Router 合约 ABI
    const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, signer);

    try {
      const currentNonce = await web3Interface.getTransactionCount(EOAInfo.wallet.address, 'latest');
      const tx = await uniswapRouterContract.swapExactTokensForETH(
        amountIn,
        amountOutMinimum,
        [tokens.get(FromToken), tokens.get("WETH")],
        signer.address,
        deadline,
        { 
          gasLimit: gasLimit,
          gasPrice: gasPrice,
          nonce: currentNonce }
      );
      const signedTx = await signer.signTransaction(tx);
      const sentTx = await web3Interface.sendTransaction(signedTx);
      await sentTx.wait();
      Modal.success({ title: "success", content: "交易发送成功" });

    } catch (error) {
      console.error('交易失败', error);
      Modal.error({ title: "error", content: "交易失败" });
    }
  }

  async function Token2Token() {
    await approve();
    const gasLimit = '300000';
    const gasPrice = await web3Interface.getGasPrice();
    const signer = getSigner();

    const amountIn = ethers.utils.parseUnits(amount, 18);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置20分钟的交易截止时间
    const amountOutMinimum = 0;
    // 创建路由合约对象
    const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap Router 合约地址
    const uniswapRouterAbi = ABI['ROUTER']; // Uniswap Router 合约 ABI
    const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, signer);

    try {
      const currentNonce = await web3Interface.getTransactionCount(EOAInfo.wallet.address, 'latest');
      //创建交易
      const tx = await uniswapRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutMinimum,
        [tokens.get(FromToken), tokens.get(ToToken)],
        signer.address,
        deadline,
        { 
          gasLimit: gasLimit,
          gasPrice: gasPrice,
          nonce: currentNonce
         }
      );
      const signedTx = await signer.signTransaction(tx);
      const sentTx = await web3Interface.sendTransaction(signedTx);
      console.log("sentTXHash:",sentTx.hash)
      Modal.success({ title: "success", content: "交易发送成功" });
    } catch (error) {
      console.error('交易失败', error);
      Modal.error({ title: "error", content: "交易失败" });
    }
  }

  async function getBalances() {
    console.log("balance", balances)

    try {
      if (FromToken == "ETH") {
        let ETH = ""
        await web3Interface.getBalance(EOAInfo.wallet.address).then(data => { ETH = Number.parseFloat(ethers.utils.formatEther(data)).toFixed(6)});
        console.log(ETH)
        setBalances((pre) => ({ ...pre, ETH: ETH }));
      } else if (FromToken == "WETH") {

        console.log(FromToken)
        console.log(ABI[FromToken])
        const fromContract = new ethers.Contract(tokens.get(FromToken), ABI[FromToken], web3Interface);

        console.log(fromContract)
        let balance = ethers.utils.formatEther(await fromContract.balanceOf(EOAInfo.wallet.address));
        console.log("fromBalance", balance)
        setBalances((pre) => ({ ...pre, WETH: Number.parseFloat(balance).toFixed(6) }));
        console.log("balances", balances)
      } else {
        console.log(FromToken)
        console.log(ABI[FromToken])
        const fromContract = new ethers.Contract(tokens.get(FromToken), ABI[FromToken], web3Interface);
        console.log(fromContract)
        let balance = ethers.utils.formatEther(await fromContract.balanceOf(EOAInfo.wallet.address));
        console.log("fromBalance", balance)
        setBalances((pre) => ({ ...pre, UNI: Number.parseFloat(balance).toFixed(6) }));
        console.log("balances", balances)
      }

      if (ToToken == "ETH") {
        let ETH = ""
        await web3Interface.getBalance(EOAInfo.wallet.address).then(data => { ETH = ethers.utils.formatEther(data) });
        setBalances((pre) => ({ ...pre, ETH: ETH }));
        console.log("balance", balances);
      } else if (ToToken == "UNI") {
        console.log(ToToken)
        const toContract = new ethers.Contract(tokens.get(ToToken), ABI[ToToken], web3Interface);
        let balance = ethers.utils.formatEther(await toContract.balanceOf(EOAInfo.wallet.address));
        console.log("toBalnce", balance)
        setBalances((pre) => ({ ...pre, UNI: balance }));
        console.log("balances", balances)
      } else {
        console.log(ToToken)
        const toContract = new ethers.Contract(tokens.get(ToToken), ABI[ToToken], web3Interface);
        let balance = ethers.utils.formatEther(await toContract.balanceOf(EOAInfo.wallet.address));
        console.log("toBalnce", balance)
        setBalances((pre) => ({ ...pre, WETH: balance }));
        console.log("balances", balances)
      }

    } catch (e) {

    }
  }

  async function getRate(from, to) {
    if (FromToken == 'ETH' || ToToken == 'ETH') {
      let endless = FromToken == 'ETH' ? ToToken : FromToken;
      if (endless == 'WETH' || endless == 'ETH') {
        return 1*amount;
      } else {
        if (FromToken == 'ETH') {
          return quote('WETH', endless);
        } else {
          return quote(endless, 'WETH');
        }
      }
    } else {
      return quote(FromToken, ToToken);
    }

  }

  async function quote(from, to) {
    try {
      const tokenA = new Token(ChainId.GÖRLI, tokens.get(from), 18);
      const tokenB = new Token(ChainId.GÖRLI, tokens.get(to), 18);
      const pair = await Fetcher.fetchPairData(tokenA, tokenB, web3Interface);
      const router = new Route([pair], tokenA);
      const amountIn = new TokenAmount(tokenA, BigInt(amount * (10 ** 18)));
      const trade = new Trade(router, amountIn, TradeType.EXACT_INPUT);
      console.log("amountIN", amountIn)
      const amountOutMin = trade.executionPrice.toSignificant(6);
      return Number.parseFloat(amountOutMin) * Number.parseFloat(amount);
    } catch (e) {
      console.log(e);
      Modal.error({ title: "error", content: '兑换比例计算出错' })
    }
  }

  useEffect(async () => {

    if (isInteract) {
      getBalances();
      let out = '计算中...';
      await getRate(FromToken, ToToken).then((data) => {
        out = data;
      })
      setTransaction((pre) => ({ ...pre, amountOut: out }));
    }
  }, [props.FromToken, props.ToToken])

  async function swap() {
    setLoading(true);
    checkBalance();
    if (FromToken == 'ETH') {
      ETH2Token();
    } else if (ToToken == 'ETH') {
      Token2ETH();
    } else {
      Token2Token();
    }

  }

  function checkBalance() {
    if (balances[FromToken] < amount) {
      messageApi.open({
        type: 'error',
        content: '余额不足',
      });
    }
    return;
  }


  return (
    <Modal style={{
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
    }} onCancel={() => setIsInteract(false)} open={isInteract} title="交易" footer={null}>
      <Space direction="vertical"
     style={{
      width: '100%',
    }}>

    
    
      <>
        <Divider orientation="left">你支付</Divider>
        <Row gutter={8} style={{ background: '#00a0e9' }}>
          <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={style}>{amount}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{FromToken}</div>

          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'center' }} offset={5}>
            <div style={style}>余额</div>
            <div  style={{ fontSize: '20px', fontWeight: 'bold' }}>{balances[FromToken].toString()}</div>
          </Col>
        </Row>

        <Spin spinning={loading} tip="Loading" size="large">
        <div className="content" />
      </Spin>
        <Divider orientation="left">你获得</Divider>
        <Row gutter={8} style={{ background: '#00a0e9' }}>
          <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={style}>{transaction.amountOut}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{ToToken}</div>

          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'center' }} offset={5}>
            <div style={style}>余额</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{balances[ToToken]}</div>
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
      </>
      <div className="pl-10 absolute bottom-5 w-4/5  flex justify-center items-between">
        <Button disabled={loading} onClick={swap}>确认兑换</Button>
        {contextHolder}
      </div>
      </Space>
    </Modal>

  )
}
export default Interact;


