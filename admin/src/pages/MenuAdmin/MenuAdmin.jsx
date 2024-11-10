import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MenuAdmin.css';

const MenuAdmin = ({ url }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Получение элементов меню при загрузке компонента
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${url}/api/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  // Открытие формы редактирования
  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setMenuName(item.menu_name);
    setImageFile(null);
  };

  // Обновление элемента меню
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('menu_name', menuName);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(`${url}/api/menu/${editingItem}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchMenuItems();
      setEditingItem(null);
      setMenuName('');
      setImageFile(null);
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  // Добавление новой категории
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newMenuName || !newImageFile) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const formData = new FormData();
    formData.append('menu_name', newMenuName);
    formData.append('image', newImageFile);

    setIsLoading(true);
    try {
      await axios.post(`${url}/api/menu`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Категория успешно добавлена');
      setNewMenuName('');
      setNewImageFile(null);
      fetchMenuItems(); // Обновляем список после добавления новой категории
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error);
      alert('Ошибка при добавлении категории');
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление элемента меню
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await axios.delete(`${url}/api/menu/${id}`);
        alert('Категория успешно удалена');
        fetchMenuItems(); // Обновляем список после удаления категории
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        alert('Ошибка при удалении категории');
      }
    }
  };

  return (
    <div className="menu-admin">
      <h1>Редактирование Меню</h1>

      {/* Форма для добавления новой категории */}
      <div className="add-category-form">
        <h2>Добавить новую категорию</h2>
        <form onSubmit={handleAddCategory}>
          <div>
            <label>Название категории:</label>
            <input
              type="text"
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Изображение категории:</label>
            <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} required />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Добавить категорию'}
          </button>
        </form>
      </div>

      {/* Список элементов меню для редактирования и удаления */}
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {editingItem === item._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Название меню"
                />
                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                <button onClick={handleUpdate}>Сохранить</button>
                <button className="cancel-button" onClick={() => setEditingItem(null)}>
                  Отмена
                </button>
              </div>
            ) : (
              <div className="menu-info">
                <img src={item.menu_image} alt={item.menu_name} width="100" />
                <div>
                  <p>{item.menu_name}</p>
                  <button onClick={() => handleEditClick(item)}>Редактировать</button>
                  <button onClick={() => handleDelete(item._id)} className="delete-button">
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuAdmin;
