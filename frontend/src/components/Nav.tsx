import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Nav: React.FC<{}> = () => {
    const navigate = useNavigate()

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid style={{paddingLeft: 10, paddingRight: 10}}>
                
            </Container>
        </Navbar>
    );
}

export default Nav;