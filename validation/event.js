const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateEventInput(data) {
  let errors = {};

  data.eventName = !isEmpty(data.eventName) ? data.eventName : '';
  data.sport = !isEmpty(data.sport) ? data.sport : '';
  data.player = !isEmpty(data.player) ? data.player : '';

  if (Validator.isEmpty(data.eventName)) {
    errors.eventName = '*required';
  }

  if (Validator.isEmpty(data.sport)) {
    errors.sport = '*required';
  }

  if (!Validator.isNumeric(data.player)) {
    errors.player = 'Must be a number!';
  }

  if (Validator.isEmpty(data.player)) {
    errors.player = '*required';
  } else if (data.player <= 1) {
    errors.player = 'Must be at least 2 players';
  } else if (data.player > 20) {
    errors.player = 'Must be less than 20 players';
  }

  if (Validator.isEmpty(data.vaccination)) {
    errors.vaccination = '*required';
  }

  if (Validator.isEmpty(data.level)) {
    errors.level = '*required';
  }

  if (Validator.isEmpty(data.location)) {
    errors.location = '*required';
  }

  if (Validator.isEmpty(data.startDate)) {
    errors.startDate = '*required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
