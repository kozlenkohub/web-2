import React, { useEffect, useState } from 'react';
import './Stats.css';

const Stats = ({ url }) => {
  const [stats, setStats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Для отображения выбранного пользователя
  const [isModalOpen, setIsModalOpen] = useState(false); // Для управления модальным окном
  const [currentPage, setCurrentPage] = useState(1); // Для управления пагинацией
  const usersPerPage = 5; // Количество пользователей на странице

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${url}/stats`);
        const data = await response.json();

        // Сортировка по количеству заказов
        const sortedData = data.sort((a, b) => b.orderCount - a.orderCount);
        setStats(sortedData);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };

    fetchStats();
  }, [url]);

  const handleUserClick = (user) => {
    setSelectedUser(user); // Устанавливаем выбранного пользователя
    setIsModalOpen(true); // Открываем модальное окно
  };

  const closeModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  // Пагинация
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = stats.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(stats.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="stats-container">
      <h2>Статистика заказов пользователей</h2>
      <p>Всего пользователей, которые сделали заказ: {stats.length}</p>
      {stats.length > 0 ? (
        <>
          <ul>
            {currentUsers.map((user) => (
              <li key={user._id} onClick={() => handleUserClick(user)} className="user-item">
                {user.name}: {user.orderCount} заказов
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}>
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Загрузка статистики...</p>
      )}

      {/* Модальное окно */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Детали пользователя</h3>
            <p>Имя: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Телефон: {selectedUser.phoneNumber}</p>
            <p>Количество заказов: {selectedUser.orderCount}</p>
            <button onClick={closeModal} className="close-modal">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
