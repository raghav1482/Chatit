import React, { useState,useEffect } from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {AnimatePresence , motion} from "framer-motion";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useMyContext } from './mycontext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Users(props){
    const {refresh ,refreshData,light} = useMyContext();
    const [loading , setLoad]=useState(false);
    const [name,setName] = useState("");
    const [searchArr , setarr] = useState([]);
    
    const nav = useNavigate();
    const [users , setUsers] = useState([]);
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if(!userData){
        nav(-1);
    }

    useEffect(()=>{
        setLoad(true);
        const config = {
            headers:{
                Authorization:`Bearer ${userData.data.token}`
            },
        };
        axios.get(`${props.link}/user/fetchUsers` , config).then((data)=>{
            if(searchArr.length<=0){
                setUsers(data.data);
            }
            else{
                setUsers(searchArr);
            }
            setLoad(false);
        });
        
    },[refresh]);

    const searchuser = async()=>{
        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${userData.data.token}`
                },
            };
            if(name!=""){
                await axios.get(`${props.link}/user/searchuser?search_name=${name}`,config).then((result)=>{setarr(result.data);refreshData()});
            }
            else{
                throw ("");
            }
        }catch(e){toast.error("User Not found!!");setarr([]);refreshData();};
    }

    useEffect(()=>{
        if(name===""){
            setarr([]);
            refreshData();
        }
    },[name]);
    
    return(<>
    <AnimatePresence>
        <motion.div initial={{opacity:0 , scale:0.9}} animate={{opacity:1 , scale:1}} exit={{ opacity:0 , scale:0}} className={'list-container'+(light?'':' dark')}>
            <div className={'sb-header gp-header' + (light ?'':' dark-2')}>
                <div style={{display:"flex" , justifyContent:"center" , alignItems:"center" , height:"50px"}}>
                <div style={{width:"30px" , height:"30px" , backgroundColor:"green" , borderRadius:"50%" , margin:"20px"}}></div>
                <h2 style={{color:"#3b7699"}}>AllUsers</h2>
                </div>
            </div>
            <div className={'sb-search'+(light?'':' dark-2')}>
            <IconButton onClick={searchuser}><SearchIcon/></IconButton>
                <input placeholder='Search...' style={{backgroundColor:"transparent",color:(light===false)?"white":""}} name='name' value={name} onChange={(e)=>{setName(e.target.value);}}></input>
            </div>
            <div className={'lists'+(light?'':' dark-2')} style={{backgroundColor:"transparent"}}>
            {(loading===true)?<span className="loader-2"></span>:""}
                {!loading && <div style={{width:"100%"}}>
                {users.map((online,index)=>{
                return (<div className={'con-container'+(light?"":" dark")} key ={index} onClick={() => {
                    const config = {
                      headers: {
                        Authorization: `Bearer ${userData.data.token}`,
                      },
                    };
                    axios.post(
                      `${props.link}/chat/`,
                      {
                        userId: online._id,myside:userData.data._id,name:online.name
                      },
                      config
                    ).then(()=>{refreshData();toast.info(`${online.name} added to Coversation Queue..`)});
                    // dispatch(refreshSidebarFun());
                  }}>
                <div className='con-icon'>{online.image?<img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${online.image}`} style={{width:"100px",objectFit:"cover"}}/>:online.name[0]}</div>
                <p className='con-title' style={{fontSize:"20px"}}>{online.name}</p>
                </div>);
                })}
                </div>}
            </div>
        </motion.div>
                <ToastContainer stacked />
        </AnimatePresence>
    </>);
}
