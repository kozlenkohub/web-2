// routes/headerContent.js
import express from 'express';
import HeaderContent from '../models/HeaderContent.js';
import axios from 'axios';

const router = express.Router();

// Эндпоинт для загрузки изображения на Imgur
router.post('/upload-image', async (req, res) => {
  try {
    const { imageBase64 } = req.body; // Ожидаем, что изображение будет передано в формате base64

    const response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: imageBase64 },
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Используем CLIENT_ID из .env файла
        },
      },
    );

    const imageUrl = response.data.data.link; // URL загруженного изображения
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    res.status(500).json({ message: 'Failed to upload image to Imgur' });
  }
});

// Эндпоинт для получения всех данных заголовка (включая URL фона)
router.get('/', async (req, res) => {
  try {
    const headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      return res.status(404).json({ message: 'Header content not found' });
    }
    res.status(200).json(headerContent); // Отправляем все данные заголовка
  } catch (error) {
    console.error('Error fetching header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Эндпоинт для обновления данных заголовка, включая URL фона
router.post('/update', async (req, res) => {
  const { new: newHeader, description, button, backgroundUrl } = req.body;

  try {
    let headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      // Если записи нет, создаем новую запись с переданными данными
      headerContent = new HeaderContent({
        new: newHeader,
        description,
        button,
        backgroundUrl,
      });
    } else {
      // Если запись существует, обновляем её данные
      headerContent.new = newHeader;
      headerContent.description = description;
      headerContent.button = button;
      headerContent.backgroundUrl = backgroundUrl;
    }

    await headerContent.save();
    res.status(200).json(headerContent);
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Эндпоинт для получения только URL фона
router.get('/background', async (req, res) => {
  try {
    const headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      return res.status(404).json({ message: 'Header content not found' });
    }
    res.status(200).json({ backgroundUrl: headerContent.backgroundUrl });
  } catch (error) {
    console.error('Error fetching header background:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Эндпоинт для обновления только URL фона
router.post('/background', async (req, res) => {
  const { backgroundUrl } = req.body;

  try {
    let headerContent = await HeaderContent.findOne();
    if (!headerContent) {
      // Если записи нет, создаем её с новым URL фона
      headerContent = new HeaderContent({ backgroundUrl });
    } else {
      // Если запись есть, обновляем URL фона
      headerContent.backgroundUrl = backgroundUrl;
    }
    await headerContent.save();
    res.status(200).json({ backgroundUrl: headerContent.backgroundUrl });
  } catch (error) {
    console.error('Error updating header background:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
