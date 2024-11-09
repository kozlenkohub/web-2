// routes/headerContent.js
const express = require('express');
const router = express.Router();

let headerContent = {
  new: {
    en: 'Title',
    ru: 'Заголовок',
    pl: 'Tytuł',
  },
  description: {
    en: 'Description',
    ru: 'Описание',
    pl: 'Opis',
  },
  button: {
    en: 'Button',
    ru: 'Кнопка',
    pl: 'Przycisk',
  },
};

// Получить текущие значения для всех языков
router.get('/', (req, res) => {
  res.status(200).json(headerContent);
});

// Обновить значения для всех языков
router.post('/update', (req, res) => {
  const { new: newHeader, description, button } = req.body;
  headerContent = { new: newHeader, description, button };
  res.status(200).json(headerContent);
});

module.exports = router;
