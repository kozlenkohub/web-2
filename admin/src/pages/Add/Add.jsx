import React, { useState, useEffect, useCallback } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';

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
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error('Размер изображения не должен превышать 5MB');
          }
          if (err.code === 'file-invalid-type') {
            toast.error('Неподдерживаемый формат файла');
          }
        });
      });
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setImage(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  // Очистка предварительного просмотра при размонтировании компонента
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Dodaj obraz</p>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}>
            <input {...getInputProps()} />
            {image ? (
              <img className="image" src={image.preview} alt="Preview" />
            ) : isDragActive ? (
              <p>Отпустите файл здесь...</p>
            ) : (
              <img className="image" src={assets.upload_area} alt="Upload" />
            )}
          </div>
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
