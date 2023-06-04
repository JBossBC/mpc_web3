import React,{useContext, useRef, useState} from "react";
import { AiFillPayCircle } from "react-icons/ai";
import {SiEthereum} from "react-icons/si";
import {BsInfoCircle} from "react-icons/bs";
import {shortenAddress} from "../utils/shortenAddress";
import {Loader,Interact} from ".";
import {Modal,Select,Spin,Input} from "antd";
import { tokenAddress } from "../App";

// import NodeRSA from 'node-rsa';

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";


// const Input =({placeholder,name,type,value,handlechange})=>(
//     <input placeholder={placeholder} type={type} step="0.0001" value={value} onChange={(e)=>handlechange(e,name)} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"  />
// )
const Welcome=(props)=>{
  const tokens =useContext(tokenAddress);
  const tokensName =Array.from(tokens.keys()).map(target=>({label:target,value:target}));
  const {userModalView,isLogin,init,getpk,EOAInfo,setEOAInfo,globalUser,userModal} =props;
  const [sendTransactioning,setSendTransactioning]=useState(false);
  const [isInteract,setIsInteract]=useState(false);
  const [formData,setFormData]=useState({discordToken:"",amount:"",soldToken:"",})
  // const globalUser=useContext(loginInfoForUser);
  const handleSumbit=async (e)=>{
    setSendTransactioning(true);
    const {soldToken,amount,desiredToken}=formData;
    e.preventDefault();
    if(soldToken==""||desiredToken==""||amount<=0){
      Modal.warning({title:"warning",content:"请输入合理的参数"});
      setSendTransactioning(false);
      return;
    }
    setIsInteract(true);
    setSendTransactioning(false);
  }
  return(
    <>
    <div className="flex w-full justify-center items-center">
       <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
         <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
           <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br/>across the world
            </h1> 
           <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily.
           </p>
           {!isLogin&&(
            <button type="button" onClick={()=>{userModalView(true)}} className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]">
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
              {globalUser.username==""&&shortenAddress(globalUser.username)}
            </p>
            <p className="text-white font-semibold text-lg mt-1">
              Ethereum
            </p>
          </div>
         </div>
     </div>
     <Spin spinning={sendTransactioning} tip="Loading">
     <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
      <Select  style={{
        width: 300,
        marginBottom:10
      }}  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"  onChange={(e)=>{setFormData((pre)=>({...pre,soldToken:e}))}}  options={isLogin?tokensName:null}   defaultValue="售出的token类型" />
      <Input  className="m-2 rounded-md p-2 outline-none   border-none text-sm white-glassmorphism"  style={{width:280,marginBottom:10,marginTop:10}} onChange={(e)=>{setFormData((pre)=>({...pre,amount:e.target.value}))}} bordered  placeholder="卖出的数量" name="amount" type="number"  />
      <Select  style={{
        width: 300,
        marginTop:10,
      }}  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"  onChange={(e)=>{setFormData((pre)=>({...pre,discordToken:e}))}} options={isLogin?tokensName:null}  defaultValue="期待的token类型" name="desiredToken" />
      {/* <Input placeholder="Enter Message" name="message" type="text"/> */}
      <div className="h-[1px] w-full bg-gray-400 my-2" />
      {!isLogin?
      <Loader/>:(<button type="button" onClick={handleSumbit} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
        查看详情
      </button>)}
      
     </div>
     </Spin>
    </div>
    </div>
    </div>
    {isInteract?<Interact isInteract={isInteract} setIsInteract={setIsInteract} EOAInfo={EOAInfo} FromToken={formData.soldToken} ToToken={formData.discordToken} amount={formData.amount}/>:<></>}
    </>
  )
}

export default Welcome;