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
  FaClone,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = () => {
  const [userCount, setUserCount] = useState(0);
  const [orderEnabled, setOrderEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(false); // Закрыть Sidebar при выборе пункта меню
  };

  return (
    <>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-options">
          <NavLink to="/add" className="sidebar-option" onClick={handleMenuClick}>
            <FaPlus className="sidebar-icon" />
            <p>Добавить блюда</p>
          </NavLink>
          <NavLink to="/list" className="sidebar-option" onClick={handleMenuClick}>
            <FaList className="sidebar-icon" />
            <p>Список блюд</p>
          </NavLink>
          <NavLink to="/orders" className="sidebar-option" onClick={handleMenuClick}>
            <FaShoppingCart className="sidebar-icon" />
            <p>Заказы</p>
          </NavLink>
          <NavLink to="/stats" className="sidebar-option" onClick={handleMenuClick}>
            <FaChartBar className="sidebar-icon" />
            <p>Статистика</p>
          </NavLink>
          <NavLink to="/adminheader" className="sidebar-option" onClick={handleMenuClick}>
            <FaAccusoft className="sidebar-icon" />
            <p>Баннер</p>
          </NavLink>
          <NavLink to="/menu-admin" className="sidebar-option" onClick={handleMenuClick}>
            <FaClone className="sidebar-icon" />
            <p>Категории</p>
          </NavLink>
          <NavLink to="/email-sender" className="sidebar-option" onClick={handleMenuClick}>
            <FaPlus className="sidebar-icon" />
            <p>Рассылка</p>
          </NavLink>
        </div>

        <div className="sidebar-users">
          <FaUsers className="sidebar-users-icon" />
          <h3>Всего пользователей: {userCount + 10}</h3>
        </div>

        <div className="sidebar-toggle">
          <button
            onClick={toggleOrderEnabled}
            className={`toggle-button ${orderEnabled ? 'active' : 'inactive'}`}>
            {orderEnabled ? (
              <>
                <FaToggleOn className="toggle-icon" />
                <span>Прием заказов включен</span>
              </>
            ) : (
              <>
                <FaToggleOff className="toggle-icon" />
                <span>Прием заказов выключен</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
