import { BosClient } from "@baiducloud/sdk";
import {Wallet, ethers} from "ethers";
import {Modal,Form,Input,Button,Row,Col,Spin} from "antd"
import { useContext, useEffect, useState } from "react";
import {BackendURL, BosConfig} from "../App"
import { encryptMPC } from "../utils/mpcUtil";
import { encryptWithRSA } from "../utils/RSAUtil";
import {generateRandomString} from "../utils/random";
import axios from "axios";
const Register=(props)=>{
   const config= useContext(BosConfig);
   const backendurl=useContext(BackendURL);
   const [init,setInit]=useState(false);
   const [isRegistering,setIsResgistering]=useState(false);
   const [captchaData,setCaptchaData]=useState(null);
   const [newUserInfo,setNewUserInfo]=useState({username:"",password:"",repeatPassword:"",key:"",verifyCode:""}) ;
   const {serverPK,EOAInfo,setEOAInfo,registerView,setRegisterView,userInfo,setUserInfo,setIsLogin} =props 
   let bosClient = new BosClient(config.config);
   async function freshData() {
    setInit(true);
    let newKey=generateRandomString(Math.random()*15);
    await axios.get(backendurl+"/getCode?key="+newKey).then(response=>{
      let data=response.data
      if (!data.result){
        Modal.error({title:"error",content:data.message});
        return;
      }
      setCaptchaData(data.data);
     }).catch(error=>{
      Modal.error({title:"error",content:"系统出错勒"})
     })
     setNewUserInfo((pre)=>({...pre,key:newKey}));
     console.log(newUserInfo.key);
   }
   useEffect(()=>{
    if(!init){
    freshData()
    }
   },[])
  //注册用户
  async function RegisterUser(){
    setIsResgistering(true);
    if(newUserInfo.password!==newUserInfo.repeatPassword){
      Modal.warning({title:"warning",content:"两次输入的密码不一致"});
      setIsResgistering(false);
      freshData();
      return;
    }
    //创建EOA账户
       let result= await createEOA(); 
       if (result)
       {
        setIsResgistering(false);
        return "";
       }
        //创建成功
        setRegisterView(false);
        setIsLogin(true);
        setIsResgistering(false);
  }
   //创建EOA账户
  async function createEOA(){
    try{
    let end=false;
    let privateKey = ethers.Wallet.createRandom().privateKey;
    const wallet=new ethers.Wallet(privateKey);
    // cut the EOA private key
    let [userSF,serverSF,baiduSF]= encryptMPC(BigInt(privateKey));
    console.log(userSF);
    //keep to baiduSF
    //baiduSF 的值预处理
    await bosClient.putObject(config.bucket,newUserInfo.username+"-"+wallet.address,JSON.stringify({x:baiduSF.x.toString(),y:baiduSF.y.toString()})).catch((error)=>{
      console.log(error);
      Modal.error({title:"error",content:"系统出错啦"});
      end=true;
    });
    if(end){
      return end;
    }
    // keep to server
    // 加密数据
// 加密数据
const encryptedData =await encryptWithRSA(serverPK,{x:serverSF.x.toString(),y:serverSF.y.toString()});
    await axios.post(backendurl+"/create",{share:encryptedData,username:newUserInfo.username,alias:wallet.address}).then((response)=>{
      let data=response.data;
      if (data.result!=true){
        Modal.error({title:"error",content:data.message});
        end=true;
        return;
      }
     }).catch((error)=>{
      Modal.error({title:"error",content:"系统出错啦"});
      end=true
     })
     if (end){
      return end;
     }
    await axios.post(backendurl+"/register",{username:newUserInfo.username,password:newUserInfo.password,key:newUserInfo.key,verifyCode:newUserInfo.verifyCode}).then((response)=>{
      let data=response.data;
      if (data.result!=true){
        Modal.error({title:"error",content:"创建账户失败"});
        end=true;
      }
    })
    if(end){
      return end;
    } 
     setEOAInfo({...EOAInfo,privatekey:privateKey,wallet:wallet});
     //change the object to string
     userSF.x=userSF.x.toString();
     userSF.y=userSF.y.toString();
     Modal.success({title:"账户创建成功",
     content:(<div>
      账户地址:<br/>{wallet.address}<br/>
      密钥:<br/>{btoa(JSON.stringify(userSF))}  
     </div>)
    });
     setUserInfo({...userInfo,username:newUserInfo.username,password:newUserInfo.password });
     setIsLogin(true);
     return end;
  }catch(e){
     console.log(e);
     Modal.error({titlt:"error",content:"系统出错啦"});
     setIsResgistering(false);
     setIsLogin(false)
     return true
  }
  }
    return(
        <Modal title="注册"  onCancel={()=>{setRegisterView(false)}}  open={registerView} footer={null}>
          <Spin spinning={isRegistering}>
        <Form 
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          extra="length must greater than six"
          label="Username"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input value={newUserInfo.username}  onChange={(input)=>{setNewUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
        </Form.Item>
        <Form.Item
      label="Password"
      name="password"
      extra="length must greater than six"
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input.Password value={newUserInfo.password} onChange={(input)=>{setNewUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
      label="RepeatPassword"
      name="repeatPassword"
      extra="length must greater than six"
      rules={[{ required: true, message: '请重新输入密码' }]}
    >
      <Input.Password value={newUserInfo.repeatPassword} onChange={(input)=>{setNewUserInfo((preUser)=>({...preUser,repeatPassword:input.target.value}))}}/>
    </Form.Item>
    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input value={newUserInfo.verifyCode} onChange={(input)=>{setNewUserInfo((preUser)=>({...preUser,verifyCode:input.target.value}))}} />
            </Form.Item>
          </Col>
          <Col span={12}>
          <div>
            <a onClick={async()=>{freshData()}}>
      <img src={captchaData} alt="captcha"/>
      </a>
    </div>
          </Col>
        </Row>
      </Form.Item>
        <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}>
            <Button className='w-full' type="primary" htmlType="submit" onClick={async()=>{await RegisterUser()}} >
              注册
            </Button>
          </Form.Item>
      </Form>
      </Spin>
        </Modal>
    )
}
export default Register;