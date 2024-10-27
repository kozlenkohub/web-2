// src/components/Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Укажите свой пароль здесь
  const correctPassword = 'gastrofaza!!!0987'; // Замените 'yourPasswordHere' на ваш пароль

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      onLogin(); // Вызываем функцию onLogin для аутентификации
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="container">
      <div className="password-prompt">
        <h2>Enter Password to Access</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="password-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
