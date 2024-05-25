import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Button, Col, Row } from "react-bootstrap";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Item from "../components/Item";
import Form from 'react-bootstrap/Form';
import moment from "moment";

enum Status {
    CREATED = "CREATED",
    IN_DELIVERY = "IN_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    NOT_DELIVERED = "NOT_DELIVERED",
}

interface FilterData {
    createdDateFrom: Date;
    createdDateTo: Date;
    deliveredDateFrom: Date;
    deliveredDateTo: Date;

    status: string[];
    priceFrom: number;
    priceTo: number;
    weightFrom: number;
    weightTo: number;
}

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
const showToastMessage = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

const ViewInventory = () => {
    const [refreshing, setRefresh] = useState(false);

    const [formData, setFormData] = useState<FilterData>({
        createdDateFrom: moment(Date.parse("2018-01-01T00:00:00.000Z")).toDate(),
        createdDateTo: moment(Date.now()).toDate(),
        deliveredDateFrom: moment(Date.parse("2018-01-01T00:00:00.000Z")).toDate(),
        deliveredDateTo: moment(Date.now()).toDate(),

        status: [Status.CREATED, Status.IN_DELIVERY, Status.DELIVERED, Status.CANCELED, Status.NOT_DELIVERED],
        priceFrom: 0,
        priceTo: 1000,
        weightFrom: 0,
        weightTo: 10000
    });

    const [filteredData, setFilteredData] = useState([]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, status: [...formData.status, name] });
        } else {
            setFormData({ ...formData, status: formData.status.filter((status) => status !== name) });
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // getFilterData()
    const handleFilterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.post('http://localhost:3333/inventory/report', {
                ...formData,
                createdDateFrom: new Date(formData.createdDateFrom),
                createdDateTo: new Date(formData.createdDateTo),
                deliveredDateFrom: new Date(formData.deliveredDateFrom),
                deliveredDateTo: new Date(formData.deliveredDateTo),
                status: formData.status,
                priceFrom: +formData.priceFrom,
                priceTo: +formData.priceTo,
                weightFrom: +formData.weightFrom,
                weightTo: +formData.weightTo
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response from server:', response.data);
            setFilteredData(response.data);
            //setRefresh(true);
            localStorage.setItem("Status", "Report generated Successfully"); // Set the flag
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    }

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
            <Form onSubmit={handleFilterSubmit}>
                <div style={{ padding: '10px' }}>
                    <header>
                        <h4>Select filters for parcel report</h4>
                    </header>
                    <hr></hr>
                    <Row>
                        <Col xs="auto">
                            <Form.Group controlId="createdDateFrom">
                                <Form.Label>Created Date From</Form.Label>
                                <Form.Control required type="date" name="createdDateFrom" onChange={handleTextChange} defaultValue={moment(Date.parse("2018-01-01T00:00:00.000Z")).format('YYYY-MM-DD')} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="createdDateTo">
                                <Form.Label>Created Date To</Form.Label>
                                <Form.Control required type="date" name="createdDateTo" onChange={handleTextChange} defaultValue={moment(Date.now()).format('YYYY-MM-DD')} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="deliveredDateFrom">
                                <Form.Label>Delivered Date From</Form.Label>
                                <Form.Control required type="date" name="deliveredDateFrom" onChange={handleTextChange} defaultValue={moment(Date.parse("2018-01-01T00:00:00.000Z")).format('YYYY-MM-DD')} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="deliveredDateTo">
                                <Form.Label>Delivered Date To</Form.Label>
                                <Form.Control required type="date" name="deliveredDateTo" onChange={handleTextChange} defaultValue={moment(Date.now()).format('YYYY-MM-DD')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Form.Group controlId="status">
                        <Form.Label >Status</Form.Label>
                        <br></br>
                        {Object.values(Status).map((status, index) => (
                            <Form.Check inline type="checkbox" key={index} name={status} label={status} defaultChecked={true} onChange={handleStatusChange} />
                        ))}
                    </Form.Group>
                    <hr></hr>
                    <Row>
                        <Col xs="auto">
                            <Form.Group controlId="priceFrom">
                                <Form.Label>Price From</Form.Label>
                                <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="priceFrom" onChange={handleTextChange} defaultValue={0} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="priceTo">
                                <Form.Label>Price To</Form.Label>
                                <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="priceTo" onChange={handleTextChange} defaultValue={1000} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="weightFrom">
                                <Form.Label>Weight From</Form.Label>
                                <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="weightFrom" onChange={handleTextChange} defaultValue={0} />
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="weightTo">
                                <Form.Label>Weight To</Form.Label>
                                <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="weightTo" onChange={handleTextChange} defaultValue={10000} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Button variant="success" type="submit" className="float-right" style={{ height: '35px' }}>
                        Generate report
                    </Button>
                </div>
            </Form>
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                    {filteredData.map((item: ItemData, index) => (
                        <Item key={index} item={item} />
                    ))}
                </div>
            </Container>
        </>
    );
}
export default ViewInventory;