import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            console.log("Fetched Orders:", response.data.data); // Debugging
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2 className='myordersp'>My Orders</h2>
            <div className="container">
                {data.length > 0 ? (
                    data.map((order, index) => (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <p>
                                {order.items.map((item, idx) => (
                                    <span key={idx}>
                                        {item.name} x {item.quantity}
                                        {idx !== order.items.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={() => fetchOrders()}>Track Order</button>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
