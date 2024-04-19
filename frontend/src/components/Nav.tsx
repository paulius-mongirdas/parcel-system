import React, {useEffect, useState} from "react";
import { Form, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Button, FormControl, NavDropdown } from "react-bootstrap";
import Navi from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';

const Nav: React.FC<{}> = () => {
    const navigate = useNavigate()

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid style={{paddingLeft: 10, paddingRight: 10}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse className="justify-content-start">
                    <Navi>
                        <Navi.Link href="/">Home</Navi.Link>
                        <Navi.Link href="/transport">Transport</Navi.Link>
                    </Navi>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Nav;