import React, { useContext, useState, useEffect, useCallback } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const PlaceOrder = () => {
  const api_google = 'AIzaSyB9zR_JSCYR7XLP_6j6GmU8qxG-ZJri3wE';
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

  const [comments, setComments] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [addressValid, setAddressValid] = useState(false);
  const [outOfDeliveryZone, setOutOfDeliveryZone] = useState(false);

  const [mapZoom, setMapZoom] = useState(14); // Added state for map zoom level

  const MIN_ORDER_AMOUNT = 20;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: api_google,
    libraries: ['places'],
  });

  // Handler for input changes
  const onChangeHandler = (event) => {
    const name = event.target.name || 'address'; // Default to 'address' if name is undefined
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value, isAddressManual: name === 'address' }));
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

  const calculatePackagingCharge = () => {
    let zestawCharge = 0;
    let totalCartAmountWithoutZestaw = 0;
    let totalItemsInCart = 0;

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        totalItemsInCart += cartItems[item._id];

        if (item.name.includes('Zestaw')) {
          zestawCharge += 3 * cartItems[item._id];
        } else {
          totalCartAmountWithoutZestaw += item.price * cartItems[item._id];
        }
      }
    });

    if (totalItemsInCart === 0) {
      return 0;
    }

    let additionalPackagingCharge = 2;

    if (totalCartAmountWithoutZestaw > 50) {
      const baseCharge = 2;
      const chargeIncrement = 1;
      const step = 50;
      additionalPackagingCharge =
        baseCharge + chargeIncrement * Math.ceil((totalCartAmountWithoutZestaw - 50) / step);
    }

    return zestawCharge + additionalPackagingCharge;
  };

  useEffect(() => {
    const calculatedPackagingCharge = calculatePackagingCharge();
    setPackagingCharge(calculatedPackagingCharge);
  }, [cartItems, food_list]);

  // New useEffect to watch for address changes
  useEffect(() => {
    if (data.address && data.isAddressManual) {
      geocodeAddress(data.address);
    }
  }, [data.address]);

  const geocodeAddress = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setData((prev) => ({ ...prev, location }));
        calculateDeliveryCharge(location.lat, location.lng);
        setAddressValid(true);
        setOutOfDeliveryZone(false);
        setMapZoom(18); // Zoom in closer to the house level
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
        setAddressValid(false);
        setOutOfDeliveryZone(true);
      }
    });
  };

  const calculateDeliveryCharge = (lat, lng) => {
    const deliveryCenter = { lat: 51.154, lng: 16.9305 };
    const distance = getDistanceFromLatLonInKm(deliveryCenter.lat, deliveryCenter.lng, lat, lng);

    if (distance <= 1.77) {
      setDeliveryCharge(0);
      setOutOfDeliveryZone(false);
    } else if (distance > 1.77 && distance <= 5) {
      setDeliveryCharge(8);
      setOutOfDeliveryZone(false);
    } else {
      setDeliveryCharge(null);
      setOutOfDeliveryZone(true);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const totalAmount = getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge;

    if (!token) {
      alert('Proszę się zalogować, aby złożyć zamówienie.');
      navigate('/login');
      return;
    }

    if (getTotalCartAmount() === 0) {
      alert(`Twój koszyk jest pusty.`);
      return;
    }

    if (totalAmount < MIN_ORDER_AMOUNT) {
      alert(`Minimalna kwota zamówienia to ${MIN_ORDER_AMOUNT} zł.`);
      return;
    }

    if (outOfDeliveryZone) {
      alert('Adres dostawy znajduje się poza obszarem dostawy.');
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo['quantity'] = cartItems[item._id];
        itemInfo['comment'] = comments[item._id] || '';
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
      paymentMethod,
      packagingCharge,
      deliveryCharge: deliveryCharge || 0,
    };

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
      if (response.data.success) {
        if (paymentMethod === 'cash') {
          alert('Twoje zamówienie zostało pomyślnie złożone. Płatność gotówką przy odbiorze.');
          navigate('/');
        } else {
          const { session_url } = response.data;
          window.location.replace(session_url);
        }
      } else {
        alert('Wystąpił błąd podczas składania zamówienia.');
      }
    } catch (error) {
      alert('Wystąpił błąd. Proszę spróbować ponownie.');
      console.error(error);
    }
  };

  // Map click handler
  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setData((prev) => ({ ...prev, location: { lat, lng }, isAddressManual: false }));
    calculateDeliveryCharge(lat, lng);
    setAddressValid(true);
    reverseGeocode(lat, lng);

    // Update map zoom level when location is set manually
    setMapZoom(18); // Zoom in closer to the house level
  }, []);

  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          // Only update the address if the user is not manually typing
          setData((prev) => {
            if (!prev.isAddressManual) {
              return { ...prev, address };
            }
            return prev;
          });

          // Update map zoom level when address is determined via reverse geocoding
          setMapZoom(18); // Zoom in closer to the house level
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title t3">Informacje o dostawie</p>
        <input
          required
          name="firstName"
          onChange={onChangeHandler}
          value={data.firstName}
          type="text"
          placeholder="Imię"
        />
        <div className="address-input">
          {addressValid ? (
            <div className="text-white">
              {outOfDeliveryZone ? (
                <>
                  <FaTimesCircle color="red" className="address-icon" />
                  <span>Adres dostawy znajduje się poza obszarem dostawy</span>
                </>
              ) : (
                <>
                  <FaCheckCircle color="green" className="address-icon" />
                  <span>Adres został ustalony</span>
                </>
              )}
            </div>
          ) : (
            <div className="text-white">
              <FaTimesCircle color="red" className="address-icon" /> Adres jest nieustalony
            </div>
          )}
          <Autocomplete
            apiKey={api_google}
            onPlaceSelected={(place) => {
              const address = place.formatted_address;
              const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              setData((data) => ({
                ...data,
                address,
                location,
                isAddressManual: false,
              }));
              calculateDeliveryCharge(location.lat, location.lng);
              setAddressValid(true);

              // Update map zoom level when address is selected from autocomplete
              setMapZoom(18); // Zoom in closer to the house level
            }}
            options={{ types: ['address'], componentRestrictions: { country: 'pl' } }}
            placeholder="Adres dostawy"
            value={data.address}
            onChange={onChangeHandler}
            inputProps={{ name: 'address' }} // Added name attribute
          />
        </div>
        <input
          required
          name="apartmentNumber"
          onChange={onChangeHandler}
          value={data.apartmentNumber}
          type="text"
          placeholder="Numer mieszkania"
        />
        <input
          className="phonee"
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="tel"
          placeholder="Telefon"
        />

        {/* Map */}
        <GoogleMap
          center={data.location}
          zoom={mapZoom} // Use the dynamic zoom level
          mapContainerStyle={{ height: '400px', width: '100%' }}
          onClick={onMapClick}>
          <Marker position={data.location} draggable onDragEnd={onMapClick} />
        </GoogleMap>
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
            {deliveryCharge !== null && (
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
                {getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge} zł
              </b>
            </div>
            <hr />

            <div className="cart-items">
              <div className="title t3 tac">Komentarz do zamówienia</div>
              {food_list.map((item) =>
                cartItems[item._id] > 0 ? (
                  <div key={item._id} className="cart-item">
                    <div className="item-details">
                      <img src={`${url}/images/${item.image}`} alt="" className="item-image" />
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
            PRZEJDŹ DO PŁATNOŚCI
          </button>
        </div>
      </div>
    </form>
  );
};

// Utility function to calculate distance between two points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
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
