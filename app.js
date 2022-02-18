//DEPENDENCIES
require('dotenv').config();
const passport = require('passport');
// const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const User = require('./models/User');

//MIDDLEWARE
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// cors
const CORS_WHITELIST = process.env.CORS_WHITELIST.split(',');
console.log(CORS_WHITELIST);

app.use(
  cors({
    origin: CORS_WHITELIST,
    credentials: true,
  })
);

app.use(passport.initialize());

// static files middleware
app.use(express.static('public'));

// test api
app.get('/api', async (req, res) => {
  return res.send('api is work!');
});

//CONTROLLERS
// login controller

const loginController = require('./controller/login');
app.use('/api/login', loginController);

// register controller
const registerController = require('./controller/register');
app.use('/api/register', registerController);

// google login controller
const googleLogin = require('./controller/googleLogin');
app.use('/api/googleLogin', googleLogin);

// create profile controller
const createProfile = require('./controller/profile');
app.use('/api/profile', createProfile);

// create event controller
const createEvent = require('./controller/event');
app.use('/api/event', createEvent);

// attach user to the Request object/api
const attachUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  const decodedToken = jwtDecode(token.slice(7));

  if (!decodedToken) {
    return res
      .status(401)
      .json({ message: 'There was a problem authorizing the request' });
  } else {
    req.user = decodedToken;
    next();
  }
};

app.use(attachUser);

module.exports = app;
