import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {AnimatePresence , motion} from "framer-motion";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useMyContext } from './mycontext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Groups(props){
    const {light,refresh  ,refreshData} = useMyContext();
    const [onlineusr , setOnlineusr] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("userData"));
    const nav = useNavigate();
    const [loading  ,setLoad] = useState(false);
    const [name,setName] = useState("");
    const [searchArr , setarr] = useState([]);
    if(!user){
        nav("/");
    }

    useEffect(()=>{
        const fetchgrps = async()=>{
            setLoad(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };
            await axios.get(`${props.link}/chat/fetchgrps`,config).then((result)=>{
                if(searchArr.length<=0){
                    setOnlineusr(result.data);
                }
                else{
                    setOnlineusr(searchArr);
                }
                setLoad(false);
            }).catch(e=>{console.log(e)});
            
        }
        fetchgrps();

    },[refresh])

    const searchGrps = async()=>{
        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${user.data.token}`
                },
            };
            if(name!=""){
                await axios.get(`${props.link}/chat/searchgroup?search_name=${name}`,config).then((result)=>{setarr(result.data);refreshData()});
            }
            else{
                throw ("");
            }
        }catch(e){toast.error("Group Not found!!");setarr([]);refreshData();};
    }

    
    useEffect(()=>{
        if(name===""){
            setarr([]);
            refreshData();
        }
    },[name]);
    
    return(<>
        <AnimatePresence>
        <motion.div initial={{opacity:0 , scale:0.9}} animate={{opacity:1 , scale:1}} exit={{ opacity:0 , scale:0}} className={'list-container'+(light?"":" dark")}>
            <div className={'sb-header gp-header'+(light?"":" dark-2")}>
                <div style={{display:"flex" , justifyContent:"center" , alignItems:"center" , height:"50px"}}>
                <div style={{width:"30px" , height:"30px" , backgroundColor:"green" , borderRadius:"50%" , margin:"20px"}}></div>
                <h2 style={{color:"#3b7699"}}>Available Groups</h2>
                </div>
            </div>
            
            <div className={'sb-search'+(light?"":" dark-2")}>
            <IconButton onClick={searchGrps}><SearchIcon/></IconButton>
                <input placeholder='Search...' style={{backgroundColor:"transparent",color:(light===false)?"white":""}} onChange={(e)=>{setName(e.target.value)}}></input>
            </div>
            <div className={'lists' +(light?"":" dark-2")}>
                {(loading===true)?<span className="loader-2"></span>:""}
                {!loading && <div style={{width:"100%"}}>
                {onlineusr.map((online,index)=>{
                return (<motion.div key={index} whileHover={{scale:'1.01'}} whileTap={{scale:"0.98"}}  onClick={async()=>{
                    const config={headers:{Authorization:`Bearer ${user.data.token}`}}
                    await axios.post(`${props.link}/chat/sendgrpreq`,{req_id: user.data._id, group_id:online._id,grpAdmin:online.groupAdmin},config).then((result)=>{
                        toast.success("Request Sent to Admin!!");
                    }).catch(e=>{if(e.response.data.msg==="Request already sent"){toast.error("Request already sent")}else{toast.error("Some error occured!!")};});

                }}>
                <div className={'con-container'+(light?"":" dark")}>
                    <p className='con-icon'>{online.chatName[0]}</p>
                    <p className='con-title' style={{fontSize:"20px"}}>{online.chatName}</p>
                </div>
                </motion.div>);
                })}
                </div>}
            </div>
        </motion.div>
        </AnimatePresence>
    </>);
}
