const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    default: 'player',
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  setProfile: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  googleId: {
    required: false,
    type: String,
  },
});

UserSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

module.exports = mongoose.model('user', UserSchema);
