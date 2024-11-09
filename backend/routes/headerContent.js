// routes/headerContent.js
import express from 'express';
import HeaderContent from '../models/HeaderContent.js';

const router = express.Router();

// Обновить значения в базе данных
router.post('/update', async (req, res) => {
  const { new: newHeader, description, button } = req.body;

  // Заполняем пустые значения по умолчанию
  const headerData = {
    new: {
      en: newHeader.en || '',
      ru: newHeader.ru || '',
      pl: newHeader.pl || '',
    },
    description: {
      en: description.en || '',
      ru: description.ru || '',
      pl: description.pl || '',
    },
    button: {
      en: button.en || '',
      ru: button.ru || '',
      pl: button.pl || '',
    },
  };

  try {
    let headerContent = await HeaderContent.findOne();
    if (headerContent) {
      // Обновляем существующую запись
      headerContent.new = headerData.new;
      headerContent.description = headerData.description;
      headerContent.button = headerData.button;
    } else {
      // Создаем новую запись, если нет существующей
      headerContent = new HeaderContent(headerData);
    }
    await headerContent.save();
    res.status(200).json(headerContent);
  } catch (error) {
    console.error('Error updating header content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
