import React, { useEffect ,useState,useRef} from 'react'
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import {IconButton, Tooltip} from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom'
import { socket } from './soketservice';
import ReactPlayer from "react-player";
import Peer from "peerjs";
import "./videocall.css";
function VideoRoom() {
  const nav = useNavigate();
    const loc = useLocation();
    const targetId = loc.state.remoteUsr;
    const [peerid , setPeerid] = useState();
    const [remotePeerIdval,setRemotePeerIdValue] = useState();
    const peerInstance = useRef(null);
    const [myStream , setMystream] = useState();
    const [remStream , setRemotestream] = useState();
    const [mute , setmute] = useState(true);
    const [load , setLoad]=useState(true);
    const [usersBefore, setUsersBefore] = useState({});
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const [calloff,setCalloff]=useState(false);
    const [acc,setAcc] = useState(false);

    useEffect(()=>{
      const peer = new Peer();
      peer.on('open', (id) => {
        setPeerid(id)
        socket.emit("join-call-room",{room:loc.state.room+'call',mypeerid:id,myuserid:userData.data._id});
      });
            peer.on('call', (call) => {
              const accept = window.confirm("Incomming call");
              setAcc(accept);
              if(accept===true){
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          
                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                 setMystream(mediaStream);
                  call.answer(mediaStream)
                  call.on('stream', function(remoteStream) {
                    setRemotestream(remoteStream);
                  });
                });
              }else{
                hangUp();
              }
              })

              peer.on('close', () => {
                // Handle call close event, you can emit a socket event here
              });
          
            peerInstance.current = peer;
    },[socket])

    useEffect(() => {
      const handleJoinedRoomCall = async (data) => {
        // console.log('remote id:', data.remoteid);
        // Set the remote peer id when a user joins the room
        // console.log(data);
        if(data.userPeer && data.userPeer[targetId]!=undefined){
          setRemotePeerIdValue(data.userPeer[targetId]);
        }else{
          setRemotePeerIdValue(data.remoteid);

        }
      };
    
      socket.on('joined-room-call', handleJoinedRoomCall);

      socket.on('usersBeforeYou', ({userPeer}) => {
        setUsersBefore(new Map(Object.entries(userPeer)));
      });
      socket.on("call-off",()=>{
        setCalloff(true);
      })
    
      return () => {
        socket.off('joined-room-call', handleJoinedRoomCall);
      };
    }, [peerid,usersBefore]); // Make sure to include peerid in the dependency array if it is used inside the useEffect
    
      const call = (remotePeerId) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          setMystream(mediaStream);

          
          const call = peerInstance.current.call(remotePeerId, mediaStream)
          
          call.on('stream', (remoteStream) => {
            setAcc(true);
            setRemotestream(remoteStream);
          });
        });
      }
      const toggleMic = () => {
        const audioTracks = myStream.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = !mute;
        });
        setmute(!mute);
      };
      
      const hangUp = () => {
        // Close the media stream
        if(myStream){
          myStream.getTracks().forEach((track) => track.stop());
        }
    
        // Close the Peer connection
        if (peerInstance.current) {
          peerInstance.current.disconnect();
        }
    
        // Additional cleanup, if needed
        setMystream(null);
        setRemotestream(null);
        socket.emit("call-disconnected",{room:loc.state.room});
        nav("/app/welcome");
      };
      useEffect(() => {
        if (calloff) {
          hangUp();
        }
      }, [calloff]);
  return (
    <div className='video-call'>
      <div className="video-div other">
      <div className="video-div my">
      <ReactPlayer
            playing
            url={myStream}
            muted
            height="100%"
            width="100%"
            />
      <div className='remote-desc'>Me</div>
      </div>
      <ReactPlayer
            playing
            url={remStream}
            height="100%"
            width="100%"
          />
          <div className='remote-desc'>{loc.state.remoteName}</div>
      </div>
      <div className='call-control'>
      {!acc && <Tooltip title="Call"><IconButton className='call' onClick={(e) =>{e.preventDefault(); call(remotePeerIdval)}}><AddIcCallIcon /></IconButton></Tooltip>}
      {acc &&<Tooltip title={(mute)?"Mute":"Unmute"}><IconButton  onClick={toggleMic}>{(mute)?<MicOffIcon/>:<MicIcon/>}</IconButton></Tooltip>}
      {acc && <Tooltip title="End"><IconButton className='hang' onClick={hangUp}><PhoneDisabledIcon/></IconButton></Tooltip>}
      </div>
    </div>
  )
}

export default VideoRoom
