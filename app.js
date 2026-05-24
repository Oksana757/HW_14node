import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';


import Category from './models/Category.js';
import Product from './models/Product.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Подключение к MongoDB 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));


// Добавление категории
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании категории', error: error.message });
  }
});

//  Добавление продукта (передаем id категории в body)
app.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании продукта', error: error.message });
  }
});

// Получение всех продуктов с подгрузкой данных категории (populate)
app.get('/products', async (req, res) => {
  try {

    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка продуктов', error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(` Сервер запущен на порту ${PORT}`);
});