import { useState,useContext,useEffect } from "react";
import {Modal,Form,Button,Input,Row,Col,Spin } from "antd";
import {BosConfig,BackendURL} from "../App"
import { BosClient} from "@baiducloud/sdk";
import { RandomCreateSecret, decryptMPC } from "../utils/mpcUtil";
import { ethers } from "ethers";
import {generateRandomString} from "../utils/random";
import axios from "axios";
import { decryptWithRSA } from "../utils/RSAUtil";
const ForgetView=(props)=>{
  const config= useContext(BosConfig);
  const backend_url=useContext(BackendURL);
  const [captchaData,setCaptchaData]=useState(null);
  const [init,setInit]=useState(false);
  const [isFind,setIsFind]=useState(false);
    const {setEOAInfo,EOAInfo,userInfo,setForgetSecretView,forgetSecretView,setUserInfo}=props;
    const [findUserInfo,setFindUserInfo]=useState({username:"",password:"",alias:"",verifyCode:"",codeKey:""});
    let bosClient = new BosClient(config.config);
  async  function freshData() {
    setInit(true);
    let newKey=generateRandomString(Math.random()*15);
     await  axios.get(backend_url+"/getCode?key="+newKey).then(response=>{
        let data=response.data;
        if (!data.result){
          Modal.error({title:"error",content:data.message});
          return;
        }
        setCaptchaData(data.data);
       }).catch(error=>{
        Modal.error({title:"error",content:"系统出错勒"})
        return;
       })
       setFindUserInfo((pre)=>({...pre,codeKey:newKey}))
       console.log("key"+findUserInfo.codeKey);
     }
     useEffect(()=>{
      if (!init){
      freshData();
      }
     },[])
   async function findSecret(){
    try{
      setIsFind(true);
       let end =false;
       let [serverPk,baiduPk]=["",""];
      let token ="";
       await axios.post(backend_url+"/login",{username:findUserInfo.username,password:findUserInfo.password,key:findUserInfo.codeKey,verifyCode:findUserInfo.verifyCode}).then((response)=>{
        let data=response.data;
        if(!data.result){
          end=true
          Modal.error({title:"error",content:data.message});
          return
        }
        token=data.data;
       })
       if (end){
        return;
       }
        //get baidu cloud secret
       await bosClient.getObject(config.bucket,findUserInfo.username+"-"+findUserInfo.alias).then((response)=>{
         baiduPk=JSON.parse(response.body);
         //convert the string to BigInt
         baiduPk.x=BigInt(baiduPk.x);
         baiduPk.y=BigInt(baiduPk.y);
        }).catch((error)=>{ 
          Modal.error({title:"error",content:"从云端没有找到对应的私钥片段"});
          end=true;
          return;
        })
        if(end){
          return;
        }
        let formData=new FormData()
        formData.append("publicKey",userInfo.publicKey);
        formData.append("username",findUserInfo.username);

        await axios.post(backend_url+"/getShare",formData,{
          headers:{
            "Authorization":`Bearer ${token}` ,
            'Content-Type': 'multipart/form-data',
          }
        }).then(async(response)=>{
          let data=response.data;
          if(!data.result){
            Modal.error({title:"error",content:"账号密码错误"});
             end=true;
             return;
          }
          // decrypt the serverPk
          let encryptData=data.data;
          await decryptWithRSA(userInfo.privateKey,encryptData).then((result)=>{
            serverPk=result;
            serverPk.x=BigInt(serverPk.x);
            serverPk.y=BigInt(serverPk.y);
          })
        }).catch((error)=>{
          console.log(error);
          Modal.error({title:"error",content:"系统出错啦"});
          end=true;
          return;
        })
        if (end){
          return;
        }
        const recoverUserSecret = RandomCreateSecret([serverPk,baiduPk]);
        recoverUserSecret.x=recoverUserSecret.x.toString();
        recoverUserSecret.y=recoverUserSecret.y.toString();
        setIsFind(false);
       Modal.success({title:"恢复成功",content:(<div>
           重新生成的私钥:{btoa(JSON.stringify(recoverUserSecret))}
        </div>)});
        //状态保存(目前不支持自动登录)
        // setEOAInfo((pre)=({...pre,privatekey:privateKey,wallet:new ethers.Wallet(privateKey)}))
        // setUserInfo((pre)=>({...pre,username:findUserInfo.username}))
        setForgetSecretView(false);
    }catch(e){
       setIsFind(false);
       console.log(e);
       Modal.error({title:"error",content:"系统出错啦"});
    }
    }
    return(  <Modal title="找回密钥"  onCancel={()=>{setForgetSecretView(false)}}  open={forgetSecretView} footer={null}>
    <Spin spinning={isFind}>
    <Form 
    name="forgetview"
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
      <Input value={findUserInfo.username}  onChange={(input)=>{setFindUserInfo((preUser)=>({...preUser,username:input.target.value}))}}/>
    </Form.Item>
    <Form.Item
  label="Password"
  name="password"
  rules={[{ required: true, message: '请输入正确的密码' }]}
>
  <Input.Password value={findUserInfo.password} onChange={(input)=>{setFindUserInfo((preUser)=>({...preUser,password:input.target.value}))}}/>
</Form.Item>
<Form.Item
      label="alias"
      name="alias"
      
      rules={[{ required: true, message: '请输入EOA账户地址' }]}
    >
      <Input value={findUserInfo.alias}  onChange={(input)=>{setFindUserInfo((preUser)=>({...preUser,alias:input.target.value}))}}/>
    </Form.Item>
    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input value={findUserInfo.verifyCode} onChange={(input)=>{setFindUserInfo((preUser)=>({...preUser,verifyCode:input.target.value}))}} />
            </Form.Item>
          </Col>
          <Col span={12}>
          <div>
            <a onClick={async()=>freshData()}>
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
        <Button className='' type="primary" htmlType="submit" onClick={findSecret} >
          确定
        </Button>
      </Form.Item>
  </Form>
  </Spin>
    </Modal>)
}
export default ForgetView;