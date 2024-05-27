import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Card, Button, Form, Modal, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";

interface TransportData {
    id: number;
    type: string;
    capacity: number;
    averageSpeed: number;
    centerId: number;
}

interface CenterData {
    id: number;
    capacity: number;
    address: string;
    city: string;
    country: string;
}

interface TransportProps {
    transport: TransportData;
}

const Transport: React.FC<TransportProps> = ({ transport }) => {
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [showCardOptions, setShowCardOptions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [centerList, setCenterList] = useState([]);
    const [centerData, setCenterData] = useState<CenterData>({
        id: 0,
        capacity: 0,
        address: "",
        city: "",
        country: ""
    });
    const [formData, setFormData] = useState({
        type: transport.type,
        capacity: transport.capacity,
        averageSpeed: transport.averageSpeed,
        centerId: transport.centerId,
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTransportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.put('http://localhost:3333/transport/update', {
                ...formData,
                id: +transport.id,
                type: formData.type,
                capacity: +formData.capacity,
                averageSpeed: +formData.averageSpeed,
                centerId: formData.centerId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setShowCardDetails(false);
            localStorage.setItem("Status", "Transport updated Successfully"); // Set the flag
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3333/transport/delete/${transport.id}`);
            console.log('Response from server:', response.data);
            setShowDeleteConfirm(false);
            localStorage.setItem("Status", "Transport removed Successfully"); // Set the flag
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    }

    const getCenterList = useEffect(() => {
        console.log("Getting center list..");
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
                setCenterList(center);
                // find center data and set it as CenterData type instead of any
                const centerData = center.find((center: CenterData) => center.id === transport.centerId) as CenterData;
                setCenterData(centerData);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    return (
        <>
            <Row>
                <Card style={{ width: '60rem', cursor: "pointer" }} onClick={() => setShowCardOptions(true)} >
                    <Card.Body>
                        <Card.Title>Transport #{transport.id}</Card.Title>
                        <Card.Text>
                            <b>Type:</b> {transport.type} <br />
                            <b>Capacity:</b> {transport.capacity} <br />
                            <b>Average speed:</b> {transport.averageSpeed} <br />
                            <b>Center:</b> {centerData !== undefined ? `#${centerData.id}, ${centerData.address}, ${centerData.city}, ${centerData.country}` : "None"}
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
                        Transport #{transport.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        <b>Type:</b> {transport.type} <br />
                        <b>Capacity:</b> {transport.capacity} <br />
                        <b>Average speed:</b> {transport.averageSpeed} <br />
                        <b>Center:</b> {centerData !== undefined ? `#${centerData.id}, ${centerData.address}, ${centerData.city}, ${centerData.country}` : "None"}
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
                        Edit transport #{transport.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTransportSubmit}>
                        <Form.Group controlId="type">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={transport.type}
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
                        </Form.Group>
                        <br />
                        <Form.Group controlId="capacity">
                            <Form.Label>Capacity:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="capacity" defaultValue={transport.capacity} placeholder="Enter capacity" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="averageSpeed">
                            <Form.Label>Average speed:</Form.Label>
                            <Form.Control required type="number" pattern="[0-9]*" min={0} inputMode="numeric" name="averageSpeed" defaultValue={transport.averageSpeed} placeholder="Enter average speed" onChange={handleTextChange} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="center">
                            <Form.Label>Center:</Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={transport.centerId}
                                name="center"
                                onChange={e => {
                                    console.log("e.target.value", e.target.value);
                                    setFormData({ ...formData, centerId: Number(e.target.value) });
                                }}
                            >
                                <option value="-1">None</option>
                                {centerList.map((center: CenterData, index) => (
                                    <option key={index} value={center.id}>#{center.id}, {center.address}, {center.city}, {center.country}</option>
                                ))}
                            </Form.Control>
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
                        Transport #{transport.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        Are you sure you want to delete <b>transport #{transport.id}</b>?
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


export default Transport;