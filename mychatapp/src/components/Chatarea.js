import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Tooltip } from "@mui/material";
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMyContext } from './mycontext';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { socket } from './soketservice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Requests from './Requests';

export default function ChatArea(props) {
  const ENDPOINT = props.link;
  const { light } = useMyContext();
  const { refresh, refreshData } = useMyContext();
  const nav = useNavigate();
  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [dt, setDt] = useState(true);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState(false);
  const [online, setOnline] = useState(false);
  const [fileInput, setFileInput] = useState("");
  const [previewsrc, setPreviewSource] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [fileDoc, setFileDoc] = useState(null); // State for document file
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 1;

    if (!atBottom) {
      setDt(false);
    } else {
      setDt(true);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (dt) {
      scrollToBottom();
    }
  }, [isTyping, dt, allMessages]);

  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");

  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    if (userData === null) {
      nav("/");
    }
  }, []);

  useEffect(() => {
    socket.emit("join chat", { room: chat_id, socketid: userData.data._id });
    const getOnline = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      await axios.get(`${props.link}/user/online?userid=${location.state.targetid}`, config).then((result) => {
        setOnline(result.data.online);
      });
    }
    getOnline();

    return () => {
      if (socket) {
        socket.emit("leave chat");
      }
    };
  }, [chat_id]);

  useEffect(() => {
    socket.on("messageReceived", (newMessage) => {
      refreshData();
    });

    socket.on("userOnline", (onlineUserId) => {
      if (onlineUserId === location.state.targetid) {
        setOnline(true);
      }
    });

    socket.on("userOffline", (offlineUserId) => {
      if (offlineUserId === location.state.targetid) {
        setOnline(false);
      }
    });

    return () => {
      socket.off("messageReceived");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [socket, allMessages]);

  const sendMessage = async() => {
    if(fileDoc){
      await docUpload().then(()=>{
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`,
          },
        };
        axios
          .post(
            `${props.link}/message/`,
            {
              content: `<img src="https://uxwing.com/wp-content/themes/uxwing/download/file-and-folder-type/page-file-icon.png" class="doc-img" />${fileDoc.name} <a href="https://chatitserver.onrender.com/download/${chat_id}-${fileDoc.name}-${userData.data._id}.${fileDoc.name.split('.').pop()}?nm=${fileDoc.name}" download="" class="doc-a">⬇</a>`,
              chatId: chat_id,
            },
            config
          )
          .then((result) => {
            socket.emit("new message", result);
            refreshData();
            setLoading(false);
          }).catch(e => { toast.error("Some Error Occurred!!"); setLoading(false) });
      });
      return;
    }
    document.getElementsByClassName('imgsend')[0].style.display = 'none';
    setLoading(true);
    setMessageContent("");
    if (previewsrc) {
      uploadImg(previewsrc);
    } else {
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
        .then((result) => {
          socket.emit("new message", result);
          refreshData();
          setLoading(false);
        }).catch(e => { toast.error("Some Error Occurred!!"); setLoading(false) });
    }
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
      }).catch(e => { toast.error("Some Error Occurred!!") });
  }, [refresh]);

  const ExitGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      await axios.put(`${props.link}/chat/grpexit`, { chatId: chat_id, userId: userData.data._id }, config).then(() => { refreshData(); nav("/app/welcome") });
    } catch (e) { toast.error("Error exiting group") };
  }

  const handleImg = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    var fileSize = e.target.files[0].size;
    if (fileSize > 2097152) {
      toast.info("File size should be less than 2MB");
      return;
    }
    setFileInput(file);
    previewFile(file);
    document.getElementsByClassName('imgsend')[0].style.display = 'block';
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }
  }

  const uploadImg = async (base64EncodedImage) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      await axios.post(`${props.link}/user/picupload/`, { data: base64EncodedImage }, config).then(async (result) => {
        var content = 'img:' + result.data.image;
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`,
          },
        };
        await axios
          .post(
            `${props.link}/message/`,
            {
              content: content,
              chatId: chat_id,
            },
            config
          )
          .then((result) => {
            socket.emit("new message", result);
            refreshData();
            setLoading(false);
            setPreviewSource("");
          })
      });
    } catch (e) { toast.error("Some Error Occurred ! Try Again"); setLoading(false) }
  };

  const deleteGrp = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    try {
      await axios.delete(`${props.link}/chat/deletegrp?grp_id=${chat_id}`, config).then(() => { toast("Deleted"); nav("/app/welcome") });
    } catch (e) {
      toast.error("Error!!");
    }
  }

  const handleTyping = (e) => {
    setMessageContent(e.target.value);

    if (!isTyping) {
      socket.emit("typing", chat_id);

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop typing", chat_id);
      }, 1000);
    } else {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop typing", chat_id);
      }, 1000);
    }
  };

  useEffect(() => {
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [socket]);
  
  const renameFile = (originalFile, newFileName) => {
    const fileExtension = originalFile.name.split('.').pop();
    const renamedFile = new File([originalFile], `${newFileName}.${fileExtension}`, {
      type: originalFile.type,
      lastModified: originalFile.lastModified
    });
    return renamedFile;
  };


  const docUpload = async () => {
    try {
  
      // Create the new file name
      const newFileName = `${chat_id}-${fileDoc.name}-${userData.data._id}`;
  
      // Rename the file
      const renamedFile = renameFile(fileDoc, newFileName);
  
      const formData = new FormData();
      formData.append('file', renamedFile); // Append the renamed file to FormData
      formData.append('chatid', chat_id); // Append the chat ID to FormData
      formData.append('sender', userData.data._id); // Append the sender ID to FormData
  
      await axios.post(`${props.link}/chat/docupload`, formData)
        .then(() => {
          // Clear the file selection
          setFileDoc(null);
        })
        .catch((error) => {
          // Handle error
          console.error('Error uploading document:', error);
          toast.error('Failed to upload document');
        });
    } catch (e) {
      console.error('Error uploading document:', e);
      toast.error('Failed to upload document');
    }
  };
  console.log(fileDoc);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className={'chat-area' + (light ? "" : " dark")}>
        <div className={'chat-header' + (light ? "" : " dark-2")}>
          <div className='chat-info'>
            {location.state.isGrp ? <p className='chat-icon'>{chat_user[0].toUpperCase()}</p> : <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${location.state.target_image}`} className="chat-icon" style={{ objectFit: "cover" }} />}<p className='chat-name'>{location.state.isGrp ? location.state.grpName : location.state.name}<br />{!location.state.isGrp && <span style={{ fontSize: "12px" }} className={(online ? "online" : "offline")}>{online ? "online" : "offline"}<div className={"circle" + (online ? " green" : " red")}></div></span>}</p>
          </div>
          <div className='chat-head-icon'>
            {!location.state.isGrp && <Tooltip title="Video Call"><IconButton onClick={() => { nav(`/app/call/${chat_id}`, { state: { room: chat_id, remoteUsr: location.state.targetid, remoteName: location.state.name } }) }}><VideoCallIcon /></IconButton></Tooltip>}
            {location.state.isGrp && (location.state.grpAdmin) && (location.state.grpAdmin._id === userData.data._id) && <Tooltip title="Requests"><IconButton onClick={() => { setReq(!req); }}><NotificationsActiveIcon /></IconButton></Tooltip>}
            {location.state.isGrp && <Tooltip title="Exit Group"><IconButton onClick={ExitGroup}><PersonRemoveIcon /></IconButton></Tooltip>}
            {location.state.isGrp && (location.state.grpAdmin) && (location.state.grpAdmin._id === userData.data._id) && <Tooltip title="DeleteGroup"><IconButton onClick={deleteGrp}><DeleteIcon /></IconButton></Tooltip>}
          </div>
          {req && <Requests grp_id={chat_id} link={props.link} />}
        </div>
        <div className={'msg-area' + (light ? "" : " dark-2")} ref={chatContainerRef} onScroll={handleScroll}>
          {(loading === true) ? <span className="loader-2"></span> : ""}
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
            <div>{isTyping && <div id="lm"></div>}</div>
        </div>
        <div className='text-area'>
          <input type='file' id='imagefile' onChange={handleImg} accept=".jpg, .jpeg, .png" />
          <img src={previewsrc} className='imgsend' />
          <input placeholder={(loading === true) ? 'Sending' : (fileDoc)?fileDoc.name:'Type Message...'} value={messageContent}
            onChange={handleTyping}></input>
          <div>
            <IconButton onClick={handleClick}>
        <span><MoreHorizIcon/></span>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <label htmlFor='docFile'>
            <AttachFileIcon />
          </label>
          <input
            type='file'
            id="docFile"
            style={{ display: "none" }}
            onChange={(e) => { setFileDoc(e.target.files[0]) }}
          />
        </MenuItem>
        <MenuItem>
          <label htmlFor='imagefile'>
            <AddPhotoAlternateIcon />
          </label>
          <input
            type='file'
            id="imagefile"
            style={{ display: "none" }}
          />
        </MenuItem>
      </Menu>
            <IconButton onClick={() => { sendMessage(); }}><SendIcon /></IconButton>
          </div>
        </div>
      </motion.div>
      <ToastContainer stacked />
    </AnimatePresence>
  );
}
