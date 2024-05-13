import React from 'react';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import Nav from "./components/Nav";
import HomePage from "./pages/Main";
import TransportList from "./pages/CarList";
import CenterList from "./pages/CenterList";
import 'bootstrap/dist/css/bootstrap.min.css';

const UseNav=()=>{
  return(<Nav/>);
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<HomePage/>} />
        <Route path={'/transport'} element={<TransportList/>} />
        <Route path={'/center'} element={<CenterList/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;