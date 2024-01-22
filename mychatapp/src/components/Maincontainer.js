import React, { createContext, useEffect, useState } from 'react';
import "./mystyle.css";
import Sidebar from './Sidebar';
import Wordarea from './Workarea';
import ChatArea from './Chatarea';
import Welcome from './Welcome';
import CreateGrp from './CreateGroup';
import Usergrp from './Users';
import { Outlet } from 'react-router-dom';
import { useMyContext } from './mycontext';
import { connectToSocket, disconnectFromSocket, reestablishSocketConnection, saveSocketConnection,socket } from './soketservice';

export default function Maincontainer(props){
    const user = JSON.parse(localStorage.getItem("userData"));
    useEffect(() => {
        reestablishSocketConnection(user.data._id);

    // Connect to the socket when the component mounts
    connectToSocket(user.data._id);

    // Save socket connection information in localStorage
    saveSocketConnection();
        // Clean up when the component unmounts
        return () => {
            disconnectFromSocket();
            console.log("gnfg");
          };
      }, []);

    const {light} =useMyContext();
    return(
        <div className={'main-container'+(light?"":" dark")}>
            <Sidebar link={props.link}/>
            <Outlet/>
        </div>
    );
}
