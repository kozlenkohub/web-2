import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Функция для получения количества пользователей с бэкенда
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/count'); // Замените на ваш URL
        const data = await response.json();
        if (data.success) {
          setUserCount(data.count);
        } else {
          console.error('Failed to fetch user count');
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img className="addd" src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img className="listt" src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img className="orderr" src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>

        {/* Добавляем новый NavLink для статистики */}
        <NavLink to="/stats" className="sidebar-option">
          <p>Statistics</p>
        </NavLink>
      </div>

      {/* Отображаем количество пользователей */}
      <div className="sidebar-users">
        <h3>Всего пользователей: {userCount + 10}</h3>
      </div>
    </div>
  );
};

export default Sidebar;
