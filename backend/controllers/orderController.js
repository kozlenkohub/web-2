// orderController.js

import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import { getDistanceFromLatLonInKm } from './utils.js';
import { sendAdminOrderEmail } from './emailService.js';
import { createStripeSession } from './paymentService.js';
import { sendTelegramOrderMessage } from './notificationService.js';
import settingsModel from '../models/settingsModel.js';

const frontend_url = 'https://www.burgergastrofaza.pl'; // Replace with your URL

// Function to place an order
export const placeOrder = async (req, res) => {
  try {
    // Check if order creation is enabled
    const settings = await settingsModel.findOne();
    if (settings && !settings.orderEnabled) {
      return res
        .status(403)
        .json({ success: false, message: 'Order placement is temporarily unavailable' });
    }

    const deliveryCenter = { lat: 51.154, lng: 16.9305 };
    const userLocation = req.body.address.location;
    const distance = getDistanceFromLatLonInKm(
      deliveryCenter.lat,
      deliveryCenter.lng,
      userLocation.lat,
      userLocation.lng,
    );

    let deliveryCharge = 0;
    if (distance <= 1.77) {
      deliveryCharge = 0;
    } else if (distance > 1.77 && distance <= 5) {
      deliveryCharge = 8;
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Delivery address is outside the service area' });
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      payment: req.body.paymentMethod === 'cash' ? true : false,
      packagingCharge: req.body.packagingCharge,
      deliveryCharge: deliveryCharge,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (req.body.paymentMethod === 'cash') {
      // For cash payment, send notifications immediately
      await sendAdminOrderEmail(newOrder, null);
      await sendTelegramOrderMessage(newOrder);
      res.json({ success: true, message: 'Order placed with cash payment' });
    } else {
      // Create Stripe payment session
      const sessionUrl = await createStripeSession(newOrder, frontend_url);
      res.json({ success: true, session_url: sessionUrl });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error placing the order' });
  }
};

// Function to verify an order
export const verifyOrder = async (req, res) => {
  const { orderId, success, sessionUrl } = req.body;
  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (success === 'true') {
      // Check if notification has already been sent
      if (!order.notificationSent) {
        await orderModel.findByIdAndUpdate(
          orderId,
          {
            payment: true,
            paymentTime: new Date(),
            notificationSent: true, // Set flag to prevent duplicate notifications
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
    console.log(error);
    res.status(500).json({ success: false, message: 'Error confirming the order' });
  }
};

// Function to retrieve user orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving user orders' });
  }
};

// Function to retrieve all orders
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving all orders' });
  }
};

// Function to update order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// Function to delete an order
export const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
};

export const getLastOrder = async (req, res) => {
  try {
    const lastOrder = await orderModel.findOne({ userId: req.userId }).sort({ date: -1 });
    if (lastOrder) {
      res.json({ success: true, order: lastOrder });
    } else {
      res.json({ success: false, message: 'No previous orders' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving last order' });
  }
};
