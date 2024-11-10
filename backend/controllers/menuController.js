import axios from 'axios';
import Menu from '../models/Menu.js';
import FormData from 'form-data';

// Получить все элементы меню
export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Добавить новый элемент меню с загрузкой изображения на Imgur
export const addMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));

    const imgurResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        ...formData.getHeaders(),
      },
    });

    const imageUrl = imgurResponse.data.data.link;
    const { menu_name } = req.body;

    const menu = new Menu({
      menu_name,
      menu_image: imageUrl,
    });

    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Обновить существующий элемент меню
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_name } = req.body;

    let imageUrl;
    if (req.file) {
      const formData = new FormData();
      formData.append('image', req.file.buffer.toString('base64'));

      const imgurResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          ...formData.getHeaders(),
        },
      });

      imageUrl = imgurResponse.data.data.link;
    }

    const updatedData = {
      menu_name: menu_name || undefined,
      ...(imageUrl && { menu_image: imageUrl }),
    };

    const updatedMenu = await Menu.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
