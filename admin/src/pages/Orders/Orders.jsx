import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import ReactPaginate from 'react-paginate';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 10;

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error('Ошибка');
      }
    } catch (error) {
      toast.error('Ошибка при получении заказов');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      const response = await axios.post(url + '/api/order/delete', { orderId });
      if (response.data.success) {
        toast.success('Заказ удалён');
        await fetchAllOrders();
      } else {
        toast.error('Ошибка при удалении заказа');
      }
    } catch (error) {
      toast.error('Ошибка при удалении заказа');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const displayOrders = orders
    .slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage)
    .map((order, index) => (
      <div key={index} className="order-item">
        <div className="order-header">
          <img src={assets.parcel_icon} alt="Иконка посылки" />
          <div className="order-info">
            <p className="order-item-name">{order.address.firstName || 'Имя неизвестно'}</p>
            <p className="order-item-payment-time">
              {order.payment && order.paymentTime
                ? `Оплачено: ${new Date(order.paymentTime).toLocaleString('ru-RU')}`
                : 'Оплата при получении'}
            </p>
          </div>
          <button className="delete-button" onClick={() => deleteOrderHandler(order._id)}>
            Удалить
          </button>
        </div>
        <div className="order-body">
          <p className="order-item-food">
            {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
          </p>
          <div className="order-item-address">
            <p>
              {order.address.address ? `${order.address.address}, ` : ''}
              {order.address.apartmentNumber ? `Кв. ${order.address.apartmentNumber}, ` : ''}
              {order.address.phone || 'Телефон неизвестен'}
            </p>
          </div>
          <div className="order-details">
            <p>
              <strong>Товары:</strong> {order.items.length}
            </p>
            <p>
              <strong>Сумма:</strong> {order.amount} zl.
            </p>
            <p>
              <strong>Доставка:</strong> {order.deliveryCharge} zl.
            </p>
            <p>
              <strong>Упаковка:</strong> {order.packagingCharge} zl.
            </p>
          </div>
          <select
            onChange={(event) => statusHandler(event, order._id)}
            value={order.status}
            className="status-select">
            <option value="Food Processing">Приготовление еды</option>
            <option value="Out for delivery">В пути</option>
            <option value="Delivered">Доставлено</option>
          </select>
        </div>
      </div>
    ));

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="order-container">
      <h3>Страница заказов</h3>
      <div className="order-list">{displayOrders}</div>
      <ReactPaginate
        previousLabel={'Предыдущая'}
        nextLabel={'Следующая'}
        breakLabel={'...'}
        pageCount={Math.ceil(orders.length / ordersPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
      />
    </div>
  );
};

export default Orders;
