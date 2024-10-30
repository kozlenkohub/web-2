import axios from 'axios';
import foodModel from '../models/foodModel.js';
import FormData from 'form-data';

// Add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));

    const imgurResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        ...formData.getHeaders(),
      },
    });

    const imageUrl = imgurResponse.data.data.link;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      description_en: req.body.description_en || '', // Default empty string
      description_ru: req.body.description_ru || '', // Default empty string
      price: req.body.price,
      category: req.body.category,
      image: imageUrl,
      sizes: req.body.sizes ? req.body.sizes.split(',') : [],
      isActive: req.body.isActive || true,
    });

    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error adding food' });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    if (req.file) {
      const formData = new FormData();
      formData.append('image', req.file.buffer.toString('base64'));

      const imgurResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          ...formData.getHeaders(),
        },
      });

      food.image = imgurResponse.data.data.link;
    }

    food.name = req.body.name;
    food.description = req.body.description;
    food.description_en = req.body.description_en || food.description_en;
    food.description_ru = req.body.description_ru || food.description_ru;
    food.price = req.body.price;
    food.category = req.body.category;
    food.sizes = req.body.sizes ? req.body.sizes.split(',') : [];
    food.isActive = req.body.isActive;

    await food.save();
    res.json({ success: true, message: 'Food Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error updating food' });
  }
};

// All food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    const sortedFoods = foods.sort((a, b) => a.category.localeCompare(b.category));

    res.json({ success: true, data: sortedFoods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching food list' });
  }
};

// Active food list (только активные продукты)
const listActiveFood = async (req, res) => {
  try {
    const foods = await foodModel.find({ isActive: true });
    const sortedFoods = foods.sort((a, b) => a.category.localeCompare(b.category));

    res.json({ success: true, data: sortedFoods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching active food list' });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: 'Food Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error removing food' });
  }
};

export { addFood, updateFood, listFood, removeFood, listActiveFood };
