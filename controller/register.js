require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const bcrypt = require('bcrypt');
const jwtDecode = require('jwt-decode');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const validateRegisterInput = require('../validation/register');

const { createToken, hashPassword, verifyPassword } = require('../util');

router.get('/test', async (req, res) => {
  return res.send('register api is work!');
});

router.post('/', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        message: errors,
      });
    }

    const { name, email } = req.body;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    const existingEmail = await User.findOne({
      email: userData.email,
    }).lean();

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (userData) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { name, email, role, setProfile, user_id, _id } = savedUser;

      const userInfo = {
        name,
        email,
        role,
        setProfile,
        user_id,
        _id,
      };

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt,
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account',
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: 'There was a problem creating your account',
    });
  }
});

module.exports = router;
