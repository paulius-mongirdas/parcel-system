import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';

function ViewTransport() {
    const [nav, setNav] = useState<JSX.Element | undefined>(undefined);
    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);

    const [formData, setFormData] = useState({
        text: '',
    });
    const [type, setType]: any = useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        setNav(<Nav />);
    })
    return (
        <>
            {nav}
            <Button onClick={() => setLgShow(true)} style={{ margin: '15px' }}>Register transport</Button>

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

export default ViewTransport;