import React, { useContext, useState, useEffect } from "react";
import { AiFillPayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { Tabs, Alert, Spin, Col, Divider, Row,Button } from "antd";
import { ethers } from "ethers"
import Modal from 'react-modal';
// import NodeRSA from 'node-rsa';

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const style = {
  // background: '#0092ff',
  padding: '8px 0',
  marginLeft: '30px',
  marginRight: '10px',
  fontSize: '20px',
  fontWeight: 'bold'
};




const Welcome = (props) => {

 

  const [ethAmount, setEthAmount] = useState(0);
  const [minTokens, setMinTokens] = useState(0);
  const [tokenAmount, setTokenAmount] = useState('');
  const [minEth, setMinEth] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState('');



  const container = (
    <Alert
      message="Alert message title"
      description="Further details about the context of this alert."
      type="info"
    />
  );
  const Inpput = ({ placeholder, name, type, value, onchange }) => (
    <input placeholder={placeholder} name={name} type={type} step="0.0001" value={value} onChange={onchange} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism" />
  )



  const { userModalView, isLogin, EOAInfo, setEOAInfo, globalUser, userModal } = props;
  console.log("userInfo:", globalUser)

 
  // const globalUser=useContext(loginInfoForUser);
  const handleSumbit = (e) => {
    const { addressTo, amount, keyword, message } = formData;
    e.preventDefault();
    if (!addressTo || !amount || !keyword || !message) return;
    sendTransaction();
  }

  
  function openSwapCheckModal() {
    setConfirmModalIsOpen(true);
  }

  async function ETH_2_WETH() {
    setLoading(true);
    setModalIsOpen(true);
    setModalContent("交易正在发送中");

    const apiKey = 'VCZ4LuOT-6fu55GygaYXqrOXNqtXOFVH';
    const provider = new ethers.providers.AlchemyProvider('goerli', apiKey);

    // 用户的私钥
    const privateKey = '0x62d0ce168d85b9e9917b4a2dbe4f96e519a9b661262a5eee46c263365ce82900';

    const signer = new ethers.Wallet(privateKey, provider);

    const address = signer.address;
    console.log(address)

    const gasPrice = ethers.utils.parseUnits('2', 'gwei'); // 40 Gwei
    const gasLimit = 300000;

    const WETH_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }];
    const WETH_Contract = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", WETH_ABI, signer);
    const currentNonce = await provider.getTransactionCount(address, 'latest');
    try {
      const tx = await WETH_Contract.populateTransaction.deposit(
        {
          value: ethers.utils.parseUnits('0.1', 18),
          nonce: currentNonce,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
        }
      );
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

  const WETH_2_Uni = async () => {

    setLoading(true);
    setModalIsOpen(true);
    setModalContent("交易正在发送中");
    const apiKey = 'VCZ4LuOT-6fu55GygaYXqrOXNqtXOFVH';
    const provider = new ethers.providers.AlchemyProvider('goerli', apiKey);

    console.log(await provider.getBlockNumber());

    // 用户的私钥
    const privateKey = '0x62d0ce168d85b9e9917b4a2dbe4f96e519a9b661262a5eee46c263365ce82900';

    const signer = new ethers.Wallet(privateKey, provider);

    console.log(await signer.getBalance());

    const address = signer.address;

    // uniswapRouter合约
    const uniswapRouterAddress = '0x4648a43B2C14Da09FdF82B161150d3F634f40491';
    const uniswapRouterABI = [{ "inputs": [{ "components": [{ "internalType": "address", "name": "permit2", "type": "address" }, { "internalType": "address", "name": "weth9", "type": "address" }, { "internalType": "address", "name": "seaport", "type": "address" }, { "internalType": "address", "name": "nftxZap", "type": "address" }, { "internalType": "address", "name": "x2y2", "type": "address" }, { "internalType": "address", "name": "foundation", "type": "address" }, { "internalType": "address", "name": "sudoswap", "type": "address" }, { "internalType": "address", "name": "nft20Zap", "type": "address" }, { "internalType": "address", "name": "cryptopunks", "type": "address" }, { "internalType": "address", "name": "looksRare", "type": "address" }, { "internalType": "address", "name": "routerRewardsDistributor", "type": "address" }, { "internalType": "address", "name": "looksRareRewardsDistributor", "type": "address" }, { "internalType": "address", "name": "looksRareToken", "type": "address" }, { "internalType": "address", "name": "v2Factory", "type": "address" }, { "internalType": "address", "name": "v3Factory", "type": "address" }, { "internalType": "bytes32", "name": "pairInitCodeHash", "type": "bytes32" }, { "internalType": "bytes32", "name": "poolInitCodeHash", "type": "bytes32" }], "internalType": "struct RouterParameters", "name": "params", "type": "tuple" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ContractLocked", "type": "error" }, { "inputs": [], "name": "ETHNotAccepted", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "commandIndex", "type": "uint256" }, { "internalType": "bytes", "name": "message", "type": "bytes" }], "name": "ExecutionFailed", "type": "error" }, { "inputs": [], "name": "FromAddressIsNotOwner", "type": "error" }, { "inputs": [], "name": "InsufficientETH", "type": "error" }, { "inputs": [], "name": "InsufficientToken", "type": "error" }, { "inputs": [], "name": "InvalidBips", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "commandType", "type": "uint256" }], "name": "InvalidCommandType", "type": "error" }, { "inputs": [], "name": "InvalidOwnerERC1155", "type": "error" }, { "inputs": [], "name": "InvalidOwnerERC721", "type": "error" }, { "inputs": [], "name": "InvalidPath", "type": "error" }, { "inputs": [], "name": "InvalidReserves", "type": "error" }, { "inputs": [], "name": "LengthMismatch", "type": "error" }, { "inputs": [], "name": "NoSlice", "type": "error" }, { "inputs": [], "name": "SliceOutOfBounds", "type": "error" }, { "inputs": [], "name": "SliceOverflow", "type": "error" }, { "inputs": [], "name": "ToAddressOutOfBounds", "type": "error" }, { "inputs": [], "name": "ToAddressOverflow", "type": "error" }, { "inputs": [], "name": "ToUint24OutOfBounds", "type": "error" }, { "inputs": [], "name": "ToUint24Overflow", "type": "error" }, { "inputs": [], "name": "TransactionDeadlinePassed", "type": "error" }, { "inputs": [], "name": "UnableToClaim", "type": "error" }, { "inputs": [], "name": "UnsafeCast", "type": "error" }, { "inputs": [], "name": "V2InvalidPath", "type": "error" }, { "inputs": [], "name": "V2TooLittleReceived", "type": "error" }, { "inputs": [], "name": "V2TooMuchRequested", "type": "error" }, { "inputs": [], "name": "V3InvalidAmountOut", "type": "error" }, { "inputs": [], "name": "V3InvalidCaller", "type": "error" }, { "inputs": [], "name": "V3InvalidSwap", "type": "error" }, { "inputs": [], "name": "V3TooLittleReceived", "type": "error" }, { "inputs": [], "name": "V3TooMuchRequested", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsSent", "type": "event" }, { "inputs": [{ "internalType": "bytes", "name": "looksRareClaim", "type": "bytes" }], "name": "collectRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "commands", "type": "bytes" }, { "internalType": "bytes[]", "name": "inputs", "type": "bytes[]" }], "name": "execute", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "commands", "type": "bytes" }, { "internalType": "bytes[]", "name": "inputs", "type": "bytes[]" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "execute", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC721Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "int256", "name": "amount0Delta", "type": "int256" }, { "internalType": "int256", "name": "amount1Delta", "type": "int256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "uniswapV3SwapCallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
    const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, signer);
    const gasPrice = ethers.utils.parseUnits('2', 'gwei');
    const gasLimit = 300000;

    try {
      const currentNonce = await provider.getTransactionCount(address, 'latest');


      // Uniswap V3 相关合约地址
      const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // WETH 合约地址
      const tokenOutAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';// Uni 合约地址

      // 构建交易参数
      const params = {
        path: [wethAddress, tokenOutAddress], // 假设要将 ETH 兑换为某个其他代币
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 设置10分钟的交易截止时间
        amountIn: ethers.utils.parseUnits("0.1", 18), // 输入资产数量（以太币）
        amountOutMinimum: 0,
        nonce: currentNonce
      };

      // 构建交易对象
      const tx = await uniswapRouterContract.populateTransaction.exactInput(params);

      // 签名交易
      const signedTx = await signer.signTransaction(tx);

      // 发送交易
      const transaction = await provider.sendTransaction(signedTx);

      console.log('交易哈希:', transaction.hash);

      await transaction.wait();
      setModalContent("发送交易成功!")
    } catch (error) {
      setModalContent("发送交易失败!")
      console.error('交易失败', error);

    } finally {
      setLoading(false);
    }



    //   try {
    //   const amountInWei = ethers.utils.parseUnits(amountIn, 18); // 假设输入的金额是以太币

    //   // 构建交易参数
    //   const path = [fromToken, toToken]; // 假设fromToken和toToken是合约地址
    //   const amountOutMin = 0;
    //   const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 设置10分钟的交易截止时间

    //   // 构建交易对象
    //   const tx = await uniswapRouterContract.populateTransaction.swapExactTokensForTokens(
    //     amountInWei,
    //     amountOutMin,
    //     path,
    //     signer.getAddress(),
    //     deadline
    //   );

    //   // 使用用户私钥进行交易签名
    //   const signedTx = await signer.signTransaction(tx);

    //   // 发送签名后的交易
    //   const sentTx = await provider.sendTransaction(signedTx);

    //   // 等待交易确认
    //   await sentTx.wait();

    //   // 交易成功后的处理
    //   setAmountOut('交易成功');
    // } catch (error) {
    //   console.error('交易失败', error);
    // }
  }

  // EOAInfo: wallet
  async function balanceOf(){
    const apiKey = 'VCZ4LuOT-6fu55GygaYXqrOXNqtXOFVH';
    const provider = new ethers.providers.AlchemyProvider('goerli', apiKey);
    const balance = await provider.getBalance(EOAInfo.wallet.address);
    setEOAInfo((pre)=>({...pre,balance:ethers.utils.formatEther(balance)+'ETH'}));
  }
useEffect(()=>{ 
  if(EOAInfo.wallet!=undefined||EOAInfo.wallet!=null){
    console.log(EOAInfo.wallet.address)
     balanceOf();
  }
},[EOAInfo.wallet])

  async function ERC20_balanceOf(contractAddress){
    const apiKey = 'VCZ4LuOT-6fu55GygaYXqrOXNqtXOFVH';
    const provider = new ethers.providers.AlchemyProvider('goerli', apiKey);
    const abi=[]
    const contract = new ethers.Contract(contractAddress,abi,provider);
    const balance = await contract.balanceOf(EOAInfo);
  }

  const items = [
    {
      key: '1',
      label: <span style={{ fontSize: '14px', color: '#3d4f7c', fontWeight: 'bold' }}>BuyToken</span>,
      children: <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        {/* <input placeholder="Amount(ETH)" name="Amount(ETH)" type="number" value={ethAmount} step="0.0001"   className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"  /> */}
        <Inpput placeholder="Amount(ETH)" name="Amount(ETH)" type="number" value={ethAmount} onChange={e => setEthAmount(e.target.value)} />
        <Inpput placeholder="minAmount(Token)" name="minAmount(Token)" type="number" value={minTokens} />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        <button onClick={openSwapCheckModal}>TEST SEND</button>
        {!isLogin ?
          <Loader /> : (<button type="button" onClick={openSwapCheckModal} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
            Send now
          </button>)}
      </div>,
    },
    {
      key: '2',
      label: <span style={{ fontSize: '14px', color: '#3d4f7c', fontWeight: 'bold' }}>SellToken</span>,
      children: <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <Inpput placeholder="Amount(ETH)" name="Amount(ETH)" type="number" value={ethAmount} />
        <Inpput placeholder="minAmount(Token)" name="minAmount(Token)" type="number" value={minTokens} />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {!isLogin ?
          <Loader /> : (<button type="button" onClick={handleSumbit} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
            Send now
          </button>)}
      </div>,
    },
  ];

  return (

    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br />across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily.

          </p>
          {!isLogin && (
            <button type="button" onClick={() => { userModalView(true) }} className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]">
              <AiFillPayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold w-32"> Login</p>
            </button>
          )}


          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl  ${companyCommonStyles}`}>Uniswap</div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>Ethereum</div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>Web 3.0</div>
            <div className={companyCommonStyles}>Flexible</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>Blockchain</div>
          </div>

        </div>
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {globalUser.username == "" && shortenAddress(globalUser.username)}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>

          <Modal id="confirmModal" isOpen={confirmModalIsOpen} onRequestClose={() => setConfirmModalIsOpen(false)}
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
              <Row gutter={8} >
                <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center',background: '#00a0e9' }}>
                  <div style={style}>{ethAmount}</div>
                  <div style={{fontSize:'20px',fontWeight: 'bold'}}>ETH</div>
                
                </Col>
                <Col span={8} style={{ display: 'flex', alignItems: 'center',background: '#00a0e9' }} offset={8}></Col>
              </Row>
              <Divider orientation="left">你获得</Divider>
              <Row
                gutter={8}
              >
                <Col className="gutter-row" span={8} style={{ display: 'flex', alignItems: 'center',background: '#00a0e9' }}>
                <div style={style}>{ethAmount}</div>
                <div style={{fontSize:'20px',fontWeight: 'bold'}}>UNI</div>

                </Col>
             
              </Row>
            </>
            <div className="pl-10 absolute bottom-5 w-4/5  flex justify-center items-between">
               <Button >确认兑换</Button>
            </div>
            
          </Modal>

          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                height: '300px',
                borderRadius: '10px',
              },
            }}
          >
            {modalContent}
            <div>
              <Spin spinning={loading} delay={500}>
                {container}
              </Spin>
            </div>
          </Modal>

          <Tabs defaultActiveKey="1" size="lg" type="card" items={items}  />

        </div>
      </div>
    </div>
  )
}

export default Welcome;

