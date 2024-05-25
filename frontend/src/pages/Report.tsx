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
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { PDFViewer, Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';

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

const ViewReport = () => {
    const [refreshing, setRefresh] = useState(false);

    const [formData, setFormData] = useState<FilterData>({
        createdDateFrom: moment(Date.parse("2018-01-01T00:00:00.000Z")).toDate(),
        createdDateTo: moment(Date.now()).toDate(),

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
            if (response.data.length > 0)
                localStorage.setItem("Status", "Report generated Successfully"); // Set the flag
            else
                localStorage.setItem("Status", "No data found for the selected filters"); // Set the flag
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

    // Create styles
    const styles = StyleSheet.create({
        page: {
            backgroundColor: '#E4E4E4',
            padding: 10,
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
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
            {filteredData.length > 0 &&
                <PDFViewer style={{ width: "100%", height: "100vh" }}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View><Text style={{
                                        fontSize: 18,
                                        marginBottom: 16,
                                        textAlign: 'center',
                                    }}>Parcel report</Text></View>
                                    
                            <Table tdStyle={{ padding: '2px'}}>
                                <TH style={{ fontSize: 8 }}>
                                    <TD>Address</TD>
                                    <TD>City</TD>
                                    <TD>Country</TD>
                                    <TD>Postal Code</TD>
                                    <TD>Length</TD>
                                    <TD>Width</TD>
                                    <TD>Height</TD>
                                    <TD>Weight</TD>
                                    <TD>Status</TD>
                                    <TD>Created At</TD>
                                    <TD>Delivered At</TD>
                                    <TD>Price</TD>
                                </TH>
                                {filteredData.map((item: ItemData, index) => (
                                    <TR key={index} style={{ fontSize: 6 }}>
                                        <TD>{item.address}</TD>
                                        <TD>{item.city}</TD>
                                        <TD>{item.country}</TD>
                                        <TD>{item.postalCode}</TD>
                                        <TD>{item.length}</TD>
                                        <TD>{item.width}</TD>
                                        <TD>{item.height}</TD>
                                        <TD>{item.weight}</TD>
                                        <TD>{item.status}</TD>
                                        <TD>{moment(item.createdAt).format('YYYY-MM-DD')}</TD>
                                        <TD>{moment(item.deliveredAt).format('YYYY-MM-DD')}</TD>
                                        <TD>{item.price}</TD>
                                    </TR>
                                ))}
                            </Table>
                        </Page>
                    </Document>
                </PDFViewer>}
        </>
    );
}
export default ViewReport;