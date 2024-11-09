// models/HeaderContent.js
import mongoose from 'mongoose';

const HeaderContentSchema = new mongoose.Schema({
  new: {
    en: { type: String, default: 'Default Title' },
    ru: { type: String, default: 'Заголовок по умолчанию' },
    pl: { type: String, default: 'Domyślny tytuł' },
  },
  description: {
    en: { type: String, default: 'Default Description' },
    ru: { type: String, default: 'Описание по умолчанию' },
    pl: { type: String, default: 'Domyślny opis' },
  },
  button: {
    en: { type: String, default: 'Default Button' },
    ru: { type: String, default: 'Кнопка по умолчанию' },
    pl: { type: String, default: 'Domyślny przycisk' },
  },
  backgroundUrl: { type: String, default: 'https://i.imgur.com/kaSyxLZ.jpeg' }, // Добавляем URL фона
});

export default mongoose.model('HeaderContent', HeaderContentSchema);
