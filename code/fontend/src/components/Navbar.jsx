import React,{useContext,useState} from "react";
import {HiMenuAlt4} from "react-icons/hi";
import {AiOutlineClose}from "react-icons/ai";
// import {LoginModal} from "../App.jsx";
import logo from "../images/logo.png";


const NavBarItem =({title,classprops})=>(
    <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar =(props)=>{
    console.log(props);
    const {userModalView} =props;
    const [toggleMenu,setToggleMenu]=React.useState(false);
    // const setLoginView=useContext(LoginModal);
    const [loginState,setLoginState]=useState(false);
    return(
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer"/>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
               {/* {["Market","Exchange","Tutorials","Wallets"].map((item,index)=>(
                <NavBarItem key={item+index} title={item} />
               ))} */}
               {loginState?<li><div className="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8 ml-2"><img className=" w-8 h-8" src="../images/user.jpg"/></div></li>:
               <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]" onClick={()=>{userModalView(true)}}>
                Login
               </li>
}
            </ul>
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