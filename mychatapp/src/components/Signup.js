import { Button, TextField, colors } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SignupComp(props){
    const [SignupStatus , setSignupStatus] = useState({});
    const [data,setdata] = useState({email:"" , name:"" , password:""});
    const [loading , setload]= useState(false);
    const [errors,setErrors]=useState({email:false});
    const nav = useNavigate();
    
    const change=(e)=>{
        setdata({...data,[e.target.name]:e.target.value});
    };
    const signuphandler = async ()=>{
        if(!data.email.trim()) {
            setErrors({email:"Email is required"});
        } else if(!/\S+@\S+\.\S+/.test(data.email)){
            setErrors({email:"Invalid email"});
        }
        else if(data.password.length <= 6){
            setErrors({email:false,password:"password should be greater than 6 letters"});
        }
        else{
            setErrors({email:false,password:false});
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
            sessionStorage.setItem("userData",JSON.stringify(response));
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
    }
    

    return(<>
            <div class="gradient" style={{objectFit:"cover"}}></div>
        <div className='login-container'>
            <div className='img-contain'><h1>Hello</h1> <p style={{padding:"10px" , backgroundColor:"white" , borderRadius:"20px"}}>Login / SignUP to <span className='pulse' style={{color:"rgb(35, 112, 255)"}}> CHATIT</span> now :</p></div>
            <div className='login-form'>
                <h2 style={{color : "rgb(35, 112, 255"}}>CREATE ACCOUNT</h2>
                <TextField id='standard-basic' label='Name' variant='outlined' style={{margin:"10px"}} onChange={change} name="name" value={data.name}></TextField>
                <TextField id='outlined-email-input' helperText={errors.email} label='Email' type='email' style={{margin:"10px"}} onChange={change} name="email" value={data.email} error={errors.email}></TextField>
                <TextField id='outlined-password-input' error={errors.password} label='Password' type='password' style={{margin:"10px"}} onChange={change} name="password" helperText={errors.password} value={data.password}></TextField>
                <Button variant='contained' style={{width:"90px"}} onClick={signuphandler}>{(loading==true)?<span class="loader"></span>:"Register"}</Button>
                <span>Already have an account?? <Link to='/'>Login</Link></span>
            </div>
            <ToastContainer stacked />
        </div>
        </>
    );
}