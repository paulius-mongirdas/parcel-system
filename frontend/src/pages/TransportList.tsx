import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Transport from "../components/Transport";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

interface TransportData {
    id: number;
    type: string;
    capacity: number;
    averageSpeed: number;
}

const showToastMessage = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

const ViewTransport = () => {
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);

    const [transportData, setTransportData] = useState([]);

    const [formData, setFormData] = useState({
        type: 'local van',
        capacity: 0,
        averageSpeed: 0
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [refreshing, setRefresh] = useState(false);

    const handleTransportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.post('http://localhost:3333/transport/add', {
                ...formData,
                type: formData.type,
                capacity: +formData.capacity,
                averageSpeed: +formData.averageSpeed
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLgShow(false);
            window.location.reload();
            console.log('Response from server:', response.data);
            setRefresh(true);
            localStorage.setItem("Status", "Transport added Successfully"); // Set the flag
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:3333/transport/all`)
            .then(response => {
                console.log("Report response: ", response.data);
                const transport = response.data.map((transport: TransportData) => ({
                    id: transport.id,
                    type: transport.type,
                    capacity: transport.capacity,
                    averageSpeed: transport.averageSpeed
                }));
                setTransportData(transport);
            })
            .catch(error => {
                console.error(error);
            });
    }, [navigate]);

    useEffect(() => {
        if (localStorage.getItem("Status") && document.readyState == 'complete' && !refreshing) {
            var message = localStorage.getItem("Status");
            if (message == null)
                message = ""
            showToastMessage(message); // Display the toast
            localStorage.removeItem("Status"); // Clear the flag   
            setRefresh(false)
        }
    });
    return (
        <>
            <Nav />
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register transport</Button>
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                    {transportData.map((transport: TransportData, index) => (
                        <Transport key={index} transport={transport} />
                    ))}
                </div>
            </Container>


            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Register new transport
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="postText">
                        <Form.Label>Type:</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.type}
                            name="type"
                            onChange={e => {
                                console.log("e.target.value", e.target.value);
                                setFormData({ ...formData, type: e.target.value });
                            }}
                        >
                            <option value="local van">Local van</option>
                            <option value="long journey van">Long journey van</option>
                            <option value="truck">Truck</option>
                        </Form.Control>
                        <br />
                        <Form.Label>Capacity:</Form.Label>
                        <Form.Control type="number" name="capacity" placeholder="Enter capacity" onChange={handleTextChange} />
                        <br />
                        <Form.Label>Average speed:</Form.Label>
                        <Form.Control type="number" name="averageSpeed" placeholder="Enter average speed" onChange={handleTextChange} />
                    </Form.Group>
                    <br></br>
                    <Button variant="success" className="float-right" style={{ height: '35px' }} onClick={handleTransportSubmit}>
                        Register
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default ViewTransport;