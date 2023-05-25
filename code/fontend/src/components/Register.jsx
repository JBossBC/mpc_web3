import { BosClient } from "@baiducloud/sdk";
import {ethers} from "ethers";
import {Modal,Form,Input,Button} from "antd"
import { useContext, useState } from "react";
import {BosConfig} from "../App"
import { decryptMPC, encryptMPC } from "../utils/mpcUtil";
const Register=(props)=>{
   const config= useContext(BosConfig)
   const [newUserInfo,setNewUserInfo]=useState({username:"",password:""}) 
   const {EOAInfo,setEOAInfo,registerView,setRegisterView,userInfo,setUserInfo,setIsLogin} =props 
  let bosClient = new BosClient(config.config);
  //注册用户
  async function RegisterUser(){
    //创建EOA账户
        await createEOA(); 
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
    let secret =BigInt('0x'+privateKey.slice(2));
    console.log(secret);
    let [userSF,serverSF,baiduSF]= encryptMPC(secret,3,2);
    console.log(userSF,serverSF,baiduSF);
    console.log(decryptMPC([userSF,serverSF].slice(0,2),2n**512n).toString(16));
    //keep to baiduSF
    await bosClient.putObjectFromString(config.bucket,userInfo.username+"-"+wallet.address,baiduSF).then((response)=>{
      let data=response.data;
      if (data.code!="success"){
        Modal.error({title:"error",content:data.message});
        end=true;
        return
      }
    }).catch((error)=>{
      Modal.error({title:"error",content:error})
      end=true;
      return
    });
    if(end){
      return;
    }
    // keep to server
    // 加密数据
    var encryptData="";
// 加密数据
const encryptedData =encryptWithRSA(serverPK,serverSF);
    await axios.post(BackendURL+"/create",{share:encryptedData,username:userInfo.username,alias:EOAInfo.wallet.address}).then((response)=>{
      let data=response.data;
      if (data.result!=true){
        Modal.error({title:"error",content:data.message});
        end=true;
        return;
      }
     }).catch((error)=>{
      Modal.error({title:"error",content:error});
      end=true
     })
     if (end){
      return;
     }
     Modal.info({title:"账户创建成功",content:userSF});
     setEOAInfo({...EOAInfo,privatekey:ethers.Wallet.createRandom(privateKey).privateKey,wallet:wallet});
     setUserInfo({...userInfo,username:newUserInfo.username,password:newUserInfo.password})
  }
    return(
        <Modal title="注册"  onCancel={()=>{setRegisterView(false)}}  open={registerView} footer={null}>
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
              wrapperCol={{
                offset: 8,
                span: 16,
              }}>
            <Button className='w-full' type="primary" htmlType="submit" onClick={RegisterUser} >
              注册
            </Button>
          </Form.Item>
      </Form>
        </Modal>
    )
}
export default Register;