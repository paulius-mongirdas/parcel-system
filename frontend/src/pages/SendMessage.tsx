import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const showToastMessage = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

function SendMessageForm() {
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);
    const [refreshing, setRefresh] = useState(false);
    const [phoneNumber, setNumber] = useState([]);

    const [formData, setFormData] = useState({
        phoneNumber: "",
        text: "",
        status: 'CREATED',
        packageId: ""  
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.post('http://localhost:3333/message/add', {
                phoneNumber: formData.phoneNumber,
                text: formData.text,
                status: formData.status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            
            await axios.put(`http://localhost:3333/package/update/delivered/${formData.packageId}`);
            setLgShow(false);
            window.location.reload();
            console.log('Response from server:', response.data);
            setRefresh(true);
            localStorage.setItem("Status", "Message sent Successfully");
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <>
            <Nav />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Form onSubmit={submitMessage}>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                pattern="[0-9+\-\(\)\s]*"
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formText">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="text"
                                value={formData.text}
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPackageId">
                            <Form.Label>Package ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="packageId"
                                value={formData.packageId}
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Send Message and Update Package
                        </Button>
                    </Form>
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
                        Send New Message
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitMessage}>
                        <Form.Group controlId="modalFormPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                pattern="[0-9+\-\(\)\s]*"
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="modalFormText">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="text"
                                value={formData.text}
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="modalFormPackageId">
                            <Form.Label>Package ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="packageId"
                                value={formData.packageId}
                                onChange={handleTextChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                            Send Message and Update Package
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SendMessageForm;
