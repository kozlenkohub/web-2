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

// Функция для получения текущего состояния приема заказов
export const getOrderingStatus = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings) {
      // Если настроек нет, по умолчанию считаем, что прием заказов включен
      return res.json({ success: true, orderEnabled: true });
    }
    res.json({ success: true, orderEnabled: settings.orderEnabled });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении настроек' });
  }
};

// Функция для получения текущего радиуса доставки
export const getDeliveryRadius = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Настройки не найдены' });
    }
    res.json({ success: true, deliveryRadius: settings.deliveryRadius });
  } catch (error) {
    console.error('Ошибка при получении радиуса доставки:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении радиуса доставки' });
  }
};

// Функция для обновления радиуса доставки
export const updateDeliveryRadius = async (req, res) => {
  try {
    const { deliveryRadius } = req.body;

    if (!deliveryRadius || typeof deliveryRadius !== 'number') {
      return res.status(400).json({ success: false, message: 'Некорректное значение радиуса' });
    }

    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = new settingsModel({ deliveryRadius });
    } else {
      settings.deliveryRadius = deliveryRadius;
    }
    await settings.save();
    res.json({ success: true, message: 'Радиус доставки обновлен', data: settings });
  } catch (error) {
    console.error('Ошибка при обновлении радиуса доставки:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении радиуса доставки' });
  }
};

// Функция для обновления центра доставки
export const updateDeliveryCenter = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      return res
        .status(400)
        .json({ success: false, message: 'Некорректные координаты центра доставки' });
    }

    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = new settingsModel({ deliveryCenter: { lat, lng } });
    } else {
      settings.deliveryCenter = { lat, lng };
    }
    await settings.save();
    res.json({ success: true, message: 'Центр доставки обновлен', data: settings });
  } catch (error) {
    console.error('Ошибка при обновлении центра доставки:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении центра доставки' });
  }
};

// Функция для получения текущего центра доставки
export const getDeliveryCenter = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings || !settings.deliveryCenter) {
      return res.status(404).json({ success: false, message: 'Центр доставки не найден' });
    }
    res.json({ success: true, deliveryCenter: settings.deliveryCenter });
  } catch (error) {
    console.error('Ошибка при получении центра доставки:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении центра доставки' });
  }
};
