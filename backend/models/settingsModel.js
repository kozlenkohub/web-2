// models/settingsModel.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  orderEnabled: {
    type: Boolean,
    default: true,
  },
  deliveryRadius: { type: Number, default: 5 }, // Радиус доставки в километрах
  deliveryCenter: {
    lat: Number,
    lng: Number,
  },
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
