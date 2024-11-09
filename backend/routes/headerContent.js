// routes/headerContent.js
import express from 'express';
import HeaderContent from '../models/HeaderContent.js';

const router = express.Router();

// Получить текущие значения из базы данных
router.get('/', async (req, res) => {
  try {
    const headerContent = await HeaderContent.findOne(); // Получаем единственный документ
    if (!headerContent) {
      return res.status(404).json({ message: 'Content not found' });
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
    if (headerContent) {
      // Если запись существует, обновляем ее
      headerContent.new = newHeader;
      headerContent.description = description;
      headerContent.button = button;
    } else {
      // Если записи нет, создаем новую
      headerContent = new HeaderContent({ new: newHeader, description, button });
    }
    await headerContent.save();
    res.status(200).json(headerContent);
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
