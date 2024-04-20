import { Row, Card } from "react-bootstrap";

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
                        <Card.Link href="#">Edit transport</Card.Link>
                        <Card.Link href="#">Remove transport</Card.Link>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
};

export default Transport;