// backend/app.js

const express = require('express');
const path = require('path'); // Подключаем модуль path
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const uploadRoute = require('./routes/upload'); // Новый маршрут для загрузки файлов
const userRoutes = require('./routes/User'); // Добавляем маршруты пользователя


const app = express();



// Middleware
app.use(bodyParser.json());
app.use(cors());

// Раздача статических файлов (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Раздача файлов из папки uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Явное определение маршрута для корневого URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Подключение к MongoDB (укажите ваш connection string)
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB подключен'))
  .catch(err => console.error('Ошибка подключения к MongoDB', err));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoute); // Подключаем маршрут загрузки файлов
app.use('/api/user', userRoutes); // Добавляем маршрут пользователя

// Запуск сервера
const PORT = 3700;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

