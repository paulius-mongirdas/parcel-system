import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import Nav from "../components/Nav";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Item from "../components/Item";

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
    const navigate = useNavigate();
    const [lgShow, setLgShow] = useState(false);
    const [itemData, setItemData] = useState([]);

    const [refreshing, setRefresh] = useState(false);

    // openCenterList()
    const openItemInfo = useEffect(() => {
        axios.get(`http://localhost:3333/inventory/all`)
            .then(response => {
                console.log("Report response: ", response.data);
                const item = response.data.map((item: ItemData) => ({
                    id: item.id,
                    address: item.address,
                    city: item.city,
                    country: item.country,
                    postalCode: item.postalCode,
                    length: item.length,
                    width: item.width,
                    height: item.height,
                    weight: item.weight,
                    status: item.status,
                    createdAt: item.createdAt,
                    deliveredAt: item.deliveredAt,
                    price: item.price
                }));
                setItemData(item);
            })
            .catch(error => {
                console.error(error);
            });
    }, [navigate]);

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
            <Container className="d-flex align-items-center justify-content-center">
                <div style={{ overflowY: 'scroll', height: '100%' }}>
                    {itemData.map((item: ItemData, index) => (
                        <Item key={index} item={item} />
                    ))}
                </div>
            </Container>
        </>
    );
}
export default ViewInventory;