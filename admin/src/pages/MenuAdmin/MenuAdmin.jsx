import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MenuAdmin.css';

const MenuAdmin = ({ url }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [imageFile, setImageFile] = useState(null);

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

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setMenuName(item.menu_name);
    setImageFile(null);
  };

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

  return (
    <div className="menu-admin">
      <h1>Редактирование Меню</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {editingItem === item._id ? (
              <div>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Название меню"
                />
                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                <button onClick={handleUpdate}>Сохранить</button>
                <button onClick={() => setEditingItem(null)}>Отмена</button>
              </div>
            ) : (
              <div>
                <p>{item.menu_name}</p>
                <img src={item.menu_image} alt={item.menu_name} width="100" />
                <button onClick={() => handleEditClick(item)}>Редактировать</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuAdmin;
