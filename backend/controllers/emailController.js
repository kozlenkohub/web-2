import { sendBulkEmail } from './emailService.js';
import userModel from '../models/userModel.js'; // Подключаем модель пользователя

// Контроллер для массовой рассылки
export async function sendBulkEmailController(req, res) {
  const { subject, htmlContent } = req.body;

  // Проверка наличия необходимых данных
  if (!subject || !htmlContent) {
    return res.status(400).json({ message: 'Тема и содержание письма обязательны' });
  }

  try {
    // Получаем всех пользователей, которые подписаны на рассылку
    const usersToNotify = await userModel.find({ isSubscribed: true });

    // Собираем массив email-ов для рассылки
    const emails = usersToNotify.map((user) => user.email);

    // Отправляем массовую рассылку только подписанным пользователям
    await sendBulkEmail(subject, htmlContent, emails);

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

// Контроллер для отписки от рассылки
export async function unsubscribeEmailController(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email обязателен' });
  }

  try {
    const user = await userModel.findOneAndUpdate(
      { email },
      { isSubscribed: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({ message: 'Вы успешно отписаны от рассылки' });
  } catch (error) {
    console.error('Ошибка при отписке от рассылки:', error);
    res.status(500).json({ message: 'Ошибка при отписке от рассылки' });
  }
}

export async function getUnsubscribedUsersController(req, res) {
  try {
    // Получаем всех пользователей, которые не подписаны на рассылку
    const unsubscribedUsers = await userModel.find({ isSubscribed: false });

    if (unsubscribedUsers.length === 0) {
      return res
        .status(404)
        .json({ message: 'Нет пользователей, которые не подписаны на рассылку' });
    }

    res.status(200).json({ unsubscribedUsers });
  } catch (error) {
    console.error('Ошибка при получении пользователей, не подписанных на рассылку:', error);
    res
      .status(500)
      .json({ message: 'Ошибка при получении пользователей, не подписанных на рассылку' });
  }
}
