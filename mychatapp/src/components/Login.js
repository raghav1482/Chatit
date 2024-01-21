import { Button, TextField, colors } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function LoginComp(props){
    const [LoginStatus , setLogInStatus] = useState({});
    const [data,setdata] = useState({ name:"" , password:""});
    const [loading , setload]= useState(false);
    const userData = localStorage.getItem("userData");
    const nav = useNavigate();
    // console.log(props.link);
    useEffect(()=>{
        if(userData){
            nav("/app/welcome");
        }
    })
    const change=(e)=>{
        setdata({...data,[e.target.name]:e.target.value});
    };
    const loginhandler = async ()=>{
        setload(true);
        try{
            const config = {
                headers:{
                    "Content-type":"application/json",
                },
            };
            const response = await axios.post(`${props.link}/user/login/`,data,config);
            setLogInStatus({
                msg:"Success",
                key:Math.random()});
            localStorage.setItem("userData",JSON.stringify(response));
            nav("/app/welcome");
            setload(false);
            toast.success("Login Successful");
            
        }catch(error){
            console.log(error);
            toast.error(error.response.data.message);
            
            setLogInStatus({
                    msg:error.massage,
                    key:Math.random()});
            setload(false);
        }
    }

    return(
        <div className='login-container'>
            <div className='img-contain'><h1>Hello</h1> <p style={{padding:"10px" , backgroundColor:"white" , borderRadius:"20px"}}>Login / SignUP to <span className='pulse' style={{color:"rgb(35, 112, 255)"}}> CHATIT</span> now :)</p></div>
            <div className='login-form'>
                <h2 style={{color : "rgb(35, 112, 255"}}>LOGIN HERE</h2>
                <TextField id='standard-basic' label='Name' variant='outlined' style={{margin:"10px"}} name='name' value={data.name} onChange={change}></TextField>
                <TextField id='outlined-password-input' label='Password' type='password' style={{margin:"10px"}} name='password' value={data.password} onChange={change}></TextField>
                <Button variant='contained' style={{margin:"10px",width:"90px"}} onClick={loginhandler}>{(loading==true)?<span class="loader"></span>:"Login"}</Button>
                <span>Don't have an account?? <Link to='/signup'>SignUP</Link></span>
            </div>
            <ToastContainer/>
        </div>
    );
}