import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

interface TransportData {
    id: number;
    type: string;
    capacity: number; // volume capacity
    weight: number; // weight capacity
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
    centerId: number;
    transportId?: number;
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

const sortPackages = async (transport: TransportData, centerAddress: string, packages: PackageData[]): Promise<PackageData[]> => {
    try {
        const response = await axios.post(`http://localhost:3333/route/sort-packages`, { transport, centerAddress, packages });
        return response.data.acceptedPackages;
    } catch (error) {
        console.error('Error sorting packages:', error);
        throw new Error('Error sorting packages');
    }
};

const Transports = () => {
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const [transportData, setTransportData] = useState<TransportData[]>([]);
    const [centerData, setCenterData] = useState<CenterData[]>([]);
    const [packageData, setPackageData] = useState<PackageData[]>([]);
    const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
    const [selectedTransport, setSelectedTransport] = useState<TransportData | null>(null);
    const [refreshing, setRefresh] = useState(false);

    const [formData, setFormData] = useState({
        type: 'local van',
        capacity: 0,
        weight: 0,
        averageSpeed: 0,
        centerId: -1,
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //1.
    const showCarList = () => {
        axios.get(`http://localhost:3333/transport/all`)
            .then(response => {
                console.log("Report response: ", response.data);
                const transport = response.data.map((transport: TransportData) => ({
                    id: transport.id,
                    type: transport.type,
                    capacity: transport.capacity,
                    weight: transport.weight,
                    averageSpeed: transport.averageSpeed,
                    centerId: transport.centerId
                }));
                setTransportData(transport);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        showCarList();
    }, [navigate]);

    // Fetch center data
    useEffect(() => {
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
                setCenterData(center);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // Success messages
    useEffect(() => {
        if (localStorage.getItem("Status") && document.readyState === 'complete' && !refreshing) {
            const message = localStorage.getItem("Status") || "";
            showToastMessage(message); 
            localStorage.removeItem("Status"); 
            setRefresh(false);
        }
    });

    const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCenter(Number(e.target.value));
    };

    const filterCars = () => {
        if (selectedCenter !== null) {
            axios.get(`http://localhost:3333/transport/filtered/${selectedCenter}`)
                .then(response => {
                    console.log("Filtered transport response: ", response.data);
                    const filteredTransports = response.data.map((transport: TransportData) => ({
                        id: transport.id,
                        type: transport.type,
                        capacity: transport.capacity,
                        weight: transport.weight,
                        averageSpeed: transport.averageSpeed,
                        centerId: transport.centerId
                    }));
                    setTransportData(filteredTransports);
                })
                .catch(error => {
                    console.error(error);
                });

            axios.get(`http://localhost:3333/package/all/${selectedCenter}`)
                .then(response => {
                    console.log("Filtered package response: ", response.data);
                    const filteredPackages = response.data.map((pkg: PackageData) => ({
                        id: pkg.id,
                        address: pkg.address,
                        city: pkg.city,
                        country: pkg.country,
                        postalCode: pkg.postalCode,
                        length: pkg.length,
                        width: pkg.width,
                        height: pkg.height,
                        weight: pkg.weight,
                        status: pkg.status,
                        createdAt: pkg.createdAt,
                        deliveredAt: pkg.deliveredAt,
                        price: pkg.price,
                        centerId: pkg.centerId
                    }));
                    setPackageData(filteredPackages);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const getCenterDetails = (centerId: number) => {
        return centerData.find(center => center.id === centerId);
    };

    const selectCar = (transport: TransportData) => {
        setSelectedTransport(transport);
        setLgShow(true);
    };

    const handleModalClose = () => {
        setLgShow(false);
        setSelectedTransport(null);
    };

    const handleYesClick = async () => {
        if (selectedTransport) {
            const centerDetails = getCenterDetails(selectedTransport.centerId);
            const centerAddress = centerDetails ? `${centerDetails.address}, ${centerDetails.city}, ${centerDetails.country}` : "";
    
            try {
                const acceptedPackages = await sortPackages(selectedTransport, centerAddress, packageData);
                console.log("Accepted Packages:", acceptedPackages);
    
                setPackageData(packageData.map(pkg => {
                    const acceptedPkg = acceptedPackages.find(p => p.id === pkg.id);
                    return acceptedPkg ? { ...pkg, transportId: selectedTransport.id } : pkg;
                }));
    
                if (acceptedPackages.length > 0) {
                    const updatePromises = acceptedPackages.map(pkg =>
                        axios.put(`http://localhost:3333/package/updatee/${pkg.id}`, { transportId: selectedTransport.id })
                    );
    
                    await Promise.all(updatePromises);
    
                    setLgShow(false);
                    setSelectedTransport(null);
                    showToastMessage("Packages sorted into the selected transport!");
                } else {
                    showToastMessage("No packages could be sorted into the selected transport based on the criteria.");
                }
            } catch (error) {
                console.error('Error sorting packages:', error);
                showToastMessage("An error occurred while sorting packages.");
            }
        }
    };

    return (
        <>
            <Nav />
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', height: '100%' }}>
                    <Form>
                        <Form.Group controlId="centerSelect">
                            <Form.Label>Select Center</Form.Label>
                            <Form.Select onChange={handleCenterChange}>
                                <option value="">Select a center</option>
                                {centerData.map((center) => (
                                    <option key={center.id} value={center.id}>
                                        {center.id}, {center.city}, {center.country}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" onClick={filterCars}>
                            Filter
                        </Button>
                    </Form>
                    {transportData.map((transport: TransportData) => (
                        <Row key={transport.id}>
                            <Card style={{ width: '60rem', cursor: "pointer" }} onClick={() => selectCar(transport)}>
                                <Card.Body>
                                    <Card.Title>Transport #{transport.id}</Card.Title>
                                    <Card.Text>
                                        <b>Type:</b> {transport.type} <br />
                                        <b>Capacity:</b> {transport.capacity} <br />
                                        <b>Weight:</b> {transport.weight}<br />
                                        <b>Average speed:</b> {transport.averageSpeed} <br />
                                        <b>Center:</b> {
                                            getCenterDetails(transport.centerId) 
                                            ? `#${getCenterDetails(transport.centerId)?.id}, ${getCenterDetails(transport.centerId)?.address}, ${getCenterDetails(transport.centerId)?.city}, ${getCenterDetails(transport.centerId)?.country}`
                                            : "None"
                                        }
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                    ))}
                </div>
            </Container>

            <Modal show={lgShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Packages</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you want to sort packages into this transport?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleYesClick}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}

export default Transports;
