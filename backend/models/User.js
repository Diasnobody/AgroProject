const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    fullName: { type: String, default: '' },  // Имя пользователя
    photoUrl: { type: String, default: '/uploads/default_photo.jpg' },  // Фото профиля
    coursesCompleted: { type: Number, default: 0 },  // Количество завершенных курсов
    progress: { type: Number, default: 0 }  // Прогресс в процентах
});

// Шифрование пароля перед сохранением
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);
