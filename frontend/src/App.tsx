import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Nav from "./components/Nav";
import HomePage from "./pages/Main";
import TransportList from "./pages/CarList";
import CenterList from "./pages/CenterList";
import PackageList from "./pages/PackageList";
import SendMessages from "./pages/Message"
import 'bootstrap/dist/css/bootstrap.min.css';
import Inventory from './pages/Inventory';
import Report from './pages/Report';
import Transports from './pages/Transports';

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
        <Route path={'/inventory'} element={<Inventory/>} />
        <Route path={'/report'} element={<Report/>} />
        <Route path={'/parcel'} element={<PackageList/>} />
        <Route path={'/message'} element={<SendMessages/>} />
        <Route path={'/transports'} element={<Transports/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;