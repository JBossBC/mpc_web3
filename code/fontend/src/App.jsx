import React,{ useState,useContext,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Modal,Button, Checkbox, Form, Input,Alert} from "antd";
import './App.css'
import { Navbar,Welcome,Footer,Services,Transactions } from './components'
import axios from "axios";
export  const LoginModal =React.createContext();
//the backend url
const baseURL="";
const App=()=>{
  const BackendURL=React.createContext(baseURL);
  const [alertView,setAlertView]=useState(false);
  const [loginView,setLoginView]=useState(false);
  // the alertInfo is obj,including the attribute is type and info
  let alertInfo = null
  const [userInfo,setUserInfo]=useState(null);
  const loginUser=async ()=>{
    await axios.post(baseURL+"/user/login",userInfo).then((response)=>{
      let data =response.data
      if (data.result!="yes"){
        alertInfo={title:"warning",content:data.message};
        setAlertView(true);
           return;
      }
     }).catch((error)=>{
        alertInfo={title:"error",content:"系统正在开小差"};
        setAlertView(true);
        return;
     })
  }
  return (
    <LoginModal.Provider value={setLoginView}>
   <div className='min-h-screen'>
    <div className='gradient-bg-welcome'>
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Transactions />
    <Footer />
    {alertView?Modal.error(alertInfo):<></>}
    {loginView?<Modal title="Login"  onCancel={()=>{setLoginView(false)}}  open={loginView} footer={null}>
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input value={(input)=>{setUserInfo((preUser)=>({...preUser,username:input}))}}/>
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password value={(input)=>{setUserInfo((preUser)=>({...preUser,password:input}))}}/>
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit" onClick={loginUser}>
        登录
      </Button>
    </Form.Item>
  </Form>
    </Modal>:<></>} 
   </div>
      </LoginModal.Provider> 
  )
}

export default App
