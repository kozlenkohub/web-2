import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const api_google = 'AIzaSyB9zR_JSCYR7XLP_6j6GmU8qxG-ZJri3wE';
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: 'Polska',
    zipcode: '',
    country: '',
    phone: '',
    location: { lat: null, lng: null },
  });

  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const MIN_ORDER_AMOUNT = 20;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onCommentChangeHandler = (itemId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itemId]: comment,
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const calculatePackagingCharge = (amount) => {
    if (amount <= 1) return 0;
    if (amount <= 50) return 2;
    if (amount > 10000) return 0;

    const baseCharge = 2;
    const chargeIncrement = 1;
    const step = 50;

    return baseCharge + chargeIncrement * Math.ceil((amount - 50) / step);
  };

  useEffect(() => {
    const totalCartAmount = getTotalCartAmount();
    const calculatedPackagingCharge = calculatePackagingCharge(totalCartAmount);
    setPackagingCharge(calculatedPackagingCharge);
  }, [getTotalCartAmount]);

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(getAddress, handleLocationError);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getAddress = async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: api_google,
        },
      });

      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const street =
          addressComponents.find((component) => component.types.includes('route'))?.long_name || '';
        const city =
          addressComponents.find((component) => component.types.includes('locality'))?.long_name ||
          '';
        const zipcode =
          addressComponents.find((component) => component.types.includes('postal_code'))
            ?.long_name || '';
        const country =
          addressComponents.find((component) => component.types.includes('country'))?.long_name ||
          '';

        setData((data) => ({
          ...data,
          street,
          city,
          zipcode,
          country,
          location: { lat: latitude, lng: longitude },
        }));

        calculateDeliveryCharge(latitude, longitude);
      } else {
        alert('Could not fetch address information.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      alert('Error fetching address.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDeliveryCharge = (lat, lng) => {
    const deliveryCenter = { lat: 51.154, lng: 16.9305 };
    const distance = getDistanceFromLatLonInKm(deliveryCenter.lat, deliveryCenter.lng, lat, lng);

    if (distance <= 2) {
      setDeliveryCharge(0);
    } else if (distance > 2 && distance <= 4) {
      setDeliveryCharge(8);
    } else {
      setDeliveryCharge(null);
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (data.street && data.city && data.zipcode && data.country) {
        try {
          const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              address: `${data.street}, ${data.city}, ${data.zipcode}, ${data.country}`,
              key: api_google,
            },
          });

          if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            setData((prevData) => ({
              ...prevData,
              location: { lat: location.lat, lng: location.lng },
            }));
            calculateDeliveryCharge(location.lat, location.lng);
          } else {
            setDeliveryCharge(null);
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    };

    fetchCoordinates();
  }, [data.street, data.city, data.zipcode, data.country]);

  const handleLocationError = (error) => {
    setLoading(false);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        alert('An unknown error occurred.');
        break;
      default:
        alert('An unknown error occurred.');
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const totalAmount =
      getTotalCartAmount() + (deliveryCharge === null ? 0 : deliveryCharge) + packagingCharge;

    if (!token) {
      alert('Proszę się zalogować, aby złożyć zamówienie.');
      navigate('/login');
      return;
    }

    if (totalAmount < MIN_ORDER_AMOUNT) {
      alert(`Twój koszyk jest pusty. `);
      return;
    }

    if (deliveryCharge === null) {
      alert('Adres dostawy znajduje się poza obszarem dostawy.');
      return;
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo['quantity'] = cartItems[item._id];
        itemInfo['comment'] = comments[item._id] || '';
        orderItems.push(itemInfo);
      }
      return null;
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
      paymentMethod,
      packagingCharge,
      deliveryCharge: deliveryCharge !== null ? deliveryCharge : 0,
    };

    try {
      let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });
      if (response.data.success) {
        if (paymentMethod === 'cash') {
          alert('Twoje zamówienie zostało pomyślnie złożone. Płatność gotówką przy odbiorze.');
          navigate('/');
        } else {
          const { session_url } = response.data;
          window.location.replace(session_url);
        }
      } else {
        alert('Błąd');
      }
    } catch (error) {
      alert('Wystąpił błąd. Proszę spróbować ponownie.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title t3">Informacje o dostawie</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="Imię"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Nazwisko"
          />
        </div>
        <input
          className="emaill"
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Adres e-mail"
        />
        <input
          className="streett"
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Ulica"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="Miasto"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Kod pocztowy"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Kraj"
          />
        </div>
        <input
          className="phonee"
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Telefon"
        />
        <button type="button" onClick={getLocation} disabled={loading} className="location-button">
          {loading ? 'Loading...' : 'Wypełnij lokalizację'}
        </button>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2 className="t3">Podsumowanie Koszyka</h2>
          <div>
            <div className="cart-total-details">
              <p className="t5">Suma częściowa</p>
              <p className="t3">{getTotalCartAmount()} zł</p>
            </div>
            <hr />
            {deliveryCharge > 0 && deliveryCharge !== null && (
              <>
                <div className="cart-total-details">
                  <p className="t5">Opłata za dostawę</p>
                  <p className="t3">
                    {deliveryCharge === 0 ? 'Bezpłatna' : `${deliveryCharge} zł`}
                  </p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p className="t5">Opłata za opakowanie</p>
              <p className="t3">{packagingCharge} zł</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b className="t5">Suma</b>
              <b className="t3">
                {getTotalCartAmount() +
                  (deliveryCharge === null || deliveryCharge === 0 ? 0 : deliveryCharge) +
                  packagingCharge}{' '}
                zł
              </b>
            </div>
            <hr />

            <div className="cart-items">
              <div className="title t3 tac">Komentarz do zamówienia</div>
              {food_list.map((item) =>
                cartItems[item._id] > 0 ? (
                  <div key={item._id} className="cart-item">
                    <div className="item-details">
                      <img src={url + '/images/' + item.image} alt="" className="item-image" />
                      <div>
                        <p>{item.name}</p>
                        <p>
                          {cartItems[item._id]} x {item.price} zł
                        </p>
                      </div>
                    </div>
                    <textarea
                      placeholder="Chcesz dodać ostrości lub usunąć jakiś składnik z potrawy? Napisz o tym w komentarzu do zamówienia."
                      value={comments[item._id] || ''}
                      onChange={(e) => onCommentChangeHandler(item._id, e.target.value)}
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={handlePaymentMethodChange}
              />
              Karta płatnicza/BLIK
            </label>
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={handlePaymentMethodChange}
              />
              Gotówka przy dostawie
            </label>
          </div>
          <button className="t6" type="submit">
            PRZEJDŹ DO PŁATНОŚCI
          </button>
        </div>
      </div>
    </form>
  );
};

// Utility function to calculate distance between two points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default PlaceOrder;
