import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Stats from './pages/Stats/Stats';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentsFetcher from './pages/Stripe/PaymentsFetcher';
import Login from './components/Login/Login';
import AdminHeaderContent from './pages/AdminHeaderContent/AdminHeaderContent';
import MenuAdmin from './pages/MenuAdmin/MenuAdmin';
import EmailSender from './pages/EmailSender/EmailSender';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //https://web-2-backend-wbs4.onrender.com

  const url = 'https://web-2-backend-wbs4.onrender.com'; // URL для запросов

  // Функция для проверки времени аутентификации
  const checkAuthentication = () => {
    const authTime = localStorage.getItem('authTime');
    if (authTime) {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - authTime) / 1000 / 60; // Время в минутах
      if (timeElapsed < 4320) {
        // 3 дня = 4320 минут
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authTime'); // Очистка, если прошло 3 дня
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkAuthentication(); // Проверка при загрузке приложения
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authTime', Date.now()); // Сохранение времени аутентификации
  };

  return (
    <div>
      <ToastContainer />
      {isAuthenticated ? (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/stats" element={<Stats url={url} />} />
              <Route path="/stripe" element={<PaymentsFetcher url={url} />} />
              <Route path="/adminheader" element={<AdminHeaderContent url={url} />} />
              <Route path="/menu-admin" element={<MenuAdmin url={url} />} /> {/* Новый маршрут */}
              <Route path="/email-sender" element={<EmailSender url={url} />} />{' '}
              {/* Новый маршрут */}
            </Routes>
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
