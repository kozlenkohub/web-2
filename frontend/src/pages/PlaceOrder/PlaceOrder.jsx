import React, { useContext, useState, useEffect, useCallback } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import AddressForm from './AddressForm';
import MapComponent from './MapComponent';
import CartSummary from './CartSummary';
import Notification from './Notification';
import { getDistanceFromLatLonInKm, timeStringToMinutes } from './utils';

import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const PlaceOrder = () => {
  // Инициализация хуков
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const api_google = 'AIzaSyCi57cU6u5P8pTxiqSsP-HVFcSVuEsKVqc'; // Замените на ваш ключ API
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Состояния для настроек доставки
  const [deliveryCenter, setDeliveryCenter] = useState(null);
  const [deliveryRadius, setDeliveryRadius] = useState(null);

  // Флаги загрузки данных
  const [deliverySettingsLoaded, setDeliverySettingsLoaded] = useState(false);
  const [lastOrderLoaded, setLastOrderLoaded] = useState(false);

  // Состояние данных формы
  const [data, setData] = useState({
    firstName: '',
    address: '',
    apartmentNumber: '',
    phone: '',
    location: null,
    isAddressManual: false,
  });

  // Остальные состояния
  const [comments, setComments] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [addressValid, setAddressValid] = useState(false);
  const [outOfDeliveryZone, setOutOfDeliveryZone] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);

  const MIN_ORDER_AMOUNT = 20;

  // Загрузка Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: api_google,
    libraries: ['places'],
  });

  // Состояние для проверки рабочих часов
  const [isWorkingHours, setIsWorkingHours] = useState(true);

  const workingHours = {
    0: { open: '11:00', close: '20:30' },
    1: { open: '11:00', close: '20:30' },
    2: { open: '11:00', close: '20:30' },
    3: { open: '11:00', close: '20:30' },
    4: { open: '11:00', close: '20:30' },
    5: { open: '11:00', close: '23:30' },
    6: { open: '11:00', close: '23:30' },
  };

  // Хук для проверки рабочих часов
  useEffect(() => {
    const checkWorkingHours = () => {
      const currentDay = new Date().getDay();
      const currentTime = new Date();
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

      const todayWorkingHours = workingHours[currentDay];

      if (!todayWorkingHours) {
        setIsWorkingHours(false);
        return;
      }

      const openMinutes = timeStringToMinutes(todayWorkingHours.open);
      const closeMinutes = timeStringToMinutes(todayWorkingHours.close);

      const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
      setIsWorkingHours(isOpen);
    };

    checkWorkingHours();

    const interval = setInterval(checkWorkingHours, 60000);

    return () => clearInterval(interval);
  }, []);

  // Хук для загрузки настроек доставки
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const [centerResponse, radiusResponse] = await Promise.all([
          axios.get(`${url}/api/settings/get-delivery-center`),
          axios.get(`${url}/api/settings/get-delivery-radius`),
        ]);

        if (centerResponse.data.success && radiusResponse.data.success) {
          setDeliveryCenter(centerResponse.data.deliveryCenter);
          setDeliveryRadius(radiusResponse.data.deliveryRadius);

          setData((prevData) => ({
            ...prevData,
            location: centerResponse.data.deliveryCenter,
          }));

          setDeliverySettingsLoaded(true);
        } else {
          console.error('Ошибка при получении настроек доставки');
        }
      } catch (error) {
        console.error('Ошибка при запросе настроек доставки:', error);
      }
    };

    fetchDeliverySettings();
  }, [url]);

  // Хук для загрузки последнего заказа
  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const response = await axios.get(`${url}/api/order/last`, { headers: { token } });
        if (response.data.success && response.data.data) {
          const lastOrder = response.data.data;
          const { address } = lastOrder;

          setData({
            firstName: address.firstName || '',
            email: address.email || '',
            address: address.street || '',
            apartmentNumber: address.apartmentNumber || '',
            phone: address.phone || '',
            location: address.location || null,
            isAddressManual: false,
          });
        }
      } catch (error) {
        console.error('Ошибка при получении последнего заказа:', error);
      } finally {
        setLastOrderLoaded(true);
      }
    };

    if (token) {
      fetchLastOrder();
    } else {
      setLastOrderLoaded(true); // Если пользователь не залогинен, считаем, что загрузка завершена
    }
  }, [url, token]);

  // Обработка изменений в форме адреса
  const onChangeHandler = (event) => {
    const name = event.target.name || 'address';
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value, isAddressManual: name === 'address' }));
  };

  // Обработка изменений комментариев к товарам
  const onCommentChangeHandler = (itemId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itemId]: comment,
    }));
  };

  // Обработка изменения метода оплаты
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Функция расчета упаковочного сбора
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

    let additionalPackagingCharge = 0;

    if (totalCartAmountWithoutZestaw > 0) {
      additionalPackagingCharge = 2;

      if (totalCartAmountWithoutZestaw > 50) {
        const baseCharge = 2;
        const chargeIncrement = 1;
        const step = 50;
        additionalPackagingCharge =
          baseCharge + chargeIncrement * Math.ceil((totalCartAmountWithoutZestaw - 50) / step);
      }
    }

    return zestawCharge + additionalPackagingCharge;
  };

  // Хук для расчета упаковочного сбора при изменении корзины
  useEffect(() => {
    const calculatedPackagingCharge = calculatePackagingCharge();
    setPackagingCharge(calculatedPackagingCharge);
  }, [cartItems, food_list]);

  // Функция расчета доставки на основе расстояния
  const calculateDeliveryCharge = (lat, lng) => {
    if (!deliveryCenter || deliveryRadius === null) {
      return;
    }

    const distance = getDistanceFromLatLonInKm(deliveryCenter.lat, deliveryCenter.lng, lat, lng);

    if (distance <= 1.77) {
      setDeliveryCharge(0);
      setOutOfDeliveryZone(false);
    } else if (distance > 1.77 && distance <= deliveryRadius) {
      setDeliveryCharge(8);
      setOutOfDeliveryZone(false);
    } else {
      setDeliveryCharge(null);
      setOutOfDeliveryZone(true);
    }
  };

  // Функция размещения заказа
  const placeOrder = async (event) => {
    event.preventDefault();

    const totalAmount = getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge;

    if (!token) {
      alert('Zaloguj się, aby złożyć zamówienie.');
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
      alert('Adres znajduje się poza strefą dostawy.');
      return;
    }

    if (!isWorkingHours) {
      alert('Dostawa jest niedostępna poza godzinami pracy.');
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
          alert('Twoje zamówienie zostało pomyślnie złożone. Płatność gotówką przy dostawie.');
          navigate('/');
        } else {
          console.log(response.data);

          const { session_url } = response.data;
          window.location.replace(session_url);
        }
      } else {
        alert('Wystąpił błąd podczas składania zamówienia.');
      }
    } catch (error) {
      alert('Wystąpił błąd. Spróbuj ponownie.');
      console.error(error);
    }
  };

  // Обработка клика по карте
  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setData((prev) => ({ ...prev, location: { lat, lng }, isAddressManual: false }));
      calculateDeliveryCharge(lat, lng);
      setAddressValid(true);
      reverseGeocode(lat, lng);
      setMapZoom(18);
    },
    [deliveryCenter, deliveryRadius],
  );

  // Функция обратного геокодирования
  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          setData((prev) => {
            if (!prev.isAddressManual) {
              return { ...prev, address };
            }
            return prev;
          });
          setMapZoom(18);
        } else {
          console.error('Nie znaleziono wyników');
        }
      } else {
        console.error('Błąd geokodera: ' + status);
      }
    });
  };

  // Определение, загружены ли все необходимые данные
  const isDataLoaded = deliverySettingsLoaded && lastOrderLoaded;

  // Отображение загрузки, пока данные не загружены
  if (!isLoaded || !isDataLoaded) {
    return <LoadingAnimation />;
  }

  return (
    <form onSubmit={placeOrder} className="place-order">
      {!isWorkingHours && <Notification message="Dostawa jest niedostępna poza godzinami pracy." />}

      <div className="place-order-left">
        <AddressForm
          data={data}
          onChangeHandler={onChangeHandler}
          addressValid={addressValid}
          outOfDeliveryZone={outOfDeliveryZone}
          t={t}
          api_google={api_google}
          setData={setData}
          calculateDeliveryCharge={calculateDeliveryCharge}
          setAddressValid={setAddressValid}
          setOutOfDeliveryZone={setOutOfDeliveryZone}
          setMapZoom={setMapZoom}
          deliveryCenter={deliveryCenter}
          deliveryRadius={deliveryRadius}
        />
        <MapComponent data={data} onMapClick={onMapClick} mapZoom={mapZoom} />
      </div>

      <div className="place-order-right">
        <CartSummary
          t={t}
          getTotalCartAmount={getTotalCartAmount}
          deliveryCharge={deliveryCharge}
          packagingCharge={packagingCharge}
          cartItems={cartItems}
          food_list={food_list}
          comments={comments}
          onCommentChangeHandler={onCommentChangeHandler}
          paymentMethod={paymentMethod}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
        <button className="t6 method228" type="submit" disabled={!isWorkingHours}>
          {t('placeOrder.proceed')}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
