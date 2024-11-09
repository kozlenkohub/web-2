import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      comment: String, // Поле для комментария
    },
  ],
  amount: { type: Number, required: true },
  address: {
    firstName: { type: String, required: true },
    address: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentTime: { type: Date },
  paymentMethod: { type: String, required: true },
  packagingCharge: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  emailSent: { type: Boolean, default: false }, // Поле для отслеживания отправки письма
  deliveryTime: { type: Number },
  deliveryTimeEmailSent: { type: Boolean, default: false },
  notificationSent: { type: Boolean, default: false },
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
