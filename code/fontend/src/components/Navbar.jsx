import React,{useContext,useState} from "react";
import {HiMenuAlt4} from "react-icons/hi";
import {AiOutlineClose}from "react-icons/ai";
// import {LoginModal} from "../App.jsx";
import logo from "../images/logo.png";
import {Popover,Dropdown,Avatar,Button, Menu} from "antd";
import { DownOutlined} from '@ant-design/icons';


const Navbar =(props)=>{

    const {isLogin,userInfo,setIsLogin}=props;
    // console.log(props);
    // const {userModalView} =props;
    const [toggleMenu,setToggleMenu]=React.useState(false);
    // const setLoginView=useContext(LoginModal);
    // const [loginState,setLoginState]=useState(false);
    const userInfoContent =(
        <Menu>
            <Menu.Item>
                
            </Menu.Item>
            <Menu.Item>
                <Button onClick={()=>{setIsLogin(false)}}>退出登录</Button>
            </Menu.Item>
        </Menu> 
    )
    return(
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer"/>
            </div>
            {isLogin? 
               <Dropdown overlay={userInfoContent}>
                <Avatar style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }} size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80 }}>
        {userInfo.username}
      </Avatar>
      </Dropdown>:<></>}
            <div className="flex relative">
             {!toggleMenu &&(<HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=>setToggleMenu(true)} />)}
             {!toggleMenu &&(<AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer " onClick={()=>setToggleMenu(false)} />)}
             {toggleMenu &&(<ul className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
               flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
              <li className="text-xl w-full my-2"><AiOutlineClose  onClick={()=>setToggleMenu(false)} /></li>
              {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
            )}
             </ul>)}
            </div>
        </nav>
    )
}
export default Navbar;