import React from 'react';

export default function MessageOthers({dat}){
    if(dat){
        const timestamp=new Date(dat.createdAt);
        var timeOnly = timestamp.toLocaleTimeString([], { hour12: false });
    }
    return(
        <div style={{display:"flex"}}>
            <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${dat.sender.image}`} style={{width:"30px",height:"30px",borderRadius:"50%",border:"2px solid white",objectFit:"cover"}}/>
            <div className='msg recieved'>
            <p style={{fontWeight:"600",fontStyle:"italic"}}>{dat.sender.name}</p>
            <p style={{marginBottom:"10px",fontWeight:"400"}}>{dat.content}</p>
            <span className="metadata" style={{padding:"0"}}>
                <span className="time" style={{margin:"0 auto 10px 0",padding:"0px !important"}}>{timeOnly.split(':')[0]+':'+timeOnly.split(':')[1]}</span>
            </span>
            </div>
        </div>
    );
}