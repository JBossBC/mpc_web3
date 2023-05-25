import React,{ useState,useEffect } from 'react'
import {Modal} from "antd";
import './App.css'
import { Navbar,Welcome,Footer,Services,Transactions,Login,Register} from './components'
import axios from "axios";
import {generateRSAKeyPair,encryptWithRSA,decryptWithRSA} from "./utils/RSAUtil";
const config = {
  endpoint: "https://bj.bcebos.com",         //传入Bucket所在区域域名
  credentials: {
      ak: "ALTAKN6Qw7M8cTDLSl5GYc94f6",         //您的AccessKey
      sk: "55daa3fb37d84ada9fc22d34e734762c"       //您的SecretAccessKey
  }
};
export const BosConfig=React.createContext();
  //the backend url
  let baseURL="http://112.124.53.234:8399/did";
  //the server public key
let serverPK = "";
export   const BackendURL=React.createContext(baseURL);
export const ServerPK=React.createContext(serverPK);
// ------------component------------------
const App=()=>{
  function init(){
    //初始化服务器公钥
    axios.get(baseURL+"/getPK").then((response)=>{
      let data=response.data;
      if (data.result!=true){
        Modal.error({title:"error",content:data.message});
        return;
      }
      serverPK=data.data;
    })
  }
  init();
  const [registerView,setRegisterView]=useState(false);
  const [EOAInfo,setEOAInfo] = useState({privateKey:"",wallet:null});
  const [loginView,setLoginView]=useState(false);
  const [userInfo,setUserInfo]=useState({username:"",password:"",publicKey:"",privatekey:"",address:"",secretFragment:""});
  const [isLogin,setIsLogin]=useState(false);
  useEffect(()=>{
    if(loginView){
// 生成 2048 位的 RSA 密钥对
async function createRSA(){
  const keyPair=generateRSAKeyPair();
  let privateKey=await window.crypto.subtle.exportKey("pkcs8",  (await keyPair).privateKey)
  let publicKey=await window.crypto.subtle.exportKey("spki", (await keyPair).publicKey)
  
      setUserInfo((pre)=>({...pre,privateKey:pemFromBinary(privateKey, 'PRIVATE KEY'),publicKey:pemFromBinary(publicKey, 'PUBLIC KEY')}));
    }
   createRSA();
   return null; 
  }
  },[loginView])
  useEffect(()=>{
     if (registerView&&(loginView|registerView)){
         setLoginView(false);
     }
  },[registerView])
  // 将导出的二进制数据转换为 PEM 格式
function pemFromBinary(binaryData, label) {
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(binaryData)));
  const base64Pem = base64Data.replace(/(.{64})/g, '$1\n');
  return `-----BEGIN ${label}-----\n${base64Pem}-----END ${label}-----\n`;
}

  return (
   <div className='min-h-screen'>
       <BosConfig.Provider value={{config:config,bucket:"did-blockchain"}}>
        <BackendURL.Provider>
        <ServerPK.Provider>
    <div className='gradient-bg-welcome'>
      <Navbar />
      <Welcome isLogin={isLogin} userModalView={setLoginView} userModal={loginView} EOAInfo={EOAInfo} setEOAInfo={setEOAInfo} globalUser={userInfo}  />
    </div>
    <Services />
    <Transactions />
    <Footer />
    {loginView?<Login setEOAInfo={setEOAInfo} EOAInfo={EOAInfo}  loginView={loginView} setIsLogin={setIsLogin} setLoginView={setLoginView} userInfo={userInfo} setUserInfo={setUserInfo} setRegisterView={setRegisterView}></Login>:<></>} 
    {registerView?<Register setEOAInfo={setEOAInfo} EOAInfo={EOAInfo} registerView={registerView} setRegisterView={setRegisterView} userInfo={userInfo} setUserInfo={setUserInfo} setIsLogin={setIsLogin}></Register>:<></>}
    </ServerPK.Provider>
    </BackendURL.Provider>
    </BosConfig.Provider>
   </div>
  )
}

export default App
