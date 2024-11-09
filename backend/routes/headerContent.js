// routes/headerContent.js
const express = require('express');
const router = express.Router();

// Пример данных
let headerContent = {
  new: 'Заголовок',
  description: 'Описание',
  button: 'Кнопка',
};

// Получить текущие значения
router.get('/', (req, res) => {
  res.status(200).json(headerContent);
});

// Обновить значения
router.post('/update', (req, res) => {
  const { new: newHeader, description, button } = req.body;
  headerContent = { new: newHeader, description, button };
  res.status(200).json(headerContent);
});

module.exports = router;
