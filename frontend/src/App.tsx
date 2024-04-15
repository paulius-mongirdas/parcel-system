import React from 'react';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import Nav from "./components/Nav";
import HomePage from "./pages/Home";

const UseNav=()=>{
  /*let location = useLocation();
  const navigate = useNavigate()
    const {params}=useParams();
    console.log(params)
    if(location.pathname.includes("google")){
        return(<></>)
    }else if(location.pathname.includes("/resetPassword/")){
        return(<></>);
    }
  switch (location.pathname){
      case "/login":
          return(<></>);
      case "/":
          if(!localStorage.getItem('accessToken')){
              navigate("/login");
          }
          return(<></>);
      case "/register":
          return(<></>);
      case "/search":
          return(<></>);
      case "/forgotPassword":
          return(<></>);
      case '/google-oauth-success-redirect':
          return (<></>);
      case `/google-oauth-success-redirect/${params}`:
          return (<></>);
      default:
          if(!localStorage.getItem('accessToken')){
              navigate("/login");
          }
          return(<Nav/>);
  }*/
  return(<Nav/>);
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;