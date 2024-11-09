// models/HeaderContent.js
import mongoose from 'mongoose';

const HeaderContentSchema = new mongoose.Schema({
  new: {
    en: { type: String, required: true, default: 'Default Title' },
    ru: { type: String, required: true, default: 'Заголовок по умолчанию' },
    pl: { type: String, required: true, default: 'Domyślny tytuł' },
  },
  description: {
    en: { type: String, required: true, default: 'Default Description' },
    ru: { type: String, required: true, default: 'Описание по умолчанию' },
    pl: { type: String, required: true, default: 'Domyślny opis' },
  },
  button: {
    en: { type: String, required: true, default: 'Default Button' },
    ru: { type: String, required: true, default: 'Кнопка по умолчанию' },
    pl: { type: String, required: true, default: 'Domyślny przycisk' },
  },
});

export default mongoose.model('HeaderContent', HeaderContentSchema);
