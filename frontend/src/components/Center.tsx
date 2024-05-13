import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Card, Button, Form, Modal, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface CenterData {
    id: number;
    capacity: number;
    address: string;
    city: string;
    country: string;

}

interface CenterProps {
    center: CenterData;
}

const Center: React.FC<CenterProps> = ({ center }) => {
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [showCardOptions, setShowCardOptions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        capacity: center.capacity,
        address: center.address,
        city: center.city,
        country: center.country
    });

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

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCenterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.put('http://localhost:3333/center/update', {
                ...formData,
                id: +center.id,
                capacity: +formData.capacity,
                address: formData.address,
                city: formData.city,
                country: formData.country
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
            const response = await axios.delete(`http://localhost:3333/center/delete/${center.id}`);
            console.log('Response from server:', response.data);
            setShowDeleteConfirm(false);
            localStorage.setItem("Status", "Center removed Successfully"); // Set the flag
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    }
    return (
        <>
            <Row>
                <Card style={{ width: '60rem', cursor: "pointer" }} onClick={() => setShowCardOptions(true)} >
                    <Card.Body>
                        <Card.Title>Center #{center.id}</Card.Title>
                        <Card.Text>
                            <b>Capacity:</b> {center.capacity} <br />
                            <b>Address:</b> {center.address} <br />
                            <b>City:</b> {center.city} <br />
                            <b>Country:</b> {center.country} <br />
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
                        Center #{center.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        <b>Capacity:</b> {center.capacity} <br />
                        <b>Address:</b> {center.address} <br />
                        <b>City:</b> {center.city} <br />
                        <b>Country:</b> {center.country} <br />
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
                        Edit center #{center.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCenterSubmit}>
                        <Form.Group controlId="capacity">
                            <Form.Label>Capacity:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="capacity" defaultValue={center.capacity} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="country">
                            <Form.Label>Country:</Form.Label>
                            <Form.Control required as="select" name="country" placeholder="Select country" defaultValue={(countries.find((country: any) => country.label === center.country) as any)?.value} onChange={e => {
                                console.log("e.target.value", e.target.value);
                                // map country code to country name
                                setFormData({ ...formData, country: (countries.find((country: any) => country.value === e.target.value) as any)?.label});
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
                                    // map country name to code
                                    // show default address
                                    componentRestrictions: { country: (countries.find((country: any) => country.label === formData.country) as any)?.value}, 
                                    types: ["route", "street_number"]
                                    // TODO : validation for address
                                }}
                                selectProps={{
                                    defaultInputValue: `${center.address}, ${center.city}`,
                                    onChange: (newValue) => {
                                        setFormData({ ...formData, address: newValue?.value?.description.split(',')[0], city: newValue?.value?.description.split(',')[1]});
                                        console.log('Address:', formData.address);
                                        console.log('City:', formData.city);
                                    },
                                }}
                                
                            />
                        </Form.Group>
                        <br></br>
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
                        Center #{center.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        Are you sure you want to delete <b>center #{center.id}</b>?
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
};


export default Center;