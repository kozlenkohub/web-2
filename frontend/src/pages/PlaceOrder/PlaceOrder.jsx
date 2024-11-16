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
import { getDistanceFromLatLonInKm, deg2rad, timeStringToMinutes } from './utils';

const PlaceOrder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  const api_google = 'AIzaSyCi57cU6u5P8pTxiqSsP-HVFcSVuEsKVqc'; // Замените на ваш API ключ
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Новые состояния для центра доставки и радиуса доставки
  const [deliveryCenter, setDeliveryCenter] = useState(null);
  const [deliveryRadius, setDeliveryRadius] = useState(null);

  // Состояние для отслеживания загрузки данных с бэкенда
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Другие состояния
  const [data, setData] = useState({
    firstName: '',
    address: '',
    apartmentNumber: '',
    phone: '',
    location: null, // Обновим после получения deliveryCenter
    isAddressManual: false,
  });

  const [comments, setComments] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [addressValid, setAddressValid] = useState(false);
  const [outOfDeliveryZone, setOutOfDeliveryZone] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);

  const MIN_ORDER_AMOUNT = 20;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: api_google,
    libraries: ['places'],
  });

  const [isWorkingHours, setIsWorkingHours] = useState(true);

  const workingHours = {
    0: { open: '11:00', close: '20:30' }, // Воскресенье
    1: { open: '11:00', close: '20:30' }, // Понедельник
    2: { open: '11:00', close: '20:30' }, // Вторник
    3: { open: '11:00', close: '20:30' }, // Среда
    4: { open: '11:00', close: '20:30' }, // Четверг
    5: { open: '11:00', close: '21:30' }, // Пятница
    6: { open: '11:00', close: '21:30' }, // Суббота
  };

  // Функция для перевода времени в минуты
  const timeStringToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Проверка рабочих часов
  useEffect(() => {
    const checkWorkingHours = () => {
      const currentDay = new Date().getDay(); // 0-6 (0 = Воскресенье)
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

  // Функция для получения центра и радиуса доставки
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

          // Устанавливаем начальную локацию на центр доставки
          setData((prevData) => ({
            ...prevData,
            location: centerResponse.data.deliveryCenter,
          }));

          setIsDataLoaded(true);
        } else {
          console.error('Ошибка при получении настроек доставки');
        }
      } catch (error) {
        console.error('Ошибка при запросе настроек доставки:', error);
      }
    };

    fetchDeliverySettings();
  }, [url]);

  // Обработчики изменений
  const onChangeHandler = (event) => {
    const name = event.target.name || 'address';
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

  // Расчет стоимости упаковки
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

  useEffect(() => {
    const calculatedPackagingCharge = calculatePackagingCharge();
    setPackagingCharge(calculatedPackagingCharge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Обновляем функцию calculateDeliveryCharge
  const calculateDeliveryCharge = (lat, lng) => {
    if (!deliveryCenter || deliveryRadius === null) {
      // Если данные еще не загружены, не выполняем расчет
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

  // Обработчик отправки заказа
  const placeOrder = async (event) => {
    event.preventDefault();

    const totalAmount = getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge;

    if (!token) {
      alert('Пожалуйста, войдите в систему, чтобы оформить заказ.');
      navigate('/login');
      return;
    }

    if (getTotalCartAmount() === 0) {
      alert('Ваша корзина пуста.');
      return;
    }

    if (totalAmount < MIN_ORDER_AMOUNT) {
      alert(`Минимальная сумма заказа ${MIN_ORDER_AMOUNT} PLN.`);
      return;
    }

    if (outOfDeliveryZone) {
      alert('Адрес доставки находится вне зоны доставки.');
      return;
    }

    if (!isWorkingHours) {
      alert('Доставка недоступна вне рабочих часов.');
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
          alert('Ваш заказ успешно оформлен. Оплата наличными при доставке.');
          navigate('/');
        } else {
          const { session_url } = response.data;
          window.location.replace(session_url);
        }
      } else {
        alert('Произошла ошибка при оформлении заказа.');
      }
    } catch (error) {
      alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
      console.error(error);
    }
  };

  // Обработчик клика по карте
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deliveryCenter, deliveryRadius],
  );

  // Обратное геокодирование
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
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  };

  if (!isLoaded || !isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={placeOrder} className="place-order">
      {!isWorkingHours && <Notification message="Доставка недоступна вне рабочих часов." />}

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
