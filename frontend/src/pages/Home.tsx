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
            <p>Home page of parcel system</p>
          </Container>
        </>
      );
}

export default Home;