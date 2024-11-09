// models/settingsModel.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  orderEnabled: {
    type: Boolean,
    default: true,
  },
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
