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
    const response = await axios.get(url + '/api/order/list');
    if (response.data.success) {
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
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

  // Функция для отображения заказов на текущей странице
  const displayOrders = orders
    .slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage)
    .map((order, index) => (
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
              {order.address.address ? `${order.address.address},` : ''}{' '}
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
    ));

  // Функция для обработки смены страницы
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="order add">
      <h3>Strona Zamówień</h3>
      <div className="order-list">{displayOrders}</div>
      <ReactPaginate
        previousLabel={'Poprzednia'}
        nextLabel={'Następna'}
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
