// backend/routes/upload.js

const express = require('express');
const multer  = require('multer');
const path = require('path');
const router = express.Router();

const fs = require('fs');
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Разрешенные MIME-типы
const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

// Фильтр файлов
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Недопустимый формат файла'), false);
    }
};

// Настройка хранилища
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Обновленный Multer
const upload = multer({ storage, fileFilter });

// Маршрут для загрузки файлов
router.post('/', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен. Разрешенные форматы: .jpg, .png, .pdf, .docx, .pptx' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ location: fileUrl });
});

module.exports = router;
