// routes/headerContent.js
import express from 'express';
import HeaderContent from '../models/HeaderContent.js';

const router = express.Router();

// Получить текущие значения из базы данных
router.get('/', async (req, res) => {
  try {
    // Находим первый документ в коллекции
    let headerContent = await HeaderContent.findOne();

    // Если документ не найден, создаем его с дефолтными значениями
    if (!headerContent) {
      headerContent = new HeaderContent();
      await headerContent.save();
    }

    res.status(200).json(headerContent);
  } catch (error) {
    console.error('Error fetching header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновить значения в базе данных
router.post('/update', async (req, res) => {
  const { new: newHeader, description, button } = req.body;

  try {
    let headerContent = await HeaderContent.findOne();

    // Если документ уже существует, обновляем его
    if (headerContent) {
      headerContent.new = newHeader || headerContent.new;
      headerContent.description = description || headerContent.description;
      headerContent.button = button || headerContent.button;
    } else {
      // Создаем новый документ с переданными данными
      headerContent = new HeaderContent({
        new: newHeader,
        description: description,
        button: button,
      });
    }

    await headerContent.save();
    res.status(200).json(headerContent);
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
