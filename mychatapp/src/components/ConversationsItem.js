import React from 'react';
import "./mystyle.css";
import { useNavigate } from 'react-router-dom';
import { useMyContext } from './mycontext';
export default function ConversationItem(props){
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("userData"));
    const {refresh , refreshData,light} = useMyContext();
    if (!props.data || !props.data.users || props.data.users.length < 2) {
      // Handle the missing or incomplete data here
      return null;
    }
    
    const target = ((props.data.users[0]._id===user.data._id))?props.data.users[1]:props.data.users[0];
    if(props.data.latestMessage){
      const timestamp=new Date(props.data.latestMessage.createdAt);
      var timeOnly = timestamp.toLocaleTimeString([], { hour12: false });
    }
    return(
        <div className={'con-container'+(light?"":" dark")} onClick={() => {
          refreshData();
          navigate(
            "/app/chat/" +
            props.data._id +
            "&" +
            (props.data.chatName),
            {
              state: {
                targetid:target._id,
                chat_id:props.data._id,
                target_image: target.image,
                isGrp: props.data.isGrpChat,
                name:target.name,
                grpName:(props.data.chatName)?props.data.chatName:"",
                grpAdmin:(props.data.groupAdmin)?props.data.groupAdmin:false
              }
            }
          );
          
          
          }}>
            <div className='con-icon'>{props.data.isGrpChat?props.data.chatName[0]:target.image?<img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${target.image}`} style={{width:"55px",height:"55px",objectFit:"cover"}}/>:target.name[0]}</div>
            <p className='con-title'>{props.data.isGrpChat?props.data.chatName:target.name}</p>
            <p className='con-lastmsg'>{props.data.latestMessage?props.data.latestMessage.content:"No last Msg"}</p>
            <p className='con-time'>{timeOnly?timeOnly.split(':')[0]+':'+timeOnly.split(':')[1]:""}</p>
        </div>
    );
}