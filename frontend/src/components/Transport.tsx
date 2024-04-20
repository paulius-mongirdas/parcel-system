import axios from "axios";
import { useState } from "react";
import { Row, Card, Button, Form, Modal } from "react-bootstrap";

interface TransportData {
    id: number;
    type: string;
    capacity: number;
    averageSpeed: number;
}

interface TransportProps {
    transport: TransportData;
}

const Transport: React.FC<TransportProps> = ({ transport }) => {
    const [lgShow, setLgShow] = useState(false);
    const [formData, setFormData] = useState({
        type: transport.type,
        capacity: transport.capacity,
        averageSpeed: transport.averageSpeed
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
                averageSpeed: +formData.averageSpeed
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response from server:', response.data);
            setLgShow(false);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };
    return (
        <>
            <Row>
                <Card style={{ width: '60rem' }}>
                    <Card.Body>
                        <Card.Title>Transport #{transport.id}</Card.Title>
                        <Card.Text>
                            <b>Type:</b> {transport.type} <br />
                            <b>Capacity:</b> {transport.capacity} <br />
                            <b>Average speed:</b> {transport.averageSpeed} <br />
                        </Card.Text>
                        <Card.Link href="#" onClick={()=>setLgShow(true)}>Edit transport</Card.Link>
                        <Card.Link href="#">Remove transport</Card.Link>
                    </Card.Body>
                </Card>
            </Row>

            <Modal
                    size="lg"
                    show={lgShow}
                    onHide={() => setLgShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Edit transport #{transport.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="postText">
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
                            <br />
                            <Form.Label>Capacity:</Form.Label>
                            <Form.Control type="number" name="capacity" defaultValue={transport.capacity} placeholder="Enter capacity" onChange={handleTextChange} />
                            <br />
                            <Form.Label>Average speed:</Form.Label>
                            <Form.Control type="number" name="averageSpeed" defaultValue={transport.averageSpeed} placeholder="Enter average speed" onChange={handleTextChange}/>
                        </Form.Group>
                        <br></br>
                        <Button variant="success" className="float-right" style={{ height: '35px' }} onClick={handleTransportSubmit}>
                            Save changes
                        </Button>
                    </Modal.Body>
                </Modal>
        </>
    );
};


export default Transport;