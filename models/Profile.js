const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  contact: {
    type: String,
    max: 20,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  vaccination: {
    type: String,
    required: true,
  },
  recovered: {
    type: String,
    required: true,
  },
  favourite: [
    {
      type: String,
      required: true,
    },
  ],
  bio: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
