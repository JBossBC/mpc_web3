import React,{ useContext, useEffect, useState } from 'react'
import {Modal,Form,Checkbox,Button,Input,Row,Col} from "antd"
import axios from 'axios'
import {BackendURL, BosConfig}  from "../App";
import {ForgetView} from "./";
import { decryptMPC } from '../utils/mpcUtil';
import {generateRandomString} from "../utils/random";
//-------------components-----------------
const Login=(props)=>{
    const baseURL=useContext(BackendURL);
    const [captchaData,setCaptchaData]=useState(null)
    const {loginView,setLoginView,userInfo,setUserInfo,setIsLogin,setRegisterView,setEOAInfo,EOAInfo} =props
    const [remenberUserInfo,setRemenberUserInfo]=useState(true);
    const [forgetSecretView,setForgetSecretView]=useState(false);
    const [form] =Form.useForm();
    function freshData() {
      setUserInfo((pre)=>({...pre,key:generateRandomString(Math.random()*15)}))
       axios.get(baseURL+"/getCode?key="+userInfo.key).then(response=>{
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
    useEffect(()=>{
        if(loginView){
            form.setFieldsValue(userInfo);
        }
    },[loginView])

    const loginUser=async ()=>{
      let end=false;
      let [userPk,serverPk]=[userInfo.secretFragment,""]
      //login
        await axios.post(baseURL+"/login",{username:userInfo.username,password:username.password}).then((response)=>{
          let data =response.data;
          if (data.result!=true){
            Modal.error({title:"error",content:data.message});
            end=true;
            return;
          }
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
          return;
         }
         // 拿取服务器私钥片段
         await axios.post(baseURL+"/did/getShare",{publicKey:userInfo.publicKey,username:userInfo.username,alias:userInfo.alias}).then((response)=>{
          let data=response.data;
          if(!data.result){
            Modal.error({title:"error",content:data.message});
             end=true;
             return;
          }
          serverPk=data.data;
        }).catch((error)=>{
          Modal.error({title:"error",content:"系统出错啦"});
          end=true;
          return;
        })
         if (end){
          if(!remenberUserInfo){
            setUserInfo((pre)=>({...pre,username:"",password:""}))
          }
          setLoginView(false);
          return;
         }
         //获得私钥
         let privateKey=decryptMPC([userPk,serverPk]);
         setEOAInfo((pre)=({...pre,privatekey:privateKey,wallet:new ethers.Wallet(privateKey)}))
         setLoginView(false); 
         setIsLogin(true);
      }
    return(
        <>
        <BosConfig.Provider>
        <Modal title="登录"  onCancel={()=>{setLoginView(false)}}  open={loginView} footer={null}>
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
      <Input value={userInfo.username}  onChange={(input)=>{console.log(userInfo.username);setUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: '请输入正确的密码' }]}
    >
      <Input.Password value={userInfo.password} onChange={(input)=>{console.log(userInfo.password);setUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
      label="secretFragment"
      name="secretFragment"
      tooltip="本人持有的EOA账户的密钥片段"
      rules={[{ required: true, message: '请输入正确的私钥片段' }]}
    >
      <Input.Password value={userInfo.secretFragment} onChange={(input)=>{console.log(userInfo.secretFragment);setUserInfo((preUser)=>({...preUser,secretFragment:input.target.value}))}}/>
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
      label="publicKey"
      name="publicKey"
      tooltip="自动生成公钥,保证传输过程中的安全"
      rules={[{ required: true,message:""}]}
    >
      <Input disabled={true} placeholder={userInfo.publicKey} value={(input)=>{setUserInfo((preUser)=>({...preUser,publicKey:input}))}}/>
    </Form.Item>
    <Form.Item
      label="privateKey"
      name="privateKey"
      tooltip="自动生成私钥，保证传输过程中的安全"
      rules={[{ required: true,message:""}]}
    >
      <Input disabled={true} placeholder={userInfo.privateKey} value={(input)=>{setUserInfo((preUser)=>({...preUser,privateKey:input}))}}/>
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
    </Modal>
    {forgetSecretView&&(<ForgetView setEOAInfo={setEOAInfo} EOAInfo={EOAInfo} setUserInfo={setUserInfo} userInfo={userInfo} forgetSecretView={forgetSecretView}  setForgetSecretView={setForgetSecretView}></ForgetView>)}
    </BosConfig.Provider>
    </>
    )
}
export  default Login;