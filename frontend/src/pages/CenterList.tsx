import { useEffect, useRef, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Center from "../components/Center";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

interface CenterData {
    id: number;
    capacity: number;
    address: string;
    city: string;
    country: string;
}

const showToastMessage = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

const ViewCenter = () => {
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch(
            "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        )
            .then((response) => response.json())
            .then((data) => {
                setCountries(data.countries);
            });
    }, []);

    const [centerData, setCenterData] = useState([]);

    const [formData, setFormData] = useState({
        capacity: 0,
        address: "",
        city: "",
        country: "AW"
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [address, setAddress] = useState("");
    useEffect(() => {
        address === "" ? setAddress("") : setAddress(address);
    }, [address]);

    const [refreshing, setRefresh] = useState(false);

    const handleCenterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Remove this later
        if (formData.address === "" || formData.city === "") {
            return;
        }
        try {
            const response = await axios.post('http://localhost:3333/center/add', {
                ...formData,
                capacity: +formData.capacity,
                address: formData.address,
                city: formData.city,
                country: formData.country
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLgShow(false);
            window.location.reload();
            console.log('Response from server:', response.data);
            setRefresh(true);
            localStorage.setItem("Status", "Center added Successfully"); // Set the flag
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    // openCenterList()
    const openCenterList = useEffect(() => {
        axios.get(`http://localhost:3333/center/all`)
            .then(response => {
                console.log("Report response: ", response.data);
                const center = response.data.map((center: CenterData) => ({
                    id: center.id,
                    capacity: center.capacity,
                    address: center.address,
                    city: center.city,
                    country: center.country
                }));
                setCenterData(center);
            })
            .catch(error => {
                console.error(error);
            });
    }, [navigate]);

    // Success messages
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
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register center</Button>
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                    {centerData.map((center: CenterData, index) => (
                        <Center key={index} center={center} />
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
                        Register new center
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCenterSubmit}>
                        <Form.Group controlId="averageSpeed">
                            <Form.Label>Average speed (km/h):</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="averageSpeed" placeholder="Enter average speed" onChange={handleTextChange} />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="capacity">
                            <Form.Label>Capacity:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="capacity" placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={formData.country} onChange={e => {
                                console.log("e.target.value", e.target.value);
                                setFormData({ ...formData, country: e.target.value });
                            }}>
                                {countries.map((country: any) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="address">
                            <Form.Label>Address:</Form.Label>
                            <GooglePlacesAutocomplete
                                autocompletionRequest={{
                                    componentRestrictions: { country: formData.country }, 
                                    types: ["route", "street_number"]
                                    // TODO : validation for address
                                }}
                                selectProps={{
                                    onChange: (newValue) => {
                                        setFormData({ ...formData, address: newValue?.value?.description.split(',')[0], city: newValue?.value?.description.split(',')[1]});
                                        console.log('Address:', formData.address);
                                        console.log('City:', formData.city);
                                    },
                                }}
                                
                            />
                        </Form.Group>
                        <br></br>
                        <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default ViewCenter;