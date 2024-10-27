import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next'; // Import for translation

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const { t } = useTranslation(); // Initialize translation

  const fetchOrders = async () => {
    const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2 className="myordersp t3">{t('myOrders.title')}</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p className="t3">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity;
                  } else {
                    return item.name + ' x ' + item.quantity + ',';
                  }
                })}
              </p>
              <p className="t3">{order.amount}.00 zł</p>
              <p className="t3">
                {t('myOrders.items')}: {order.items.length}
              </p>
              <p>
                <span className="t3">&#x25cf;</span>{' '}
                <b className="t3">{t(`myOrders.status.${order.status}`)}</b>
              </p>
              <button className="t3" onClick={fetchOrders}>
                {t('myOrders.trackOrder')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
