import { useEffect, useRef, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Center from "../components/Center";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

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

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [options, setOptions] = useState({
        componentRestrictions: { country: formData.country.toLowerCase()},
    });

    const [address, setAddress] = useState("");

    useEffect(() => {
        if (inputRef.current) {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                options
            );
        }
    }, [inputRef.current, options]
    );

    useEffect(() => {
        autoCompleteRef.current?.addListener("place_changed", () => {
            const place = autoCompleteRef.current?.getPlace();
            if (place && place.formatted_address) {
                setAddress(place.formatted_address);

                let city = "";
                let address = "";
                let number = "";
                place.address_components?.forEach((component) => {
                    console.log("component:", component);
                    if (component.types.includes("locality")) {
                        console.log("city:", component.long_name);
                        city = component.long_name;
                    }
                    if (component.types.includes("route")) {
                        console.log("address:", component.long_name);
                        address = component.long_name;
                    }
                    if (component.types.includes("street_number")) {
                        console.log("address:", component.long_name);
                        number = component.long_name;
                    }
                });
                setFormData({ ...formData, city: city, address: address + " " + number, country: formData.country, capacity: formData.capacity});
            }
        });
    }, [autoCompleteRef.current]);

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
                        <Form.Group controlId="capacity">
                            <Form.Label>Capacity:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="capacity" placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={formData.country} onChange={e => {
                                console.log("e.target.value", e.target.value);
                                // map country code to country name
                                setOptions({
                                    componentRestrictions: { country: e.target.value.toLowerCase() },
                                });
                                setFormData({ ...formData, 
                                    capacity: formData.capacity,
                                    country: (countries.find((country: any) => country.value === e.target.value) as any)?.label,
                                    address: formData.address,
                                    city: formData.city});
                                console.log("options", options);
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
                            <Form.Control required ref={inputRef}
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter address" />
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