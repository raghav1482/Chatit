import React, { useEffect } from 'react';
import "./mystyle.css";
import { useNavigate } from 'react-router-dom';
export default function Welcome(){
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const nav = useNavigate();
    useEffect(()=>{
        if(!userData){
            nav("/");
        }else{
            
        }
    },[]);
    return(
        <div className='welcome'><div className='welprompt' style={{color:"black"}}>Hello and welcome to <span className='pulse' style={{color:"#2e86d8e0"}}>CHATIT :)</span></div></div>
    );
}