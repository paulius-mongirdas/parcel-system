import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Row, Card, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface ItemData {
    id: number;
    address: string;
    city: string;
    country: string;
    postalCode: string;

    length: number;
    width: number;
    height: number;
    weight: number;

    status: string;
    createdAt: Date;
    deliveredAt: Date;

    price: number;
}

interface ItemProps {
    item: ItemData;
}

enum Status {
    CREATED = "CREATED",
    IN_DELIVERY = "IN_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    NOT_DELIVERED = "NOT_DELIVERED",
}

const Item: React.FC<ItemProps> = ({ item }) => {
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [showCardOptions, setShowCardOptions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState({
        address: item.address,
        city: item.city,
        country: item.country,
        postalCode: item.postalCode,

        length: item.length,
        width: item.width,
        height: item.height,
        weight: item.weight,

        status: item.status,
        createdAt: item.createdAt,
        deliveredAt: item.deliveredAt,

        price: item.price
    });

    const [options, setOptions] = useState({
        componentRestrictions: { country: "" },
    });

    useEffect(() => {
        fetch(
            "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        )
            .then((response) => response.json())
            .then((data) => {
                setCountries(data.countries);
                // setOptions based on countries
                setOptions({
                    componentRestrictions: { country: (data.countries.find((country: any) => country.label === item.country) as any)?.value.toLowerCase() },
                })
            });
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("formData", formData);
    };

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [address, setAddress] = useState(item.address + ", " + item.postalCode + ", " + item.city);
    const [isValidAddress, setIsValidAddress] = useState(true);

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
                let postalCode = "";
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
                        console.log("postal code:", component.long_name);
                        postalCode = component.long_name;
                    }
                });
                if (city != "" && address != "" && number != "" && postalCode != "") {
                    setIsValidAddress(true);
                }
                else {
                    setIsValidAddress(false);
                }
                console.log("city", city, "address", address, "number", number, "postalCode", postalCode);
                setFormData({ ...formData, city: city, address: address + " " + number, country: formData.country, postalCode: postalCode});
            }
        });
    }, [autoCompleteRef.current]);

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.put('http://localhost:3333/inventory/update', {
                ...formData,
                id: +item.id,
                postalCode: formData.postalCode,
                length: +formData.length,
                width: +formData.width,
                height: +formData.height,
                weight: +formData.weight,
                price: +formData.price,
                createdAt: new Date(formData.createdAt),
                deliveredAt: new Date(formData.deliveredAt),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setShowCardDetails(false);
            localStorage.setItem("Status", "Center updated Successfully"); // Set the flag
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3333/inventory/delete/${item.id}`);
            console.log('Response from server:', response.data);
            setShowDeleteConfirm(false);
            localStorage.setItem("Status", "Item removed Successfully"); // Set the flag
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <>
            <Row>
                <Card style={{ width: '60rem', cursor: "pointer" }} onClick={() => setShowCardOptions(true)} >
                    <Card.Body>
                        <Card.Title>Item #{item.id}</Card.Title>
                        <Card.Text>
                            <b>Address:</b> {item.address} <br />
                            <b>City:</b> {item.city} <br />
                            <b>Country:</b> {item.country} <br />

                            <b>Length:</b> {item.length} <br />
                            <b>Width:</b> {item.width} <br />
                            <b>Height:</b> {item.height} <br />
                            <b>Weight:</b> {item.weight} <br />

                            <b>Status:</b> {item.status} <br />
                            <b>Created At:</b> {moment(item.createdAt).format('YYYY-MM-DD')} <br />
                            <b>Delivered At:</b> {moment(item.deliveredAt).format('YYYY-MM-DD')} <br />

                            <b>Price:</b> {item.price} <br />
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            <Modal
                size="lg"
                show={showCardOptions}
                onHide={() => setShowCardOptions(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Item #{item.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        <b>Address:</b> {item.address} <br />
                        <b>City:</b> {item.city} <br />
                        <b>Country:</b> {item.country} <br />

                        <b>Length:</b> {item.length} <br />
                        <b>Width:</b> {item.width} <br />
                        <b>Height:</b> {item.height} <br />
                        <b>Weight:</b> {item.weight} <br />

                        <b>Status:</b> {item.status} <br />
                        <b>Created At:</b> {moment(item.createdAt).format('YYYY-MM-DD')} <br />
                        <b>Delivered At:</b> {moment(item.deliveredAt).format('YYYY-MM-DD')} <br />

                        <b>Price:</b> {item.price} <br />
                    </Card.Text>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowCardDetails(true); setShowCardOptions(false) }}>
                        Edit
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowCardOptions(false); setShowDeleteConfirm(true) }}>
                        Remove
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={showCardDetails}
                onHide={() => setShowCardDetails(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Edit item #{item.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleItemSubmit}>
                        <Form.Group controlId="length">
                            <Form.Label>Length:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="length" defaultValue={item.length} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="width">
                            <Form.Label>Width:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="width" defaultValue={item.width} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="height">
                            <Form.Label>Height:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="height" defaultValue={item.height} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="weight">
                            <Form.Label>Weight:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="weight" defaultValue={item.weight} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={(countries.find((country: any) => country.label === item.country) as any)?.value} onChange={e => {
                                console.log("e.target.value", e.target.value);
                                // map country code to country name
                                setOptions({
                                    componentRestrictions: { country: e.target.value.toLowerCase() },
                                });
                                // might need to fix here
                                setFormData({ ...formData, country: (countries.find((country: any) => country.value === e.target.value) as any)?.label});

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
                                isInvalid={!isValidAddress} />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="status">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control required as="select" name="status" placeholder="Select status" defaultValue={item.status} onChange={handleTextChange}>
                                <option value={Status.CREATED}>Created</option>
                                <option value={Status.IN_DELIVERY}>In Delivery</option>
                                <option value={Status.DELIVERED}>Delivered</option>
                                <option value={Status.CANCELED}>Canceled</option>
                                <option value={Status.NOT_DELIVERED}>Not Delivered</option>
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="price">
                            <Form.Label>Price:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="price" defaultValue={item.price} placeholder="Enter price" onChange={handleTextChange} />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="createdAt">
                            <Form.Label>Created At:</Form.Label>
                            <Form.Control required type="date" name="createdAt" defaultValue={moment(new Date(item.createdAt)).format('YYYY-MM-DD')} placeholder="Enter created at" onChange={handleTextChange} />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="deliveredAt">
                            <Form.Label>Delivered At:</Form.Label>
                            <Form.Control required type="date" name="deliveredAt" defaultValue={moment(new Date(item.deliveredAt)).format('YYYY-MM-DD')} placeholder="Enter delivered at" onChange={handleTextChange} />
                        </Form.Group>
                        <Button variant="success" className="float-right" style={{ height: '35px' }} type="submit">
                            Save changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Item #{item.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        Are you sure you want to delete <b>item #{item.id}</b>?
                    </Card.Text>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { handleDelete(); setShowDeleteConfirm(false) }}>
                        Confirm
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowDeleteConfirm(false) }}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Item;