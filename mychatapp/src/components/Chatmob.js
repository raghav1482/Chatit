import React from 'react'
import { useLocation } from 'react-router-dom'
import ConversationItem from './ConversationsItem';
import SearchIcon from '@mui/icons-material/Search';
import {IconButton} from "@mui/material";
import "./mystyle.css";

function Chatmob() {
    const location = useLocation();
  return (
    <div className='mob-div'>
            <div className={'sb-search'}>
            <IconButton className={'icon'}><SearchIcon/></IconButton>
                <input placeholder='Search...'></input>
            </div>
            <div className={'sb-conversation'}>
                {location.state.conv.map((conversation,index)=>{
                return <ConversationItem data={conversation} key={index}/>
                })}
            </div>
    </div>
  )
}

export default Chatmob
