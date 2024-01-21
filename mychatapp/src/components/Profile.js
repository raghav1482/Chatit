import React, { useEffect, useState } from 'react';
import "./profile.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMyContext } from './mycontext';

function Profile(props) {
    const user = JSON.parse(localStorage.getItem("userData"));
    const [alt, setAlt] = useState("alt");
    const [fileInput,setFileInput]=useState("");
    const [previewsrc , setPreviewSource] =useState();
    const [loading ,setLoad]=useState(false);
    const {light} = useMyContext();

    const handleChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setFileInput(file);
        // console.log(file)
        previewFile(file);
    }
    
    const previewFile = (file)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            setPreviewSource(reader.result);
            uploadImg(reader.result);
        }
    }

    const uploadImg =async(base64EncodedImage)=>{
        try{
            setLoad(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.data.token}`,
                },
              };
            await axios.post(`${props.link}/user/picupload/`,{data:base64EncodedImage},config).then((result)=>{updateuserdata(result.data.image)});
        }catch(e){toast.error("Some Error Occurred ! Try Again");setLoad(false)}
    };

    const updateuserdata=async(imageid)=>{
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${user.data.token}`,
                },
              };
            await axios.put(`${props.link}/user/updatepic/`,{userid:user.data._id , image:imageid},config).then((result)=>{user.data.image = result.data.image;localStorage.setItem("userData",JSON.stringify(user));toast.success("Image Updated Successfully");setLoad(false)});
        }catch(e){console.log(e);toast.error("Some Error Occurred ! Try Again");setLoad(false);}
    }

    return (
        <div className={'profile-cont' + (light ?"":" dark")}>
            <div className='profile-card'>
                <input type="file" id="file-upload" onChange={handleChange}  accept=".jpg, .jpeg, .png"/>
                <div className='img-btn'>
                {previewsrc ? (
                    <img src={previewsrc} alt={alt} />
                    ) : (
                        <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${user.data.image}`} alt={alt} />
                        )}

                {loading && <div className='overlay'><span className='loader'></span></div>}
                </div>
                <label htmlFor="file-upload" id="custom-button" className='btn' >Change</label>
                <h3 className="prof-name" style={{fontSize:"30px",}}>{user.data.name.toUpperCase()}</h3>
                <div className='details'>
                    <p style={{fontSize:"20px",maxWidth:"10%",}}>{user.data.email}</p>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Profile;
