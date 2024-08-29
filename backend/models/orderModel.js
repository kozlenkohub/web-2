import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  paymentTime: { type: Date }, // Время оплаты
  paymentMethod: { type: String, required: true }, // Метод оплаты
  packagingCharge: { type: Number, required: true }, // Оплата за упаковку
  deliveryCharge: { type: Number, required: true }, // Оплата за доставку
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
