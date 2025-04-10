// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Создание нового курса (только для админа)
router.post('/courses', async (req, res) => {
    const { title, description, content } = req.body;
    try {
        const course = new Course({ title, description, content });
        await course.save();
        res.json({ message: 'Курс создан', course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Редактирование курса (только для админа)
router.put('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Курс обновлен', course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение списка курсов (доступно для всех)
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение одного курса по ID (для открытия курса)
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Курс не найден' });
        }
        res.json({ course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const User = require('../models/User'); // Добавляем модель пользователей

// Получение списка пользователей (доступно только администратору)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username role'); // Получаем только логин и роль
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение одного пользователя по ID (для редактирования)
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'username role');
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удаление курса (без authMiddleware)
router.delete('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Курс не найден' });
        }
        res.json({ message: 'Курс удален' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удаление пользователя (без authMiddleware)
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ message: 'Пользователь удален' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

