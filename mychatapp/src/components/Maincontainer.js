import React, { createContext, useEffect, useState } from 'react';
import "./mystyle.css";
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMyContext } from './mycontext';
import { connectToSocket, disconnectFromSocket, reestablishSocketConnection, saveSocketConnection,socket } from './soketservice';

export default function Maincontainer(props){
    const user = JSON.parse(sessionStorage.getItem("userData"));
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, []);

    useEffect(() => {
        reestablishSocketConnection(user?user.data._id:'');

    // Connect to the socket when the component mounts
    connectToSocket(user?user.data._id:'');

    // Save socket connection information in sessionStorage
    saveSocketConnection();
        // Clean up when the component unmounts
        return () => {
            disconnectFromSocket();
          };
      }, [socket]);

    const {light} =useMyContext();
    return(
        <div className={'main-container'+(light?"":" dark")}>
            <Sidebar link={props.link}/>
            <Outlet/>
        </div>
    );
}
