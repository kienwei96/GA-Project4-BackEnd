const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // data.favoriteSport = !isEmpty(data.favoriteSport) ? data.favoriteSport : '';

  if (Validator.isEmpty(data.contact)) {
    errors.contact = 'Contact number is required';
  }

  if (!Validator.isLength(data.contact, { min: 8, max: 20 })) {
    errors.contact = '*required';
  }

  if (Validator.isEmpty(data.gender)) {
    errors.gender = '*required';
  }

  if (Validator.isEmpty(data.location)) {
    errors.location = '*required';
  }
  if (Validator.isEmpty(data.age)) {
    errors.age = '*required';
  }
  if (Validator.isEmpty(data.vaccination)) {
    errors.vaccination = '*required';
  }
  if (Validator.isEmpty(data.recovered)) {
    errors.recovered = '*required';
  }
  // if (Validator.isEmpty(data.favourite)) {
  //   errors.favourite = 'At least one favourite sport is required';
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
