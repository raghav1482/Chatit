import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {IconButton, Tooltip} from "@mui/material";
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { AnimatePresence ,motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useMyContext } from './mycontext';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { socket } from './soketservice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Requests from './Requests';

export default function ChatArea(props){
  const ENDPOINT =props.link;
    // console.log(props.link);
    const {light} = useMyContext();
    const {refresh ,refreshData} = useMyContext();
    const nav=useNavigate();
    const [messageContent, setMessageContent] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [allMessagesCopy, setAllMessagesCopy] = useState([]);
    const [dt,setdt]=useState(true);
    const location = useLocation();
    const [loading , setLoading]=useState(false);
    const [req,setReq]=useState(false);
    const [online , setOnline] = useState(false);

    const chatContainerRef = useRef(null);
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 1;
  
      // If the user is manually scrolled away from the bottom, stop auto-scrolling
      if (!atBottom) {
        setdt(false);
      } else {
        // If the user manually scrolls to the bottom again, resume auto-scrolling
        setdt(true);
      }
    };
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if(dt){
      scrollToBottom();
    }
  }, [dt,allMessages]);

    const dyParams = useParams();
    const [chat_id, chat_user] = dyParams._id.split("&");

    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(()=>{
      if(userData===null){
        nav("/");
      }
    },[])

    // connect to socket

    useEffect(() => {
        socket.emit("join chat",{room:chat_id,socketid:userData.data._id});
        const getonline = async()=>{
          const config = {
            headers: {
              Authorization: `Bearer ${userData.data.token}`,
            },
          };
          await axios.get(`${props.link}/user/online?userid=${location.state.targetid}`,config).then((result)=>{setOnline(result.data.online)});
        }
        getonline();
  
      // Clean up when the component unmounts
      return () => {
        if (socket) {
          socket.emit("leave chat");
        }
      };
    }, [chat_id]);

    useEffect(() => {
      socket.on("messageReceived", (newMessage) => {
        // Handle new message, if needed
        refreshData();
      });
    
      socket.on("userOnline", (onlineUserId) => {
        console.log(onlineUserId, location.state.targetid);
        if (onlineUserId === location.state.targetid) {
          setOnline(true);
        }
      });
    
      socket.on("userOffline", (offlineUserId) => {
        console.log(offlineUserId, location.state.targetid);
        if (offlineUserId === location.state.targetid) {
          setOnline(false);
        }
      });
    
      // Clean up event listeners when the component unmounts
    }, [allMessages]);
    
    
    
    
    const sendMessage = () => {
      setLoading(true);
      setMessageContent("");
            const config = {
              headers: {
                Authorization: `Bearer ${userData.data.token}`,
              },
            };
            axios
            .post(
              `${props.link}/message/`,
              {
                content: messageContent,
                chatId: chat_id,
              },
              config
            )
            .then((result ) => {
              socket.emit("new message", result);
              refreshData();
              setLoading(false);
            }).catch(e=>{toast.error("Some Error Occured!!")});
      
          // Emit the "new message" event instead of "newMessage"
        };

      useEffect(() => {
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`,
          },
        };
        axios
          .get(`${props.link}/message/` + chat_id, config)
          .then(({ data }) => {
            setAllMessages(data);
            setLoading(false);
          }).catch(e=>{toast.error("Some Error Occured!!")});;
          setAllMessagesCopy(allMessages);
      }, [refresh]);

      const ExitGroup = async()=>{
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${userData.data.token}`,
            },
          };
          await axios.put(`${props.link}/chat/grpexit`,{chatId:chat_id,userId:userData.data._id},config).then(()=>{refreshData();nav("/app/welcome")});
        }catch(e){toast.error("Error exiting group")};
      }

    return(
        <AnimatePresence>
        <motion.div initial={{opacity:0 , scale:0.9}} animate={{opacity:1 , scale:1}} exit={{ opacity:0 , scale:0}} className={'chat-area'+ (light?"" : " dark")}>
            <div className={'chat-header'+ (light?"" : " dark-2")}>
                <div className='chat-info'>
                    {location.state.isGrp?<p className='chat-icon'>{chat_user[0].toUpperCase()}</p>:<img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${location.state.target_image}`} className="chat-icon" style={{objectFit:"cover"}}/>}<p className='chat-name'>{location.state.isGrp?location.state.grpName:location.state.name}<br/><span style={{fontSize:"12px"}}>{online?"online":"offline"}</span></p>
                </div>
                <div className='chat-head-icon'>
                    {location.state.isGrp && (location.state.grpAdmin) && (location.state.grpAdmin._id === userData.data._id) &&<Tooltip title="Requests"><IconButton onClick={()=>{setReq(!req);}}><NotificationsActiveIcon/></IconButton></Tooltip>}
                    {location.state.isGrp && <Tooltip title="Exit Group"><IconButton onClick={ExitGroup}><PersonRemoveIcon/></IconButton></Tooltip>}
                </div>
                {req && <Requests grp_id={chat_id} link={props.link}/>}
            </div>
            <div className={'msg-area'+ (light?"" : " dark-2")} ref={chatContainerRef} onScroll={handleScroll}>
            {(loading===true)?<span className="loader-2"></span>:""}
            {!loading && allMessages
            .slice(0)
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf dat={message} key={index} />;
              } else {
                return <MessageOthers dat={message} senderimg={""} key={index} />;
              }
            })}
                </div>
            <div className='text-area'><input placeholder={(loading===true)?'Sending':'Type Message...'} value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}></input><IconButton onClick={() => {
                sendMessage();
              }}><SendIcon/></IconButton></div>
        </motion.div>
        <ToastContainer/>
        </AnimatePresence>
    );
}
