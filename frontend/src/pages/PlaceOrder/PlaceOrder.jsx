import React, { useEffect, useState, useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const buildOrderItems = () => {
    const items = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const itemInfo = { ...item, quantity: cartItems[item._id] };
        items.push(itemInfo);
      }
    });
    return items;
  };

  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input className='emaill' required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input className='streett' required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input className='phonee' required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
   <PayPalButtons
     style={{ layout: "vertical" }}
     createOrder={async () => {
       try {
         const res = await axios.post(
           `${url}/api/order/create-paypal-order`, // Ensure this URL is correct and reachable
           { amount: getTotalCartAmount() + 2 }, // Ensure correct calculation of amount
           { headers: { token } }
         );
         return res.data.id; // This is the PayPal order ID
       } catch (err) {
         console.error("Error during PayPal order creation:", err);
         alert("Error while creating PayPal order.");
         return null; // Return null if error occurs to prevent further payment
       }
     }}
     onApprove={async (data) => {
       try {
         const orderItems = buildOrderItems();
         const orderPayload = {
           orderId: data.orderID,
           userId: token,
           items: orderItems,
           amount: getTotalCartAmount() + 2,
           address: data, // Address data from PayPal
         };
         const res = await axios.post(
           `${url}/api/order/capture-paypal-order`, orderPayload,
           { headers: { token } }
         );

         if (res.data.success) {
           alert("Payment successful! Order placed.");
           navigate("/myorders");
         } else {
           alert("Order failed after payment.");
         }
       } catch (err) {
         console.error("Error during PayPal approval:", err);
         alert("Something went wrong during approval.");
       }
     }}
     onError={(err) => {
       console.error("PayPal error:", err);
       alert("Something went wrong with PayPal.");
     }}
   />
</PayPalScriptProvider>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
