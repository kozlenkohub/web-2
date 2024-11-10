// Sidebar.js

import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import {
  FaPlus,
  FaList,
  FaShoppingCart,
  FaChartBar,
  FaUsers,
  FaAccusoft,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';

const Sidebar = () => {
  const [userCount, setUserCount] = useState(0);
  const [orderEnabled, setOrderEnabled] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('https://web-2-backend-wbs4.onrender.com/api/user/count');
        const data = await response.json();
        if (data.success) {
          setUserCount(data.count);
        } else {
          console.error('Не удалось получить количество пользователей');
        }
      } catch (error) {
        console.error('Ошибка при получении количества пользователей:', error);
      }
    };

    const fetchOrderEnabled = async () => {
      try {
        const response = await fetch(
          'https://web-2-backend-wbs4.onrender.com/api/settings/get-ordering-status',
        );
        const data = await response.json();
        if (data.success) {
          setOrderEnabled(data.orderEnabled);
        } else {
          console.error('Не удалось получить статус приема заказов');
        }
      } catch (error) {
        console.error('Ошибка при получении статуса приема заказов:', error);
      }
    };

    fetchUserCount();
    fetchOrderEnabled();
  }, []);

  const toggleOrderEnabled = async () => {
    try {
      const response = await fetch(
        'https://web-2-backend-wbs4.onrender.com/api/settings/update-ordering',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Добавьте авторизационный заголовок, если требуется
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ orderEnabled: !orderEnabled }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setOrderEnabled(data.data.orderEnabled);
      } else {
        console.error('Не удалось обновить статус приема заказов');
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса приема заказов:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <FaPlus className="sidebar-icon" />
          <p>Добавить блюда</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <FaList className="sidebar-icon" />
          <p>Список блюд</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <FaShoppingCart className="sidebar-icon" />
          <p>Заказы</p>
        </NavLink>
        <NavLink to="/stats" className="sidebar-option">
          <FaChartBar className="sidebar-icon" />
          <p>Статистика</p>
        </NavLink>
        <NavLink to="/adminheader" className="sidebar-option">
          <FaAccusoft className="sidebar-icon" />
          <p>Баннер</p>
        </NavLink>

        <NavLink to="/menu-admin" className="sidebar-option">
          <FaAccusoft className="sidebar-icon" />
          <p>Категории</p>
        </NavLink>

        <NavLink to="/email-sender" className="sidebar-option">
          <FaPlus className="sidebar-icon" />
          <p>Рассылка</p>
        </NavLink>
      </div>

      {/* Отображение количества пользователей */}
      <div className="sidebar-users">
        <FaUsers className="sidebar-users-icon" />
        <h3>Всего пользователей: {userCount + 10}</h3>
      </div>

      {/* Переключатель приема заказов */}
      <div className="sidebar-toggle">
        <button onClick={toggleOrderEnabled} className="toggle-button">
          {orderEnabled ? (
            <>
              <FaToggleOn className="toggle-icon" style={{ color: 'green' }} />
              <span>Прием заказов включен</span>
            </>
          ) : (
            <>
              <FaToggleOff className="toggle-icon" style={{ color: 'red' }} />
              <span>Прием заказов выключен</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
