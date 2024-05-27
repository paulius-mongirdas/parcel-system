import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Card, Button, Form, Modal, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";

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

interface PackageProps {
    parcel: PackageData;
}

enum Status {
    CREATED = 'CREATED',
    IN_DELIVERY = 'IN_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
    NOT_DELIVERED = 'NOT_DELIVERED'
}

const Package: React.FC<PackageProps> = ({ parcel }) => {
    const [showCardOptions, setShowCardOptions] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const [formData, setFormData] = useState({
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
    
    const handleCancel = async () => {
        try {
            const response = await axios.put(`http://localhost:3333/package/update`, {
                ...parcel,
                status: Status.CANCELED
            });
            console.log('Response from server:', response.data);
            setShowCardOptions(false);
            localStorage.setItem("Status", "Parcel canceled Successfully"); // Set the flag
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
                        <Card.Title>Parcel #{parcel.id}</Card.Title>
                        <Card.Text>
                            <b>Address:</b> {parcel.address} <br />
                            <b>City:</b> {parcel.city} <br />
                            <b>Country:</b> {parcel.country} <br />
                            <b>Postal code:</b> {parcel.postalCode} <br />
                            <b>Length:</b> {parcel.length} <br />
                            <b>Width:</b> {parcel.width} <br />
                            <b>Height:</b> {parcel.height} <br />
                            <b>Weight:</b> {parcel.weight} <br />
                            <b>Status:</b> {parcel.status} <br />
                            <b>Created at:</b> {parcel.createdAt.toString().split('T')[0] +
                                                ' ' +
                                                parcel.createdAt.toString().split('T')[1].split('.')[0]} <br />
                            <b>Delivered at:</b> {parcel.deliveredAt.toString().split('T')[0] +
                                                ' ' +
                                                parcel.deliveredAt.toString().split('T')[1].split('.')[0]} <br />
                            <b>Price:</b> {parcel.price} <br />
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
                        Parcel #{parcel.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        <b>Address:</b> {parcel.address} <br />
                        <b>City:</b> {parcel.city} <br />
                        <b>Country:</b> {parcel.country} <br />
                        <b>Postal code:</b> {parcel.postalCode} <br />
                        <b>Length:</b> {parcel.length} <br />
                        <b>Width:</b> {parcel.width} <br />
                        <b>Height:</b> {parcel.height} <br />
                        <b>Weight:</b> {parcel.weight} <br />
                        <b>Status:</b> {parcel.status} <br />
                        <b>Created at:</b> {parcel.createdAt.toString().split('T')[0] +
                                            ' ' +
                                            parcel.createdAt.toString().split('T')[1].split('.')[0]} <br />
                        <b>Delivered at:</b> {parcel.deliveredAt.toString().split('T')[0] +
                                            ' ' +
                                            parcel.deliveredAt.toString().split('T')[1].split('.')[0]} <br />
                        <b>Price:</b> {parcel.price} <br />
                    </Card.Text>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowCardOptions(false); setShowCancelConfirm(true) }}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                show={showCancelConfirm}
                onHide={() => setShowCancelConfirm(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Parcel #{parcel.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Text>
                        Are you sure you want to cancel <b>parcel #{parcel.id}</b>?
                    </Card.Text>
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { handleCancel(); setShowCancelConfirm(false) }}>
                        Confirm
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="primary" style={{ height: '35px' }} onClick={function () { setShowCancelConfirm(false) }}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};


export default Package;