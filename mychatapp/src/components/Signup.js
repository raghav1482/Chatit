import { Button, TextField, colors } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SignupComp(props){
    const [SignupStatus , setSignupStatus] = useState({});
    const [data,setdata] = useState({email:"" , name:"" , password:""});
    const [loading , setload]= useState(false);
    const nav = useNavigate();
    
    const change=(e)=>{
        setdata({...data,[e.target.name]:e.target.value});
    };
    const signuphandler = async ()=>{
        setload(true);
        try{
            const config = {
                headers:{
                    "Content-type":"application/json",
                },
            };
            const response = await axios.post(`${props.link}/user/register/`,data,config);
            setSignupStatus({
                msg:"Success",
                key:Math.random()
            });
            nav("/app/welcome");
            localStorage.setItem("userData",JSON.stringify(response));
            setload(false);
            toast.success("Registered Successfully");
            
        }catch(error){
            console.log(error);
            if(error.response.status == 405){
                toast.error("User with this email already exists...");
                setSignupStatus({
                    msg:"User with this email already exists...",
                    key:Math.random()
                });
            }
            if(error.response.status == 406){
                toast.error("User Name Already Taken...");
                setSignupStatus({
                    msg:"User Name Already Taken...",
                    key:Math.random()
                });
            }
            setload(false);
        }
    }
    

    return(
        <div className='login-container'>
            <div className='img-contain'><h1>Hello</h1> <p style={{padding:"10px" , backgroundColor:"white" , borderRadius:"20px"}}>Login / SignUP to <span className='pulse' style={{color:"rgb(35, 112, 255)"}}> CHATIT</span> now :</p></div>
            <div className='login-form'>
                <h2 style={{color : "rgb(35, 112, 255"}}>CREATE ACCOUNT</h2>
                <TextField id='standard-basic' label='Name' variant='outlined' style={{margin:"10px"}} onChange={change} name="name" value={data.name}></TextField>
                <TextField id='outlined-email-input' label='Email' type='email' style={{margin:"10px"}} onChange={change} name="email" value={data.email}></TextField>
                <TextField id='outlined-password-input' label='Password' type='password' style={{margin:"10px"}} onChange={change} name="password" value={data.password}></TextField>
                <Button variant='contained' style={{width:"90px"}} onClick={signuphandler}>{(loading==true)?<span class="loader"></span>:"Register"}</Button>
                <span>Already have an account?? <Link to='/'>Login</Link></span>
            </div>
            <ToastContainer/>
        </div>
    );
}