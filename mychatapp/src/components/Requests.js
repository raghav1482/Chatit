import React, { useEffect, useState } from 'react'
import "./requests.css"
import"./mystyle.css"
import axios from 'axios';
function Requests(props) {
    const [req,setReq] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("userData"));
    const [refresh,setref]= useState(true);
    const [load ,setload] = useState(false);
    useEffect(()=>{
        const getreq = async()=>{
          setload(true);
            const config={headers:{Authorization:`Bearer ${user.data.token}`}}
            await axios.get(`${props.link}/chat/getgrpreq?grp_id=${props.grp_id}`,config).then((result)=>{
              setload(false);
              setReq(result.data);
            }).catch(e=>{console.log(e)});
          }
          getreq();
        },[refresh]);
        
    async function accept(userId){
      const config={headers:{Authorization:`Bearer ${user.data.token}`}}
      await axios.put(`${props.link}/chat/grpaccept`,{grpId:props.grp_id,userId:userId},config).then((result)=>{setref(!refresh);}).catch(e=>{console.log(e)})
    }

    const reject = async(id)=>{
      const config={headers:{Authorization:`Bearer ${user.data.token}`}}
      await axios.delete(`${props.link}/chat/grpreject?id=${id}`,config).then((result)=>{setref(!refresh);}).catch(e=>{console.log(e)});
    }
  return (
    <div className='reqcon'>
        {(req.length>0)?req.map((element)=>{return (
      <div className='reqdiv'>
        <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${element.req_id.image}`}/>
        <div>
            <h4 style={{margin:"0"}}>{element.req_id.name}</h4>
            <button className='req-btn' onClick={() => accept(element.req_id._id)}>Accept</button>
            <button className='req-btn' onClick={()=>{reject(element.req_id._id)}}>Reject</button>
        </div>
      </div>
        );
        }):(!load && (req.length<=0))?<h5 style={{margin:"auto"}}>No requests</h5>:<span className='loader'></span>}
    </div>
  )
}

export default Requests
