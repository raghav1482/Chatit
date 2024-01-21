import logo from './logo.svg';
import './App.css';
import Maincontainer from './components/Maincontainer';
import {
  Routes,
  Route
} from "react-router-dom";
import LoginComp from './components/Login';
import Welcome from './components/Welcome';
import ChatArea from './components/Chatarea';
import CreateGrp from './components/CreateGroup';
import Users from './components/Users';
import Groups from './components/Groups';
import SignupComp from './components/Signup';
import Profile from './components/Profile';
import Chatmob from './components/Chatmob';

function App(props) {
  return (<>
    {/* <Maincontainer/> */}
    <Routes>
      <Route path='/' element={<LoginComp link={props.link}/>}/>
      <Route path='/signup' element={<SignupComp link={props.link}/>}/>
      <Route path="app" element={<Maincontainer link={props.link}/>}>
          <Route path="welcome" element={<Welcome/>}/>
          <Route path="profile" element={<Profile link={props.link}/>}/>
          <Route path="chat/:_id" element={<ChatArea link={props.link}/>}/>
          <Route path="chatmob" element={<Chatmob link={props.link}/>}/>
          <Route path="users" element={<Users link={props.link}/>}/>
          <Route path="groups" element={<Groups link={props.link}/>}/>
          <Route path="create-grp" element={<CreateGrp link={props.link}/>}/>
      </Route>
    </Routes>

    </>);
}

export default App;
