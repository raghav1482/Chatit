import React from 'react';
import{ useMyContext }from "./mycontext";
export default function MessageSelf({dat}){
    const {light} = useMyContext();
    if(dat){
        const timestamp=new Date(dat.createdAt);
        var timeOnly = timestamp.toLocaleTimeString([], { hour12: false });
    }
    return(
        <div className={'msg sent'+(light?"":" dark")}><p style={{margin:"10px 0 0 0"}}>{dat.content}</p>
        <span className="metadata">
            <span className="time" style={{marginBottom:"10px"}}>{timeOnly.split(':')[0]+':'+timeOnly.split(':')[1]}</span>
        </span>
      </div>
    );
}