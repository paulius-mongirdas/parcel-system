import React from 'react';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import Nav from "./components/Nav";
import HomePage from "./pages/Home";
import TransportList from "./pages/CarList";
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;