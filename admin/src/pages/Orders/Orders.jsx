import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list');
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error('Błąd');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + '/api/order/status', {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  const deleteOrderHandler = async (orderId) => {
    const response = await axios.post(url + '/api/order/delete', { orderId });
    if (response.data.success) {
      toast.success('Zamówienie usunięte');
      await fetchAllOrders();
    } else {
      toast.error('Błąd przy usuwaniu zamówienia');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Strona Zamówień</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity;
                  } else {
                    return item.name + ' x ' + item.quantity + ', ';
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName || 'Имя не указано'}</p>
              <div className="order-item-address">
                <p>
                  {order.address.address ? `${order.address.address},` : 'Адрес не указан'}{' '}
                  {order.address.apartmentNumber ? `Кв. ${order.address.apartmentNumber},` : ''}
                </p>
                <p>{order.address.phone || 'Телефон не указан'}</p>
              </div>
              <p className="order-item-payment-time">
                {order.payment && order.paymentTime
                  ? `Zamówienie opłacone o: ${new Date(order.paymentTime).toLocaleString()}`
                  : 'Zamówienie nieopłacone'}
              </p>
            </div>
            <p>Przedmioty : {order.items.length}</p>
            <p>{order.amount} zł</p>
            <p>Opłata za dostawę: {order.deliveryCharge} zł</p>
            <p>Opłata za opakowanie: {order.packagingCharge} zł</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Przygotowywanie jedzenia</option>
              <option value="Out for delivery">W drodze</option>
              <option value="Delivered">Dostarczone</option>
            </select>
            <button onClick={() => deleteOrderHandler(order._id)}>Usuń</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
