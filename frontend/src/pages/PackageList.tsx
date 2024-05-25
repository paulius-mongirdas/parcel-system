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

interface CenterData {
    id: number;
    capacity: number;
    address: string;
    city: string;
    country: string;
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
    const [centerData, setCenterData] = useState<CenterData[]>([]);
    const [packageData, setPackageData] = useState<PackageData[]>([]);
    const [errors, setErrors] = useState({ address: '' });

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

    const [refreshing, setRefresh] = useState(false);
    const [address, setAddress] = useState("");
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [options, setOptions] = useState({
        componentRestrictions: { country: formData.country.toLowerCase() },
    });
    
    useEffect(() => { 
        fetch("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code")
            .then((response) => response.json())
            .then((data) => {
                setCountries(data.countries);
            });

        axios.get(`http://localhost:3333/center/all`) // 2. selectCenters()
            .then(response => {
                setCenterData(response.data); // 3. center list
            })
            .catch(error => {
                console.error(error);
            });
        // 1. getPackageData()
        if (inputRef.current) {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
            autoCompleteRef.current.addListener("place_changed", () => {
                const place = autoCompleteRef.current?.getPlace();
                if (place && place.formatted_address) {
                    setAddress(place.formatted_address);
                    let city = "";
                    let address = "";
                    let number = "";
                    let postal = "";
                    place.address_components?.forEach((component) => {
                        if (component.types.includes("locality")) {
                            city = component.long_name;
                        }
                        if (component.types.includes("route")) {
                            address = component.long_name;
                        }
                        if (component.types.includes("street_number")) {
                            number = component.long_name;
                        }
                        if (component.types.includes("postal_code")) {
                            postal = component.long_name;
                        }
                    });
                    setFormData({ ...formData, city: city, address: address + " " + number, country: formData.country, postalCode: +postal });
                }
            });
        }
    }, [inputRef.current, options]);
    
    useEffect(() => {
        axios.get(`http://localhost:3333/package/all`)
            .then(response => {
                setPackageData(response.data);
            })
            .catch(error => {
                console.error(error);
            });

        if (localStorage.getItem("Status") && document.readyState === 'complete' && !refreshing) {
            var message = localStorage.getItem("Status");
            if (message == null) message = "";
            showToastMessage(message);
            localStorage.removeItem("Status");
            setRefresh(false);
        }
    }, [refreshing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;

        if (type === 'number') {
            processedValue = parseFloat(value);
        } else if (type === 'date') {
            processedValue = value;
        } else if (name === 'status') {
            processedValue = value as Status;
        }
        setFormData({ ...formData, [name]: processedValue });
    };



    const handlePackageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!formData.address || !formData.city || !formData.country || !formData.postalCode) {
            setErrors({ address: 'Address, city, country and postal code fields are required.' });
            return;
        }
    
        try {
            const packageLatLng = await getLatLngFromAddress(formData.address + ', ' + formData.city + ', ' + formData.country); 
            const centerDistances = await getDistances(packageLatLng); // 6. calculated distances 5. getDistances()
            
            // Loop: Finding the nearest center (step 7: sortPackage, step 8: chooseCenter)
            const nearestCenter = chooseCenter(centerDistances); // 7. sortPackage, step 8: chooseCenter
    
            const response = await axios.post('http://localhost:3333/package/add', {
                ...formData,
                centerId: nearestCenter.id, //foreign key center and package
                length: +formData.length,
                width: +formData.width,
                height: +formData.height,
                weight: +formData.weight,
                status: formData.status,
                createdAt: new Date().toISOString(),
                deliveredAt: "1970-01-01T00:00:00.000Z",
                price: +formData.price
            }, {
                headers: { 'Content-Type': 'application/json' },
            }); // 10. updatePackage()
    
            setLgShow(false);
            window.location.reload();
            setRefresh(true);
            localStorage.setItem("Status", "Parcel added Successfully");
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const chooseCenter = (centerDistances: { id: number, distance: number }[]) => {
        let nearestCenter = centerDistances[0];
        for (let i = 1; i < centerDistances.length; i++) {
            if (centerDistances[i].distance < nearestCenter.distance) {
                nearestCenter = centerDistances[i];
            }
        }
        return nearestCenter;
    };

    const getLatLngFromAddress = async (address: string) => {
        const geocoder = new window.google.maps.Geocoder();
        return new Promise<{ lat: number, lng: number }>((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({ lat: location.lat(), lng: location.lng() });
                } else {
                    reject('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    };

    const getDistances = async (packageLatLng: { lat: number, lng: number }) => {
        const destinations = centerData.map(center => center.address + ', ' + center.city + ', ' + center.country).join('|');
        const service = new window.google.maps.DistanceMatrixService();
        return new Promise<{ id: number, distance: number }[]>((resolve, reject) => {
            service.getDistanceMatrix({
                origins: [new window.google.maps.LatLng(packageLatLng.lat, packageLatLng.lng)],
                destinations: destinations.split('|'),
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (response, status) => {
                if (status === 'OK' && response && response.rows && response.rows[0] && response.rows[0].elements) {
                    // Loop: Calculating distances to all centers
                    const distances = [];
                    for (let index = 0; index < response.rows[0].elements.length; index++) {
                        const element = response.rows[0].elements[index];
                        distances.push({
                            id: centerData[index].id,
                            distance: element.distance?.value ?? Infinity
                        });
                    }
                    resolve(distances);
                } else {
                    reject('Distance Matrix request was not successful for the following reason: ' + status);
                }
            });
        });
    };

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
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={formData.country} onChange={e => {
                                setOptions({ componentRestrictions: { country: e.target.value.toLowerCase() } });
                                setFormData({ ...formData, country: e.target.value });
                            }}>
                                {countries.map((country: any) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="address">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control required ref={inputRef} type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" isInvalid={!!errors.address} />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
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
                        <br />
                        <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewPackage;