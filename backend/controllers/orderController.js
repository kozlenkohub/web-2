import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import settingsModel from '../models/settingsModel.js';
import { getDistanceFromLatLonInKm } from './utils.js';
import { sendAdminOrderEmail } from './emailService.js';
import { createStripeSession } from './paymentService.js';
import { sendTelegramOrderMessage } from './notificationService.js';

const frontend_url = 'https://www.burgergastrofaza.pl'; // Replace with your frontend URL

// Function to place an order
export const placeOrder = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings) {
      return res.status(500).json({ success: false, message: 'Settings not found' });
    }

    if (!settings.orderEnabled) {
      return res
        .status(403)
        .json({ success: false, message: 'Order placement is temporarily unavailable' });
    }

    const { deliveryCenter, deliveryRadius } = settings;
    const { location: userLocation } = req.body.address;
    const distance = getDistanceFromLatLonInKm(
      deliveryCenter.lat,
      deliveryCenter.lng,
      userLocation.lat,
      userLocation.lng,
    );

    let deliveryCharge = 0;
    if (distance > 1.77 && distance <= deliveryRadius) {
      deliveryCharge = 8;
    } else if (distance > deliveryRadius) {
      return res
        .status(400)
        .json({ success: false, message: 'Delivery address is outside the service area' });
    }

    const newOrder = new orderModel({
      ...req.body,
      payment: req.body.paymentMethod === 'cash',
      deliveryCharge,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (req.body.paymentMethod === 'cash') {
      await sendAdminOrderEmail(newOrder, null);
      await sendTelegramOrderMessage(newOrder);
      res.json({ success: true, message: 'Order placed with cash payment' });
    } else {
      const sessionUrl = await createStripeSession(newOrder, frontend_url);
      res.json({ success: true, session_url: sessionUrl });
    }
  } catch (error) {
    console.error('Error placing the order:', error);
    res.status(500).json({ success: false, message: 'Error placing the order' });
  }
};

// Function to verify an order
export const verifyOrder = async (req, res) => {
  const { orderId, success, sessionUrl } = req.body;
  try {
    const order = await orderModel.findById(orderId);

    if (order.notificationSent) {
      return res.status(400).json({ success: false, message: 'Order already verified' });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (success === 'true') {
      // Prevent duplicate notifications
      if (!order.notificationSent) {
        await orderModel.findByIdAndUpdate(
          orderId,
          {
            payment: true,
            paymentTime: new Date(),
            notificationSent: true,
          },
          { new: true },
        );

        await sendAdminOrderEmail(order, sessionUrl);
        await sendTelegramOrderMessage(order);
      }

      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment failed, order canceled' });
    }
  } catch (error) {
    console.error('Error confirming the order:', error);
    res.status(500).json({ success: false, message: 'Error confirming the order' });
  }
};

// Function to retrieve user orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(500).json({ success: false, message: 'Error retrieving user orders' });
  }
};

// Function to retrieve all orders
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error retrieving all orders:', error);
    res.status(500).json({ success: false, message: 'Error retrieving all orders' });
  }
};

// Function to update order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// Function to delete an order
export const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
};

export const getLastOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error retrieving last order:', error);
    res.status(500).json({ success: false, message: 'Error retrieving last order' });
  }
};

export const cleanupUnconfirmedOrders = async (req, res) => {
  try {
    const result = await orderModel.deleteMany({ notificationSent: false });
    res.json({
      success: true,
      message: 'Unconfirmed orders cleaned up successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error cleaning up unconfirmed orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up unconfirmed orders',
    });
  }
};
