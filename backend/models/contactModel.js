// models/contactModel.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // Заголовок блока контактов — переводится
  contactUs: {
    en: { type: String, default: 'CONTACT US' },
    ru: { type: String, default: 'СВЯЖИТЕСЬ С НАМИ' },
    pl: { type: String, default: 'SKONTAKTUJ SIĘ Z NAMI' },
  },
  // Данные — одинаковые для всех языков
  phone: { type: String, default: '+48-511-781-179' },
  email: { type: String, default: 'gastrofaza2024@gmail.com' },
  address: { type: String, default: 'Maślicka 160, 54-104 Wrocław' },
  // Ссылка на карту. Если пусто — генерируется автоматически из address
  mapUrl: { type: String, default: '' },
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
