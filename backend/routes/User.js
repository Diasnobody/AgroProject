const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const mongoose = require('mongoose');

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => { 
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});
const upload = multer({ storage });

// Получение данных пользователя
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Проверка валидности ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Некорректный ID пользователя" });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        // Успешный ответ с данными пользователя
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            photoUrl: user.photoUrl,
            coursesCompleted: user.coursesCompleted,
            progress: user.progress
        });

    } catch (err) {
        console.error("Ошибка при получении пользователя:", err);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

// Обновление данных пользователя
router.post('/:id', upload.single('photo'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = { username: req.body.username };

        // Обработка загрузки фото
        if (req.file) {
            updateData.photoUrl = `/uploads/${req.file.filename}`;
            
            // Удаление старого фото (если не дефолтное)
            const user = await User.findById(userId);
            if (user.photoUrl && !user.photoUrl.includes('default_photo')) {
                try {
                    fs.unlinkSync(path.join(__dirname, '../..', user.photoUrl));
                } catch (err) {
                    console.error("Ошибка при удалении старого фото:", err);
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);

    } catch (err) {
        console.error("Ошибка при обновлении пользователя:", err);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

module.exports = router;