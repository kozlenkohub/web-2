import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Stats from './pages/Stats/Stats'; // Импортируем компонент Stats
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentsFetcher from './pages/Stripe/PaymentsFetcher';

const App = () => {
  const url = 'https://web-2-backend-wbs4.onrender.com';

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/stats" element={<Stats url={url} />} /> {/* Добавляем маршрут для Stats */}
          <Route path="/stripe" element={<PaymentsFetcher url={url} />} />{' '}
          {/* Добавляем маршрут для Stats */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
