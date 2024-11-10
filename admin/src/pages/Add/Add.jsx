import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]); // Состояние для списка категорий
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgery',
  });

  // Функция для загрузки категорий с бэкенда
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/menu`);
      setCategories(response.data.map((item) => item.menu_name)); // Сохраняем только имена категорий
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      toast.error('Ошибка при загрузке категорий');
    }
  };

  useEffect(() => {
    fetchCategories(); // Загружаем категории при монтировании компонента
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Burgery',
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Ошибка при добавлении продукта');
      console.error(error);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Dodaj obraz</p>
          <label htmlFor="image">
            <img
              className="image"
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Nazwa produktu</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Wpisz tutaj"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Opis produktu</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Wpisz treść tutaj"
            required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Kategoria produktu</p>
            <select
              className="selectt"
              onChange={onChangeHandler}
              name="category"
              value={data.category}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Cena produktu</p>
            <input
              className="inputclasa"
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="20 zł"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          DODAJ
        </button>
      </form>
    </div>
  );
};

export default Add;
