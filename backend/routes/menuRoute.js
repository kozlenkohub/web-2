import express from 'express';
import multer from 'multer';
import { getMenus, addMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';

const router = express.Router();
const upload = multer();

// Маршрут для получения всех элементов меню
router.get('/', getMenus);

router.delete('/:id', deleteMenu);

// Маршрут для добавления нового элемента меню с изображением
router.post('/', upload.single('image'), addMenu);

// Маршрут для обновления существующего элемента меню с изображением
router.put('/:id', upload.single('image'), updateMenu);

export default router;
