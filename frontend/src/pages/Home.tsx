import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect, useState } from 'react';
import React from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [nav, setNav] = useState<JSX.Element | undefined>(undefined);

    useEffect(() => {
          setNav(<Nav/>);
    })
    return( 
        <>
          {nav}
          <Container>
          <h3 className="text-center">Home page of parcel system</h3>
          </Container>
        </>
      );
}

export default Home;