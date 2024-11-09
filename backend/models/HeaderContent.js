// models/HeaderContent.js
import mongoose from 'mongoose';

const HeaderContentSchema = new mongoose.Schema({
  new: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    pl: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    pl: { type: String, required: true },
  },
  button: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    pl: { type: String, required: true },
  },
});

export default mongoose.model('HeaderContent', HeaderContentSchema);
