import React, { useState } from 'react';
import {IconButton} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import "./mystyle.css";
import { AnimatePresence , motion } from 'framer-motion';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function CreateGrp(props){
    const nav = useNavigate();
    const user = JSON.parse(localStorage.getItem("userData"));
    const [groupName,setGrpName] =useState("");
    const [loading ,setLoad]=useState(false);
    if(!user){
      nav("/");
    }
  const createGroup = () => {
    setLoad(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    };

    axios.post(
      `${props.link}/chat/creategrp`,
      {
        name: groupName,
        users: '[]',
      },
      config
    ).then((result)=>{setLoad(false);nav("/app/groups");}).catch(e=>{console.log(e);toast.error("Group couldn't be created..!!");setLoad(false)});
  };


    return(
        <AnimatePresence>
        <motion.div initial={{opacity:0 , scale:0.9}} animate={{opacity:1 , scale:1}} exit={{ opacity:0 , scale:0}} className='welcome'>
            <div className='creategrp'>
                <input type='text' placeholder='Enter Group Name...' name="groupName" value={groupName}  onChange={(e)=>{setGrpName(e.target.value);}}></input>
                
                {(loading===true)?<span className="loader-2" style={{marginBottom:"0",height:"30px",width:"30px"}}></span>:<IconButton onClick={createGroup}><DoneIcon/></IconButton>}
            </div>
        </motion.div>
        <ToastContainer/>
        </AnimatePresence>
    );
}