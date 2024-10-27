// PaymentSuccess.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from "../config"; 

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        const orderId = localStorage.getItem("orderID");
    
        if (orderId) {
            handleAccept(orderId); 
        }
    }, [location]);
    

    const handleAccept = async (orderId) => {
        const storedToken = localStorage.getItem("token");
        const hotelId = localStorage.getItem("userID");

        const apiUrl = API_ENDPOINT.CONFIRM_order_hotel.replace(":hotel_id", hotelId).replace(":order_id", orderId);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to accept order");

            localStorage.removeItem("orderID");
        } catch (error) {
            console.error("Error accepting order:", error);
            alert("Order acceptance failed.");
        }
    };

    const handleNavigate = () => {
        navigate('/PendingPayment', { replace: true });
    };

    return (
        <div style={{display: "grid", justifyContent: "center", alignContent: "center", height: "80vh"}}>
            <h1 style={{textAlign: "center", color: "green", margin: "0"}}>Payment Successfully!</h1>
            <p>Your payment has been processed successfully.</p>
            <button style={{width: "380px"}} onClick={handleNavigate}>Go Back to Website</button>
        </div>
    );
};

export default PaymentSuccess;
