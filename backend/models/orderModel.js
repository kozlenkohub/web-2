import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      comment: String, // Новое поле для комментария
    },
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentTime: { type: Date },
  paymentMethod: { type: String, required: true },
  packagingCharge: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
