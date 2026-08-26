import contactModel from '../models/contactModel.js';

// Получение контактных данных (создаёт запись с дефолтами, если её ещё нет)
export const getContact = async (req, res) => {
  try {
    let contact = await contactModel.findOne();
    if (!contact) {
      contact = new contactModel({});
      await contact.save();
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Ошибка при получении контактов:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении контактов' });
  }
};

// Обновление контактных данных
export const updateContact = async (req, res) => {
  try {
    const { contactUs, phone, email, address, mapUrl } = req.body;

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Некорректный email' });
    }

    let contact = await contactModel.findOne();
    if (!contact) {
      contact = new contactModel({});
    }

    if (contactUs) {
      contact.contactUs = {
        en: contactUs.en ?? contact.contactUs.en,
        ru: contactUs.ru ?? contact.contactUs.ru,
        pl: contactUs.pl ?? contact.contactUs.pl,
      };
    }
    if (phone !== undefined) contact.phone = phone;
    if (email !== undefined) contact.email = email;
    if (address !== undefined) contact.address = address;
    if (mapUrl !== undefined) contact.mapUrl = mapUrl;

    await contact.save();
    res.json({ success: true, message: 'Контакты обновлены', data: contact });
  } catch (error) {
    console.error('Ошибка при обновлении контактов:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении контактов' });
  }
};
