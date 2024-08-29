import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentTime: { type: Date }, // Time of payment, can be set when payment is true
  paymentMethod: { type: String, required: true }, // Payment method
  packagingCharge: { type: Number, required: true }, // Packaging fee
  deliveryCharge: { type: Number, required: true }, // Delivery fee
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
