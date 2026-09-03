const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// === РЕГИСТРАЦИЯ ===
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Проверяем, есть ли уже такой пользователь
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Этот email уже зарегистрирован' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, full_name`,
      [email, hashedPassword, fullName || email.split('@')[0]]
    );

    // Создаём JWT-токен
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'secret_key_change_me',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Регистрация успешна!',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// === ВХОД ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = result.rows[0];

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Создаём JWT-токен
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret_key_change_me',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Вход выполнен!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

module.exports = router;
