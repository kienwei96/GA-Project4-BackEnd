const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  eventName: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  player: {
    type: Number,
    required: true,
  },
  listofplayer: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  location: {
    type: String,
  },
  vaccination: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
  },
  slot: {
    type: Boolean,
    default: false,
  },
});

module.exports = Event = mongoose.model('event', EventSchema);
