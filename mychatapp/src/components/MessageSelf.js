import React from 'react';
import{ useMyContext }from "./mycontext";
export default function MessageSelf({dat}){
    const {light} = useMyContext();
    if(dat){
        const timestamp=new Date(dat.createdAt);
        var timeOnly = timestamp.toLocaleTimeString([], { hour12: false });
    }
    return(
        <div className={'msg sent'+(light?"":" dark")}><p style={{margin:"10px 0 0 0"}} className='msg-p'>{(dat.content.slice(0,4)==='img:')?<img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${dat.content.slice(4)}`}/>:dat.content}</p>
        <span className="metadata">
            <span className="time" style={{marginBottom:"10px"}}>{timeOnly.split(':')[0]+':'+timeOnly.split(':')[1]}</span>
        </span>
      </div>
    );
}