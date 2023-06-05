import React,{ useContext, useEffect, useState } from 'react'
import {Modal,Form,Checkbox,Button,Input,Row,Col,Spin} from "antd"
import axios from 'axios'
import {BackendURL, BosConfig}  from "../App";
import {ForgetView} from "./";
import { decryptMPC } from '../utils/mpcUtil';
import {generateRandomString} from "../utils/random";
import { decryptWithRSA } from '../utils/RSAUtil';
import { ethers } from 'ethers';
//-------------components-----------------
const Login=(props)=>{
    const baseURL=useContext(BackendURL);
    const [captchaData,setCaptchaData]=useState(null);
    const {loginView,setLoginView,userInfo,setUserInfo,setIsLogin,setRegisterView,setEOAInfo,EOAInfo} =props
    const [remenberUserInfo,setRemenberUserInfo]=useState(true);
    const [forgetSecretView,setForgetSecretView]=useState(false);
    const [isLogining,setIsLogining]=useState(false);
    const [form] =Form.useForm();
    function freshData() {
      let tempKey=generateRandomString(Math.random()*15);
       axios.get(baseURL+"/getCode?key="+tempKey).then(response=>{
        let data=response.data
        if (!data.result){
          Modal.error({title:"error",content:data.message});
          return;
        }
        setCaptchaData(data.data);
       }).catch(error=>{
        Modal.error({title:"error",content:"系统出错勒"});
       })
       setUserInfo((pre)=>({...pre,key:tempKey}));
     }
     useEffect(()=>{
      freshData()
     },[])
    useEffect(()=>{
        if(loginView){
            form.setFieldsValue(({...userInfo,publicKey:"系统自动生成",privateKey:"系统自动生成"}));
        }
    },[loginView])

    const loginUser=async ()=>{
      setIsLogining(true);
      try{
      let end=false;
      let [userPk,serverPk]=[userInfo.secretFragment,""]
      let token ="";
      userPk=JSON.parse(atob(userPk));
      userPk.x=BigInt(userPk.x);
      userPk.y=BigInt(userPk.y);
      //login
        await axios.post(baseURL+"/login",{username:userInfo.username,password:userInfo.password,key:userInfo.key,verifyCode:userInfo.verifyCode}).then((response)=>{
          let data =response.data;
          if (data.result!=true){
            Modal.error({title:"error",content:data.message});
            end=true;
            return;
          }
          setUserInfo((pre)=>({...pre,token:data.data}));
          token=data.data;
          // 前端状态改变
         }).catch((error)=>{
           Modal.error({content:"系统正在开小差",title:"error"});
           end=true;
           return;
         })
         if (end){
           
          if(!remenberUserInfo){
            setUserInfo((pre)=>({...pre,username:"",password:"",secretFragment:""}));
          }
          setLoginView(false);
           setIsLogining(false);
          return;
         }
         // 拿取服务器私钥片段
         await axios.post(baseURL+"/getShare",{publicKey:userInfo.publicKey,username:userInfo.username},{
          headers:{
            "Authorization":`Bearer ${token}` ,
            'Content-Type': 'multipart/form-data',
          }
         }).then(async(response)=>{
          let data=response.data;
          if(!data.result){
            Modal.error({title:"error",content:data.message});
             end=true;
             return;
          }
          let serverPKF=undefined
          await decryptWithRSA(userInfo.privateKey,data.data).then((data)=>{
            serverPKF=data;
          });
          serverPKF.x=BigInt(serverPKF.x);
          serverPKF.y=BigInt(serverPKF.y);
          serverPk=serverPKF;
        }).catch((error)=>{
          console.log(error);
          Modal.error({title:"error",content:"系统出错啦"});
          end=true;
          return;
        })
         if (end){
          if(!remenberUserInfo){
            setUserInfo((pre)=>({...pre,username:"",password:""}))
          }
          setLoginView(false);
          setIsLogining(false);
          return;
         }
         //获得私钥
         let privateKey=decryptMPC([userPk,serverPk]);
         setEOAInfo((pre)=>({...pre,privatekey:privateKey,wallet:new ethers.Wallet(privateKey)}))
         setLoginView(false); 
         setIsLogin(true);
         setIsLogining(false);
      }catch(e){
         Modal.error({title:"error",content:"系统出错啦"});
         setIsLogining(false);
      }
    }
    return(
        <>
        <Modal title="登录"  onCancel={()=>{setLoginView(false)}}  open={loginView} footer={null}>
    <Spin spinning={isLogining}>
    <Form form={form}
    name="login"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: '请输入正确的用户名' }]}
    >
      <Input value={userInfo.username}  onChange={(input)=>{setUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: '请输入正确的密码' }]}
    >
      <Input.Password value={userInfo.password} onChange={(input)=>{setUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
      label="secretFragment"
      name="secretFragment"
      tooltip="本人持有的EOA账户的密钥片段"
      rules={[{ required: true, message: '请输入正确的私钥片段' }]}
    >
      <Input.Password value={userInfo.secretFragment} onChange={(input)=>{setUserInfo((preUser)=>({...preUser,secretFragment:input.target.value}))}}/>
    </Form.Item>
    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input value={userInfo.verifyCode} onChange={(input)=>{setUserInfo((preUser)=>({...preUser,verifyCode:input.target.value}))}} />
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
      label="publicKey"
      name="publicKey"
      tooltip="自动生成公钥,保证传输过程中的安全"
      rules={[{ required: true,message:""}]}
    >
      <Input disabled={true} placeholder={"系统自动生成"} />
    </Form.Item>
    <Form.Item
      label="privateKey"
      name="privateKey"
      tooltip="自动生成私钥，保证传输过程中的安全"
      rules={[{ required: true,message:""}]}
    >
      <Input disabled={true} placeholder={"系统自动生成"} />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox checked={remenberUserInfo} onChange={(event)=>{console.log(event.target.checked);setRemenberUserInfo(event.target.checked)}}>请记住</Checkbox>
        </Form.Item>

        <a className="login-form-forgot float-right underline"  onClick={setForgetSecretView}>
          恢复密钥?
        </a>
      </Form.Item>
      <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
        <Button className='w-full' type="primary" htmlType="submit" onClick={loginUser} >
          登录
        </Button>
        <div>
        或 <a onClick={()=>{setRegisterView(true)}} className='underline'>去注册</a>
        </div>
      </Form.Item>
  </Form>
  </Spin>
    </Modal>
    {forgetSecretView&&(<ForgetView setEOAInfo={setEOAInfo} EOAInfo={EOAInfo} setUserInfo={setUserInfo} userInfo={userInfo} forgetSecretView={forgetSecretView}  setForgetSecretView={setForgetSecretView}></ForgetView>)}
    </>
    )
}
export  default Login;