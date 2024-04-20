import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import { Row } from "react-bootstrap";
import axios from 'axios';
import Transport from "../components/Transport";

// import the notes controller for postingNotes and fetching all notes
//import { getAllTransport } from "../../../backend/src/controllers/Car/CarController";

interface TransportData {
    id: number;
    type: string;
    capacity: number;
    averageSpeed: number;
}

const ViewTransport = () => {
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);

    const [transportData, setTransportData] = useState([]);
    const [formData, setFormData] = useState({
        text: '',
    });
    const [type, setType]: any = useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        axios.get(`http://localhost:3333/transport/all`)
            .then(response => {
                console.log("Report response: ", response.data);
              const transport = response.data.map((transport: TransportData) => ({
                id: transport.id,
                type: transport.type,
                capacity: transport.capacity,
                averageSpeed: transport.averageSpeed
              }));
              setTransportData(transport);
            })
            .catch(error => {
              console.error(error);
            });
    }, [navigate]);
    return (
        <>
            <Nav />
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register transport</Button>
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                    {transportData.map((transport: TransportData, index) => (
                        <Transport key={index} transport={transport} />
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
                        Register new transport
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="postText">
                        <Form.Label>Type:</Form.Label>
                        <Form.Control
                            as="select"
                            value={type}
                            onChange={e => {
                                console.log("e.target.value", e.target.value);
                                setType(e.target.value);
                            }}
                        >
                            <option value="vietinis_furgonas">Local van</option>
                            <option value="ilgos_keliones_furgonas">Long journey van</option>
                            <option value="vilkikas">Truck</option>
                        </Form.Control>
                        <br />
                        <Form.Label>Capacity:</Form.Label>
                        <Form.Control type="number" placeholder="Enter capacity" onChange={handleTextChange} />
                        <br />
                        <Form.Label>Average speed:</Form.Label>
                        <Form.Control type="number" placeholder="Enter average speed" onChange={handleTextChange} />
                    </Form.Group>
                    <br></br>
                    <Button variant="success" className="float-right" style={{ height: '35px' }}>
                        Register
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}
function demoTruck() {
    return (
        <>
            <Row>
                <Card style={{ width: '60rem' }}>
                    <Card.Body>
                        <Card.Title>Demo truck</Card.Title>
                        <Card.Text>
                            Demo truck description
                        </Card.Text>
                        <Card.Link href="#">Edit transport</Card.Link>
                        <Card.Link href="#">Remove transport</Card.Link>
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
}
export default ViewTransport;