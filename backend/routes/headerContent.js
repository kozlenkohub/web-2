import express from 'express';
import HeaderContent from '../models/HeaderContent.js';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// Эндпоинт для загрузки изображения на Imgur
router.post('/upload-image', async (req, res) => {
  try {
    const { imageBase64 } = req.body; // Получаем изображение в формате base64

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // Создаем FormData и добавляем изображение в формате base64
    const formData = new FormData();
    formData.append('image', imageBase64);

    // Отправляем изображение на Imgur
    const imgurResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        ...formData.getHeaders(),
      },
    });

    const imageUrl = imgurResponse.data.data.link;

    // Находим или создаем запись HeaderContent с новым URL фона
    let headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      headerContent = new HeaderContent({ backgroundUrl: imageUrl });
    } else {
      headerContent.backgroundUrl = imageUrl;
    }
    await headerContent.save();

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// Эндпоинт для получения данных заголовка
router.get('/', async (req, res) => {
  try {
    const headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      return res.status(404).json({ success: false, message: 'Header content not found' });
    }
    res.json({ success: true, data: headerContent });
  } catch (error) {
    console.error('Error fetching header content:', error);
    res.status(500).json({ success: false, message: 'Error fetching header content' });
  }
});

// Эндпоинт для обновления текста заголовка
router.post('/update', async (req, res) => {
  const { new: newHeader, description, button, backgroundUrl } = req.body;

  try {
    let headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      // Создаем новую запись, если её нет
      headerContent = new HeaderContent({
        new: newHeader,
        description,
        button,
        backgroundUrl,
      });
    } else {
      // Обновляем существующую запись
      headerContent.new = newHeader;
      headerContent.description = description;
      headerContent.button = button;
      headerContent.backgroundUrl = backgroundUrl;
    }
    await headerContent.save();

    res.json({ success: true, message: 'Header content updated successfully' });
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({ success: false, message: 'Error updating header content' });
  }
});

export default router;
