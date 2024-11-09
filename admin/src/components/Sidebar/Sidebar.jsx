import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaList, FaShoppingCart, FaChartBar, FaUsers, FaAccusoft } from 'react-icons/fa'; // Importing icons

const Sidebar = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('https://web-2-backend-wbs4.onrender.com/api/user/count');
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
          <FaPlus className="sidebar-icon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <FaList className="sidebar-icon" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <FaShoppingCart className="sidebar-icon" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/stats" className="sidebar-option">
          <FaChartBar className="sidebar-icon" />
          <p>Statistics</p>
        </NavLink>
        <NavLink to="/adminheader" className="sidebar-option">
          <FaAccusoft className="sidebar-icon" />
          <p>Баннер</p>
        </NavLink>
      </div>

      {/* Displaying user count */}
      <div className="sidebar-users">
        <FaUsers className="sidebar-users-icon" />
        <h3>Всего пользователей: {userCount + 10}</h3>
      </div>
    </div>
  );
};

export default Sidebar;
