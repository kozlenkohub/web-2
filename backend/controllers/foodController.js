import foodModel from '../models/foodModel.js';
import fs from 'fs';

// add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    sizes: req.body.sizes ? req.body.sizes.split(',') : [], // Обработка размеров
  });

  try {
    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// update food item
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      food.image = req.file.filename;
    }

    food.name = req.body.name;
    food.description = req.body.description;
    food.price = req.body.price;
    food.category = req.body.category;
    food.sizes = req.body.sizes ? req.body.sizes.split(',') : [];

    await food.save();

    res.json({ success: true, message: 'Food Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});

    // Сортировка продуктов по категориям
    const sortedFoods = foods.sort((a, b) => a.category.localeCompare(b.category));

    res.json({ success: true, data: sortedFoods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Food Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

export { addFood, updateFood, listFood, removeFood };
