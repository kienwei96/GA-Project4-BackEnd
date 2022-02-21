require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const Event = require('../models/Event');
const validateEventInput = require('../validation/event');
const { update } = require('../models/User');

// get all event
router.get('/events/all', async (req, res) => {
  try {
    const allEvent = await Event.find({})
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(allEvent);
    return;
  } catch (error) {
    res.status(403).send({ message: `Error in get api/events/all.` + error });
    return;
  }
});

// get event by event id
router.get('/eventDetails/:id', async (req, res) => {
  try {
    const eventDetail = await Event.findById(req.params.id)
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(eventDetail);
    return;
  } catch (error) {
    res.status(403).send({ message: `Error in get api/events/all.` + error });
    return;
  }
});

// get event by event user id for joined event page
router.get('/events/joinedEvent/:id', async (req, res) => {
  try {
    const eventDetail = await Event.find({
      'listofplayer._id': { $in: req.params.id },
    })
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(eventDetail);
    return;
  } catch (error) {
    res.status(403).send({ message: `Error in get api/events/all.` + error });
    return;
  }
});

// get event by event user id for my event page
router.get('/events/myEvent/:id', async (req, res) => {
  try {
    const eventDetail = await Event.find({
      user: req.params.id,
    })
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(eventDetail);
    return;
  } catch (error) {
    res.status(403).send({ message: `Error in getting data` + error });
    return;
  }
});

// get filtered event by sport
router.get('/events/sportType', async (req, res) => {
  try {
    const filteredEvent = await Event.find(
      req.query.sport ? { sport: req.query.sport } : { sport: 'all' }
    )
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(filteredEvent);
    return;
  } catch (error) {
    res
      .status(403)
      .send({ message: `Error in get api/events/${sport}.` + error });
    return;
  }
});

// get filtered event by vaccination status
router.get('/events/vaccinationStatus', async (req, res) => {
  try {
    const filteredEvent = await Event.find(
      req.query.vaccination
        ? { vaccination: req.query.vaccination }
        : { vaccination: 'Yes' }
    )
      .populate('user', ['name'])
      .sort({ startDate: 'asc' });

    res.json(filteredEvent);
    return;
  } catch (error) {
    res
      .status(403)
      .send({ message: `Error in get api/events/${vaccination}.` + error });
    return;
  }
});

// create event
router.post('/new', async (req, res) => {
  try {
    const { errors, isValid } = validateEventInput(req.body);

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }

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

//  add player to the event
router.post('/events/join/:eventID/:userID', async (req, res) => {
  try {
    const PlayerToJoin = await User.findById(req.params.userID);
    const EventToJoin = await Event.findById(req.params.eventID);

    let count = 0;

    for (let i of EventToJoin.listofplayer) {
      console.log('i', i['_id']);
      if (String(i['_id']) === String(PlayerToJoin._id)) {
        return res.status(400).json({ error: 'You already join this event' });
      }
      count++;
    }

    if (count >= EventToJoin.player) {
      return res.status(400).json({ error: 'This event is full' });
    }

    const UpdateEvent = await Event.findByIdAndUpdate(req.params.eventID, {
      $push: { listofplayer: PlayerToJoin },
    });

    res.status(200).send({ message: 'Joined event successfully!' });
    return;
  } catch (error) {
    res.status(403).send({ message: `Event is not found!`, error });
    return;
  }
});

// get event by event user id for my event page
router.delete('/myEvent/delete/:id', async (req, res) => {
  try {
    const deleteEvent = await Event.findByIdAndDelete(req.params.id);

    res.json(deleteEvent);
    return;
  } catch (error) {
    res.status(403).send({ message: `Event not found, delete unsuccessful` });
    return;
  }
});

// get event by event user id for my event page
router.put('/joinedEvent/delete/:eventID/:userID', async (req, res) => {
  try {
    const PlayerToDelete = await User.findById(req.params.userID);
    const theEvent = await Event.findById(req.params.eventID);
    const UpdateEvent = await Event.findByIdAndUpdate(req.params.eventID, {
      $pull: {
        listofplayer: { _id: req.params.userID },
      },
    });
    console.log(UpdateEvent);
    res.json(UpdateEvent);
    return;
  } catch (error) {
    res
      .status(403)
      .send({ message: `Event not found, un-joined unsuccessful` });
    return;
  }
});

module.exports = router;
