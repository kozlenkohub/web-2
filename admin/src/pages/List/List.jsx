import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgery',
    isActive: true, // Добавляем поле активности
  });
  const [editImage, setEditImage] = useState(null);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error('Błąd');
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error('Błąd');
    }
  };

  const startEdit = (item) => {
    setEditMode(item._id);
    setEditData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isActive: item.isActive, // Инициализируем поле активности
    });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditData({ name: '', description: '', price: '', category: 'Burgery', isActive: true });
    setEditImage(null);
  };

  const saveEdit = async (itemId) => {
    const formData = new FormData();
    formData.append('id', itemId);
    formData.append('name', editData.name);
    formData.append('description', editData.description);
    formData.append('price', Number(editData.price));
    formData.append('category', editData.category);
    formData.append('isActive', editData.isActive); // Передаём состояние активности
    if (editImage) {
      formData.append('image', editImage);
    }

    const response = await axios.post(`${url}/api/food/update`, formData);
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
      cancelEdit();
    } else {
      toast.error(response.data.message);
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
  }, []);

  return (
    <div className="list add flex-col">
      <p>Lista wszystkich produktów</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Obraz</b>
          <b>Nazwa</b>
          <b>Категория</b>
          <b>Cena</b>
          <b>Akcja</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            {editMode === item._id ? (
              <div className="edit-form">
                <div className="edit-field">
                  <label htmlFor="name">Название</label>
                  <input type="text" name="name" value={editData.name} onChange={handleChange} />
                </div>
                <div className="edit-field">
                  <label htmlFor="description">Описание</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    rows="6"
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="category">Категория</label>
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    className="select-category">
                    <option value="Burgery">Burgery</option>
                    <option value="Kanapki">Kanapki</option>
                    <option value="Sałatki">Sałatki</option>
                    <option value="Breakfast">Śniadania</option>
                    <option value="Dla dzieci">Dla dzieci</option>
                    <option value="Zestawy">Zestawy</option>
                    <option value="Dodatki">Dodatki</option>
                    <option value="Napoje">Napoje</option>
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
                <div className="edit-field">
                  <label htmlFor="isActive">Активен</label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editData.isActive}
                    onChange={handleCheckboxChange} // Обработка изменений чекбокса
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={() => saveEdit(item._id)}>Save</button>
                  <button className="cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price} zł</p>
                <div>
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button onClick={() => removeFood(item._id)}>X</button>
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
