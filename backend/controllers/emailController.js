// emailController.js

import { sendBulkEmail, sendTestEmail } from './emailService.js';

// Контроллер для массовой рассылки
export async function sendBulkEmailController(req, res) {
  const { subject, htmlContent } = req.body;

  // Проверка наличия необходимых данных
  if (!subject || !htmlContent) {
    return res.status(400).json({ message: 'Тема и содержание письма обязательны' });
  }

  try {
    await sendBulkEmail(subject, htmlContent);
    res.status(200).json({ message: 'Массовая рассылка успешно выполнена' });
  } catch (error) {
    console.error('Ошибка при выполнении массовой рассылки:', error);
    res.status(500).json({ message: 'Ошибка при выполнении массовой рассылки' });
  }
}

// Контроллер для тестовой рассылки

export async function sendTestEmailController(req, res) {
  const { subject, htmlContent } = req.body;

  // Проверка наличия необходимых данных
  if (!subject || !htmlContent) {
    return res.status(400).json({ message: 'Тема и содержание письма обязательны' });
  }

  try {
    await sendTestEmail(subject, htmlContent);
    res.status(200).json({ message: 'Тестовая рассылка успешно выполнена' });
  } catch (error) {
    console.error('Ошибка при выполнении тестовой рассылки:', error);
    res.status(500).json({ message: 'Ошибка при выполнении тестовой рассылки' });
  }
}
