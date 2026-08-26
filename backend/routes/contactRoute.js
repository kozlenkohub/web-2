import express from 'express';
import { getContact, updateContact } from '../controllers/contactController.js';

const router = express.Router();

// Получение контактных данных (используется фронтендом и админкой)
router.get('/', getContact);

// Обновление контактных данных из админки
router.post('/update', updateContact);

export default router;
