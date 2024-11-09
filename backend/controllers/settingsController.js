// controllers/settingsController.js
import settingsModel from '../models/settingsModel.js';

// Функция для обновления настройки приема заказов
export const updateOrdering = async (req, res) => {
  try {
    const { orderEnabled } = req.body;

    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = new settingsModel({ orderEnabled });
    } else {
      settings.orderEnabled = orderEnabled;
    }
    await settings.save();
    res.json({ success: true, message: 'Настройки обновлены', data: settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении настроек' });
  }
};

// Функция для получения текущего состояния приёма заказов
export const getOrderingStatus = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings) {
      // Если настроек нет, по умолчанию считаем, что приём заказов включён
      return res.json({ success: true, orderEnabled: true });
    }
    res.json({ success: true, orderEnabled: settings.orderEnabled });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении настроек' });
  }
};
