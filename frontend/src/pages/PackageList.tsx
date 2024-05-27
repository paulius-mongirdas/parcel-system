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
import { count } from "console";

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
    const [ShowPriceSelection, setShowPriceSelection] = useState(false);
    const [regularPricing, setRegularPricing] = useState(0);
    const [fastDeliveryPricing, setfastDeliveryPricing] = useState(0);
    const [sameDayPricing, setSameDayPricing] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [ShowPriceLoading, setShowPriceLoading] = useState(false);
    const [ShowUnavailable, setShowUnavailable] = useState(false);

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
    
    // openCenterList()
    const openCenterList = useEffect(() => { 
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
    
    // openPackageList()
    const openPackageList = useEffect(() => {
        axios.get(`http://localhost:3333/package/all`) // select()
            .then(response => {
                setPackageData(response.data); // packages
            })
            .catch(error => {
                console.error(error);
            });
    }, [refreshing]);

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
    
        console.log('Form data:', formData);
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
                price: +finalPrice
            }, {
                headers: { 'Content-Type': 'application/json' },
            }); // 10. updatePackage()
    
            setLgShow(false);
            window.location.reload();
            console.log('Response from server:', response.data);
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

    const calculatePrice = async () => {
        if (!formData.address || !formData.city || !formData.country || !formData.postalCode) {
            setErrors({ address: 'Address, city, country and postal code fields are required.' });
            return;
        }

        try {
            setShowPriceLoading(true);
            const latilong = await getLatLngFromAddress(formData.address);
            const distance = await getDistances(latilong);
            console.log('LatLng:', latilong);
            console.log('Distances:', distance);
            console.log('FormData:', formData);
            const response = await axios.get(`http://localhost:3333/package/calculatePrice`, {
                params: {
                    ...formData,
                    country: formData.country,
                    distance: distance[0].distance,
                    weight: +formData.weight,
                    length: +formData.length,
                    width: +formData.width,
                    height: +formData.height
                }
            });
            console.log("Response:", response)
            setRegularPricing(response.data[0].toFixed(2));
            setfastDeliveryPricing(response.data[1].toFixed(2));
            setSameDayPricing(response.data[2].toFixed(2));
            setShowPriceLoading(false);
            setShowPriceSelection(true);
            console.log('Response from server:', response.data);
            // setFormData({ ...formData, price: response.data });
        } catch (error) {
            console.error('Error submitting post:', error);
            setShowPriceLoading(false);
            setShowUnavailable(true);
        }
    }

    const handlePriceSelect = (price: number) => {
        setFinalPrice(price);
        console.log("Form submitted with price:", price);
      };

    return (
        <>
            <Nav />
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register parcel</Button>

            {/* show packages */}
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
                    <Form>
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
                        {/* <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                            Create
                        </Button> */}
                        <Button variant="primary" className="float-right" style={{ height: '35px' }} onClick={function () { calculatePrice() }}>
                            Get prices
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={ShowPriceSelection}
                onHide={() => setShowPriceSelection(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select a Price</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePackageSubmit}>
                        <p>Please select one of the following prices:</p>
                            <div className="d-flex justify-content-around">
                            <Button variant="outline-primary" type="submit" className="mb-2" onClick={function () { handlePriceSelect(regularPricing) }}>
                            {regularPricing}€
                            <div style={{ fontSize: '12px', color: '#555' }}>Delivered in 3-5 business days</div>
                            </Button>
                            <Button variant="outline-primary" type="submit" className="mb-2" onClick={function () { handlePriceSelect(fastDeliveryPricing) }}>
                            {fastDeliveryPricing}€
                            <div style={{ fontSize: '12px', color: '#555' }}>Delivered in 1-2 business days</div>
                            </Button>
                            <Button variant="outline-primary" type="submit" className="mb-2" onClick={function () { handlePriceSelect(sameDayPricing) }}>
                            {sameDayPricing}€
                            <div style={{ fontSize: '12px', color: '#555' }}>Delivered by the end of the day</div>
                            </Button>
                            </div>
                        </Form>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={ShowPriceLoading}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <Modal.Title>Calculating prices, please wait...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowPriceLoading(false) }}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={ShowUnavailable}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <Modal.Title>{"Sorry, we currently do not ship to this location."}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowUnavailable(false) }}>
                        Okay
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewPackage;
