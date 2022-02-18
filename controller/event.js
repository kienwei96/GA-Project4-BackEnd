require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const Event = require('../models/Event');
const validateEventInput = require('../validation/event');

// create event
router.post('/new', async (req, res) => {
  try {
    const { errors, isValid } = validateEventInput(req.body);

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }

    console.log(req.body);

    const eventFields = {};
    eventFields.user = req.body._id;

    if (req.body.eventName) eventFields.eventName = req.body.eventName;
    if (req.body.sport) eventFields.sport = req.body.sport;
    if (req.body.location) eventFields.location = req.body.location;
    if (req.body.vaccination) eventFields.vaccination = req.body.vaccination;
    if (req.body.player) eventFields.player = req.body.player;
    if (req.body.level) eventFields.level = req.body.level;
    if (req.body.startDate) eventFields.startDate = req.body.startDate;
    if (req.body.description) eventFields.description = req.body.description;

    console.log('eventField', eventFields);

    const newEvent = await Event.create(eventFields);

    if (newEvent) {
      res.status(200).send({ message: 'New Event is added successfully!' });
      return;
    } else {
      res.status(403).send({ message: `Something wrong, please try again.` });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

module.exports = router;
