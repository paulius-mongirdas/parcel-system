import { useEffect, useRef, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Package from "../components/Package";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

interface PackageData {
    id: number;
    address: string;
    city: string;
    country: string;
    postalCode: number;

    length: number;
    width: number;
    height: number;
    weight: number;

    status: Status;
    createdAt: Date;
    deliveredAt: Date;

    price: number;
}

enum Status {
    CREATED = 'CREATED',
    IN_DELIVERY = 'IN_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
    NOT_DELIVERED = 'NOT_DELIVERED'
}

const showToastMessage = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

const ViewPackage = () => {
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

    const [errors, setErrors] = useState({ address: '' });

    const [packageData, setPackageData] = useState([]);

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        country: "",
        postalCode: 0,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        status: Status.CREATED,
        createdAt: new Date(),
        deliveredAt: new Date(),
        price: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;
    
        if (type === 'number') {
          processedValue = parseFloat(value);
        } else if (type === 'date') {
          processedValue = value; // Date values are typically handled as strings in YYYY-MM-DD format
        } else if (name === 'status') {
          processedValue = value as Status;
        }
        setFormData({ ...formData, [name]: processedValue });
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
                let postal = "";
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
                    if (component.types.includes("postal_code")) {
                        console.log("postal:", component.long_name);
                        postal = component.long_name;
                    }
                });
                setFormData({ ...formData, city: city, address: address + " " + number, country: formData.country, postalCode: +postal});
            }
        });
    }, [autoCompleteRef.current]);

    const [refreshing, setRefresh] = useState(false);

    const handlePackageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.address || !formData.city || !formData.country || !formData.postalCode) {
            setErrors({
                address: 'Address, city, country and postal code fields are required.'
            });
            return;
        }

        console.log('Form Data:', formData);
        try {
            const response = await axios.post('http://localhost:3333/package/add', {
                ...formData,
                // address: formData.address,
                // city: formData.city,
                // country: formData.country,
                // postalCode: +formData.postalCode,
                length: +formData.length,
                width: +formData.width,
                height: +formData.height,
                weight: +formData.weight,
                status: formData.status,
                createdAt: new Date().toISOString(),
                deliveredAt: "1970-01-01T00:00:00.000Z",
                price: +formData.price
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLgShow(false);
            window.location.reload();
            console.log('Response from server:', response.data);
            setRefresh(true);
            localStorage.setItem("Status", "Parcel added Successfully"); // Set the flag
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };
    
    // openPackageList()
    const openPackageList = useEffect(() => {
        axios.get(`http://localhost:3333/package/all`)
            .then(response => {
                console.log("Report response: ", response.data);
                const parcel = response.data.map((parcel: PackageData) => ({
                    id: parcel.id,
                    address: parcel.address,
                    city: parcel.city,
                    country: parcel.country,
                    postalCode: parcel.postalCode,
                    length: parcel.length,
                    width: parcel.width,
                    height: parcel.height,
                    weight: parcel.weight,
                    status: parcel.status,
                    createdAt: parcel.createdAt,
                    deliveredAt: parcel.deliveredAt,
                    price: parcel.price
                }));
                setPackageData(parcel);
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
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register parcel</Button>
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                    {packageData.map((parcel: PackageData, index) => (
                        <Package key={index} parcel={parcel} />
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
                        Register new parcel
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePackageSubmit}>
                        {/* <Form.Group controlId="address">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control required type="text" name="address" placeholder="Enter address" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="city">
                            <Form.Label>City:</Form.Label>
                            <Form.Control required type="text" name="city" placeholder="Enter city" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required type="text" name="country" placeholder="Enter country" onChange={handleInputChange} />
                        </Form.Group>
                        <br /> */}
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={formData.country} onChange={e => {
                                console.log("e.target.value", e.target.value);
                                // map country code to country name
                                setOptions({
                                    componentRestrictions: { country: e.target.value.toLowerCase() },
                                });
                                setFormData({ ...formData, 
                                    country: (countries.find((country: any) => country.value === e.target.value) as any)?.label,
                                    address: formData.address,
                                    city: formData.city,
                                    postalCode: formData.postalCode});
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
                                placeholder="Enter address"
                                isInvalid={!!errors.address} />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br></br>
                        {/* <Form.Group controlId="postalCode">
                            <Form.Label>Postal code:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="postalCode" placeholder="Enter postal code" onChange={handleInputChange} />
                        </Form.Group>
                        <br /> */}
                        <Form.Group controlId="length">
                            <Form.Label>Length:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="length" placeholder="Enter length" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="width">
                            <Form.Label>Width:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="width" placeholder="Enter width" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="height">
                            <Form.Label>Height:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="height" placeholder="Enter height" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="weight">
                            <Form.Label>Weight:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="weight" placeholder="Enter weight" onChange={handleInputChange} />
                        </Form.Group>
                        {/* <br />
                        <Form.Group controlId="status">
                            <Form.Label>Type:</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.status}
                                    name="status"
                                    onChange={e => {
                                        console.log("e.target.value", e.target.value);
                                        setFormData({ ...formData, status: e.target.value as Status });
                                    }}
                                >
                                    <option value="{Status.CREATED}">Created</option>
                                    <option value="{Status.IN_DELIVERY}">In delivery</option>
                                    <option value="{Status.DELIVERED}">Delivered</option>
                                    <option value="{Status.CANCELED}">Canceled</option>
                                    <option value="{Status.NOT_DELIVERED}">Not delivered</option>
                                </Form.Control>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="createdAt">
                            <Form.Label>Created at:</Form.Label>
                            <Form.Control required type="date" name="createdAt" placeholder="Enter created at" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="deliveredAt">
                            <Form.Label>Delivered at:</Form.Label>
                            <Form.Control required type="date" name="deliveredAt" placeholder="Enter delivered at" onChange={handleInputChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="price">
                            <Form.Label>Price:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="price" placeholder="Enter price" onChange={handleInputChange} />
                        </Form.Group> */}
                        <br></br>
                        <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                            Create
                        </Button>
                        </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default ViewPackage;