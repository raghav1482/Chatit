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
    const [peerid , setPeerid] = useState();
    const [remotePeerIdval,setRemotePeerIdValue] = useState();
    const peerInstance = useRef(null);
    const [myStream , setMystream] = useState();
    const [remStream , setRemotestream] = useState();
    const [mute , setmute] = useState(true);
    const [load , setLoad]=useState(true);
    useEffect(() => {
      // ... (existing code)
  
      socket.on('call-disconnected', ({ remotePeerId }) => {
        // Handle the call disconnection event
        console.log(`Call disconnected for remote peer ID: ${remotePeerId}`);
  
        // You may want to perform additional cleanup or UI updates here
      });
  
      // ... (existing code)
    }, [socket, loc.state.room, remotePeerIdval]);

    useEffect(()=>{
      const peer = new Peer();
      peer.on('open', (id) => {
        setPeerid(id)
        socket.emit("join-call-room",{room:loc.state.room+'call',mypeerid:id});
      });
            peer.on('call', (call) => {
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          
                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                 setMystream(mediaStream);
                  call.answer(mediaStream)
                  call.on('stream', function(remoteStream) {
                    setRemotestream(remoteStream);
                  });
                });
              })

              peer.on('close', () => {
                // Handle call close event, you can emit a socket event here
                socket.emit('call-disconnected', {room:loc.state.room, remotePeerId: remotePeerIdval });
              });
          
            peerInstance.current = peer;
    },[socket])

    useEffect(() => {
      const handleJoinedRoomCall = async (data) => {
        console.log('remote id:', data.remoteid);
    
        // Set the remote peer id when a user joins the room
        setRemotePeerIdValue(data.remoteid);
    
        if (data.remoteid === peerid) {
          console.log('Setting load to true');
          setLoad(true);
        } else {
          console.log('Setting load to false');
          setLoad(false);
        }
      };
    
      socket.on('joined-room-call', handleJoinedRoomCall);
    
      return () => {
        socket.off('joined-room-call', handleJoinedRoomCall);
      };
    }, [peerid]); // Make sure to include peerid in the dependency array if it is used inside the useEffect
    


    const call = (remotePeerId) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          setMystream(mediaStream);
    
          const call = peerInstance.current.call(remotePeerId, mediaStream)
    
          call.on('stream', (remoteStream) => {
            setRemotestream(remoteStream);
          });
        });
      }

      const hangUp = () => {
        // Close the media stream
        myStream.getTracks().forEach((track) => track.stop());
    
        // Close the Peer connection
        if (peerInstance.current) {
          peerInstance.current.disconnect();
        }
    
        // Additional cleanup, if needed
        setMystream(null);
        setRemotestream(null);
        socket.emit("call-disconnected",{room:loc.state.room, remotePeerId:remotePeerIdval});
      };

  return (
    <div className='video-call'>
      <div className="video-div my">
      <ReactPlayer
            playing
            muted={mute}
            url={myStream}
            height="100%"
            width="100%"
            />
      </div>
      <div className="video-div other">
      <ReactPlayer
            playing
            url={remStream}
            height="100%"
            width="100%"
          />
          <div className='remote-desc'>{remotePeerIdval}</div>
      </div>
      <div className='call-control'>
      <Tooltip title="Call"><IconButton className='call' disabled={load} onClick={(e) =>{e.preventDefault(); call(remotePeerIdval)}}><AddIcCallIcon /></IconButton></Tooltip>
      <Tooltip title="End"><IconButton  onClick={()=>{setmute(!mute)}}>{(mute)?<MicOffIcon/>:<MicIcon/>}</IconButton></Tooltip>
      <Tooltip title="End"><IconButton className='hang' onClick={hangUp}><PhoneDisabledIcon/></IconButton></Tooltip>
      </div>
    </div>
  )
}

export default VideoRoom
