import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]); // состояние для категорий
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '', // польское описание
    description_en: '',
    description_ru: '',
    price: '',
    category: 'Burgery',
    isActive: true,
  });
  const [editImage, setEditImage] = useState(null);

  // Получение списка продуктов
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Ошибка при получении списка продуктов');
      }
    } catch (error) {
      toast.error('Ошибка сервера');
    }
  };

  // Получение списка категорий
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/menu`);
      setCategories(response.data.map((item) => item.menu_name)); // сохраняем только имена категорий
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
      toast.error('Ошибка при получении категорий');
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error('Ошибка при удалении продукта');
      }
    } catch (error) {
      toast.error('Ошибка сервера');
    }
  };

  const startEdit = (item) => {
    setEditMode(item._id);
    setEditData({
      name: item.name,
      description: item.description,
      description_en: item.description_en,
      description_ru: item.description_ru,
      price: item.price,
      category: item.category,
      isActive: item.isActive,
    });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditData({
      name: '',
      description: '',
      description_en: '',
      description_ru: '',
      price: '',
      category: 'Burgery',
      isActive: true,
    });
    setEditImage(null);
  };

  const saveEdit = async (itemId) => {
    const formData = new FormData();
    formData.append('id', itemId);
    formData.append('name', editData.name);
    formData.append('description', editData.description);
    formData.append('description_en', editData.description_en);
    formData.append('description_ru', editData.description_ru);
    formData.append('price', Number(editData.price));
    formData.append('category', editData.category);
    formData.append('isActive', editData.isActive);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        cancelEdit();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Ошибка при обновлении продукта');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setEditData((prevData) => ({ ...prevData, isActive: e.target.checked }));
  };

  useEffect(() => {
    fetchList();
    fetchCategories(); // загружаем категории при монтировании компонента
  }, []);

  return (
    <div className="list-container">
      <h3>Список всех продуктов</h3>
      <div className="list-table">
        <div className="list-header">
          <p>Изображение</p>
          <p>Название</p>
          <p>Категория</p>
          <p>Цена</p>
          <p>Действие</p>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-row">
            {editMode === item._id ? (
              <div className="edit-form">
                <div className="edit-field">
                  <label htmlFor="name">Название</label>
                  <input type="text" name="name" value={editData.name} onChange={handleChange} />
                </div>
                <div className="edit-field">
                  <label htmlFor="description">Описание (PL)</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="description_en">Описание (EN)</label>
                  <textarea
                    name="description_en"
                    value={editData.description_en}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="description_ru">Описание (RU)</label>
                  <textarea
                    name="description_ru"
                    value={editData.description_ru}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="category">Категория</label>
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    className="select-category">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="edit-field">
                  <label htmlFor="price">Цена</label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="image">Изображение</label>
                  <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                </div>
                <div className="edit-field checkbox-field">
                  <label htmlFor="isActive">Активен</label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editData.isActive}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={() => saveEdit(item._id)}>Сохранить</button>
                  <button className="cancel" onClick={cancelEdit}>
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price} zl.</p>
                <div className="action-buttons">
                  <button onClick={() => startEdit(item)}>Редактировать</button>
                  <button className="delete" onClick={() => removeFood(item._id)}>
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
