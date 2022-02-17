require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const Profile = require('../models/Profile');
const validateProfileInput = require('../validation/profile');

// create profile
router.post('/new', async (req, res) => {
  try {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.body._id;

    if (req.body.contact) profileFields.contact = req.body.contact;
    if (req.body.age) profileFields.age = req.body.age;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.vaccination) profileFields.vaccination = req.body.vaccination;
    if (req.body.recovered) profileFields.recovered = req.body.recovered;
    if (req.body.favourite) profileFields.favourite = req.body.favourite;
    if (req.body.bio) profileFields.bio = req.body.bio;

    console.log('body', req.body);
    console.log('profileField', profileFields);

    const newProfile = await Profile.create(req.body);

    const foundUser = await User.findById(req.body._id);
    if (!foundUser) {
      res.status(403).send({ message: 'User ID not found!' });
      return;
    }
    const updateUser = await User.findByIdAndUpdate(req.body._id, {
      setProfile: false,
    });

    if (newProfile) {
      res.status(200).send({ message: 'New Profile is added successfully!' });
      return;
    } else {
      res.status(403).send({ message: `Something wrong, please try again.` });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Read one user profile
router.get('/:_id', async (req, res) => {
  // const userProfile = await Profile.findById(req.body._id);
  // console.log(userProfile);
  // res.status(200).send({ message: 'New Profile is added successfully!' });
  console.log(req.params._id);
  const userProfile = await Profile.findById(req.params._id);
  console.log(userProfile);
  res.status(200).send({ userProfile });
});

module.exports = router;
