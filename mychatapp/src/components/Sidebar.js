import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LogoutIcon from '@mui/icons-material/Logout';
import ThreePIcon from '@mui/icons-material/ThreeP';
import SearchIcon from '@mui/icons-material/Search';
import {IconButton} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import "./mystyle.css";
import ConversationItem from './ConversationsItem';
import { useNavigate } from 'react-router-dom';
import axios from "axios" 
import { useMyContext } from './mycontext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar(props){
    const navigate = useNavigate();
    const {refresh,refreshData,light,nightMode}=useMyContext();
    // console.log(props.link);
    const [conversations, setConversations] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [loading , setLoad] = useState(false);
    const [searchArr , setarr] = useState([]);
    const [srch_name,set_srch] = useState("");

    if(userData===null)
    {
      navigate("/");
    }
    else{
      var user = userData.data;
    }
    
    useEffect(() => {
      setLoad(true);
      if(userData!=null){
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
    
        axios.get(`${props.link}/chat/`,config,{userId:user._id}).then((response) => {
          if(searchArr.length<=0){
            setConversations(response.data.reverse());
          }
          else{
            setConversations(searchArr);
          }
          setLoad(false);
        }).catch(e=>{toast.error("Couldn't Fetch Users");});
      }
    }, [refresh]);

    const searchChat = async()=>{
      try{
          const config = {
              headers:{
                  Authorization:`Bearer ${userData.data.token}`
              },
          };
          if(srch_name!=""){
              await axios.get(`${props.link}/chat/searchchat?search_name=${srch_name}&userId=${[userData.data._id]}`,config).then((result)=>{setarr(result.data);refreshData()});
          }
          else{
              throw ("");
          }
      }catch(e){toast.error("Chat Not found!!");setarr([]);refreshData();};
  }

    return(
        <div className={'side-bar'+ (light?"" : " dark")} >
            <div className={"sb-header" + (light?"" : " dark-2")} >
                <IconButton onClick={()=>{navigate('profile')}}>
                  {(userData.data.image)?<img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${userData.data.image}`} style={{width:"30px" , borderRadius:"50%",height:"30px",objectFit:"cover",border:"2px solid white",boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'}}/>:<AccountCircleIcon className={'icon'+ (light?"" : " dark-2")}/>}
                </IconButton>
                <div className={'sb-icons'}>
                <IconButton onClick={()=>{navigate('chatmob',{state:{conv:(conversations)?conversations:[]}})}}><ThreePIcon className={'icon iconconv'+ (light?"" : " dark-2")}/></IconButton>
                <IconButton onClick={()=>{navigate('users')}}><PersonAddIcon className={'icon'+ (light?"" : " dark-2")}/></IconButton>
                <IconButton><GroupAddIcon onClick={()=>{navigate('groups')}} className={'icon'+ (light?"" : " dark-2")}/></IconButton>
                <IconButton onClick={()=>{navigate('create-grp')}}><AddCircleIcon className={'icon'+ (light?"" : " dark-2")}/></IconButton>
                <IconButton onClick={()=>{nightMode();if(light===true){document.body.style.backgroundColor = '#1c1c1c';}else{document.body.style.backgroundColor = 'white'}}}>{light?<NightlightIcon className={'icon'+ (light?"" : " dark-2")}/>:<LightModeIcon className={'icon'+ (light?"" : " dark-2")}/>}</IconButton>
                <IconButton onClick={()=>{localStorage.clear();navigate('/')}}><LogoutIcon className={'icon'+ (light?"" : " dark-2")}/></IconButton>
                </div>
            </div>
            <div className={'sb-div'+(light?"" : " dark-2")}>
              <div className={'sb-search'+ (light?"" : " dark")} style={{width:"85%"}}>
              <IconButton className={'icon'+ (light?"" : " dark")} onClick={searchChat}><SearchIcon/></IconButton>
                  <input placeholder='Search...' className={''+ (light?"" : " dark")} name='search_chat' value={srch_name} onChange={(e)=>{set_srch(e.target.value);}}></input>
              </div>
                {(loading===true)?<span className="loader-2"></span>:""}
              {!loading && <div className={'sb-conversation'}>
                  {conversations.map((conversation,index)=>{
                  return <ConversationItem data={conversation} key={conversation._id}/>
                  })}
              </div>}
            </div>
            <ToastContainer/>
        </div>
    );
}