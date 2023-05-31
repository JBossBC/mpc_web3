import { BosClient } from "@baiducloud/sdk";
import {ethers} from "ethers";
import {Modal,Form,Input,Button,Row,Col} from "antd"
import { useContext, useEffect, useState } from "react";
import {BackendURL, BosConfig} from "../App"
import { decryptMPC, encryptMPC } from "../utils/mpcUtil";
import { encryptWithRSA } from "../utils/RSAUtil";
import {generateRandomString} from "../utils/random";
import axios from "axios";
const Register=(props)=>{
   const config= useContext(BosConfig);
   const backendurl=useContext(BackendURL);
   const [captchaData,setCaptchaData]=useState(null);
   const [newUserInfo,setNewUserInfo]=useState({username:"",password:"",repeatPassword:"",key:""}) ;
   const {serverPK,EOAInfo,setEOAInfo,registerView,setRegisterView,userInfo,setUserInfo,setIsLogin} =props 
   let bosClient = new BosClient(config.config);
   function freshData() {
    setNewUserInfo((pre)=>({...pre,key:generateRandomString(Math.random()*15)}))
     axios.get(backendurl+"/getCode?key="+newUserInfo.key).then(response=>{
      let data=response.data
      if (!data.result){
        Modal.error({title:"error",content:data.message});
        return;
      }
      setCaptchaData(data.data);
     }).catch(error=>{
      Modal.error({title:"error",content:"系统出错勒"})
     })
   }
   useEffect(()=>{
    freshData()
   },[])
  //注册用户
  async function RegisterUser(){

    if(newUserInfo.password!==newUserInfo.repeatPassword){
      Modal.warning({title:"warning",content:"两次输入的密码不一致"})
      return;
    }
    //创建EOA账户
       let result= await createEOA(); 
       if (result){
        return "";
       }
        //创建成功
        setRegisterView(false);
        setIsLogin(true);
  }
   //创建EOA账户
  async function createEOA(){
    let end=false;
    let privateKey = ethers.Wallet.createRandom().privateKey;
    const wallet=new ethers.Wallet(privateKey);
    console.log("privateKey",privateKey);
    // cut the EOA private key
    let [userSF,serverSF,baiduSF]= encryptMPC(BigInt(privateKey));
    console.log(userSF,serverSF,baiduSF);
    console.log(decryptMPC([userSF,serverSF].slice(0,2)).toString());
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
console.log(encryptedData);
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
    await axios.post(backendurl+"/did/register",{newUserInfo}).then((response)=>{
      let data=response.data;
      if (data.result!=true){
        Modal.error({title:"error",content:"创建账户失败"});
        end=true;
      }
    })
    if(end){
      return end;
    } 
     Modal.success({title:"账户创建成功",content:"请保存你的密钥片段: "+userSF});
     setEOAInfo({...EOAInfo,privatekey:ethers.Wallet.createRandom(privateKey).privateKey,wallet:wallet});
     setUserInfo({...userInfo,username:newUserInfo.username,password:newUserInfo.password})
     return end;
  }
    return(
        <Modal title="注册"  onCancel={()=>{setRegisterView(false)}}  open={registerView} footer={null}>
        <Form 
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input value={newUserInfo.username}  onChange={(input)=>{console.log(newUserInfo.password);setNewUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
        </Form.Item>
        <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input.Password value={newUserInfo.password} onChange={(input)=>{console.log(newUserInfo.password);setNewUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
      label="RepeatPassword"
      name="repeatPassword"
      rules={[{ required: true, message: '请重新输入密码' }]}
    >
      <Input.Password value={newUserInfo.repeatPassword} onChange={(input)=>{console.log(newUserInfo.repeatPassword);setNewUserInfo((preUser)=>({...preUser,repeatPassword:input.target.value}))}}/>
    </Form.Item>
    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
          <div>
            <a onClick={freshData}>
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
        </Modal>
    )
}
export default Register;