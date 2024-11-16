import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import CartSummary from './CartSummary';
import Map from './Map';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    address: '',
    apartmentNumber: '',
    phone: '',
    location: { lat: 51.154, lng: 16.9305 }, // Default location
    isAddressManual: false,
  });

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [outOfDeliveryZone, setOutOfDeliveryZone] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState(null);

  const MIN_ORDER_AMOUNT = 20;

  // Fetch delivery radius from backend
  useEffect(() => {
    const fetchDeliveryRadius = async () => {
      try {
        const response = await axios.get(`${url}/api/settings/get-delivery-radius`);
        if (response.data.success) {
          setDeliveryRadius(response.data.deliveryRadius);
        } else {
          console.error('Failed to fetch delivery radius:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching delivery radius:', error);
      }
    };

    fetchDeliveryRadius();
  }, [url]);

  // Calculate delivery charge
  const calculateDeliveryCharge = (lat, lng) => {
    if (deliveryRadius === null) return;

    const deliveryCenter = { lat: 51.154, lng: 16.9305 };
    const distance = getDistanceFromLatLonInKm(deliveryCenter.lat, deliveryCenter.lng, lat, lng);

    if (distance <= deliveryRadius) {
      setDeliveryCharge(0);
      setOutOfDeliveryZone(false);
    } else {
      setDeliveryCharge(null);
      setOutOfDeliveryZone(true);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const totalAmount = getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge;

    if (!token) {
      alert('Proszę się zalogować, aby złożyć zamówienie.');
      navigate('/login');
      return;
    }

    if (getTotalCartAmount() === 0) {
      alert('Twój koszyk jest pusty.');
      return;
    }

    if (totalAmount < MIN_ORDER_AMOUNT) {
      alert(`Minimalna kwota zamówienia to ${MIN_ORDER_AMOUNT} PLN.`);
      return;
    }

    if (outOfDeliveryZone) {
      alert('Adres dostawy znajduje się poza стrefой dostав.');
      return;
    }

    const orderItems = food_list
      .map((item) => {
        if (cartItems[item._id] > 0) {
          return {
            ...item,
            quantity: cartItems[item._id],
          };
        }
        return null;
      })
      .filter(Boolean);

    const orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
      paymentMethod,
      packagingCharge,
      deliveryCharge: deliveryCharge || 0,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });
      if (response.data.success) {
        alert('Order placed successfully!');
        navigate('/');
      } else {
        alert('Error placing the order.');
      }
    } catch (error) {
      console.error('Error placing the order:', error);
    }
  };

  if (deliveryRadius === null) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={placeOrder} className="place-order">
      <AddressForm
        data={data}
        setData={setData}
        calculateDeliveryCharge={calculateDeliveryCharge}
        outOfDeliveryZone={outOfDeliveryZone}
      />
      <Map
        location={data.location}
        setLocation={(location) => {
          setData((prev) => ({ ...prev, location }));
          calculateDeliveryCharge(location.lat, location.lng);
        }}
      />
      <CartSummary
        totalAmount={getTotalCartAmount()}
        deliveryCharge={deliveryCharge}
        packagingCharge={packagingCharge}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        outOfDeliveryZone={outOfDeliveryZone}
      />
    </form>
  );
};

// Utility functions
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default PlaceOrder;
