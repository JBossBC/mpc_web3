import { useState,useContext } from "react";
import {Modal,Form,Button,Input} from "antd";
import {BosConfig,BackendURL} from "../App"
import { BosClient} from "@baiducloud/sdk";
import { decryptMPC } from "../utils/mpcUtil";
import { ethers } from "ethers";
const ForgetView=(props)=>{
  const config= useContext(BosConfig);
  const backend_url=useContext(BackendURL);
  console.log(config);
    const {setEOAInfo,EOAInfo,userInfo,setForgetSecretView,forgetSecretView,setUserInfo}=props;
    const [findUserInfo,setFindUserInfo]=useState({username:"",password:"",alias:""});
    let bosClient = new BosClient(config.config);
   async function findSecret(){
       let end =false;
       let [serverPk,baiduPk]=["",""];
        //get baidu cloud secret
       await bosClient.getObject(config.bucket,userInfo.username+"-"+userInfo.alias).then((response)=>{
         let data=response.data;
         console.log(data);
         //TODO baidupk should be set
        }).catch((error)=>{
          Modal.error({title:"error",content:"系统出错啦"});
          end=true
          return;
        })
        if(end){
          return;
        }
        await axios.POST(backend_url+"/did/getShare",{publicKey:userInfo.publicKey,username:findUserInfo.username,alias:findUserInfo.alias}).then((response)=>{
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
          return;
        }

        const privateKey=decryptMPC([serverPk,baiduPk],2n*8512n);
        Modal.success({title:"成功",content:"自动登录中....."});
        //状态保存
        setEOAInfo((pre)=({...pre,privatekey:privateKey,wallet:new ethers.Wallet(privateKey)}))
        setUserInfo((pre)=>({...pre,username:findUserInfo.username}))
       
    }
    return(  <Modal title="找回密钥"  onCancel={()=>{setForgetSecretView(false)}}  open={forgetSecretView} footer={null}>
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
      rules={[{ required: true, message: '请输入正确的用户名' }]}
    >
      <Input value={findUserInfo.username}  onChange={(input)=>{console.log(findUserInfo.password);setFindUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
  label="Password"
  name="password"
  rules={[{ required: true, message: '请输入正确的密码' }]}
>
  <Input.Password value={findUserInfo.password} onChange={(input)=>{console.log(findUserInfo.password);setFindUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
</Form.Item>
<Form.Item
      label="alias"
      name="alias"
      
      rules={[{ required: true, message: '请输入EOA账户地址' }]}
    >
      <Input value={findUserInfo.alias}  onChange={(input)=>{console.log(findUserInfo.alias);setFindUserInfo((preUser)=>({...preUser,alias:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
       wrapperCol={{
        offset: 8,
        span: 16,
      }}>
        <Button className='' type="primary" htmlType="submit" onClick={findSecret} >
          确定
        </Button>
      </Form.Item>
  </Form>
    </Modal>)
}
export default ForgetView;