const passport = require('passport');
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');
const express = require('express');
const { createToken, hashPassword, verifyPassword } = require('../util');
const User = require('../models/User');
const router = express.Router();
router.use(express.static('public'));
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let userData = {};

passport.use(
  new GoogleStrategy(
    {
      //this is to define the Google params. After user is authenticated, will trigger callback url
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: '/api/googleLogin/redirect/google',
    },
    async (accessToken, refreshToken, profile, done) => {
      //find if the user who is login through Google exist in our system
      console.log(profile);

      userData.data = profile;

      User.findOne(
        {
          //find the user by using the Google responded email.
          email: profile._json.email,
        },
        async (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            if (user.googleId == undefined) {
              user.googleId = profile.id;
              user.save();
            }
            return done(err, user);
          } else {
            user = new User({
              name: profile.displayName,
              googleId: profile.id,
              email: profile._json.email,
            });

            user.save(async (err) => {
              if (err) {
                throw err;
              }
              return done(err, user);
            });
          }
        }
      );
    }
  )
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force',
  })
); // a route that, when the button is clicked, will redirect the user to google, where they will authenticate.

router.get(
  '/redirect/google', //after authenticate successful, this URL will be triggered. Now to tell our backend to redirect user to the homepage
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    console.log('userdata is:', userData.data);
    // const token = createToken(userInfo);

    // const decodedToken = jwtDecode(token);
    // const expiresAt = decodedToken.exp;

    res.send({
      message: 'Authentication successful!',
      token: token,
      userInfo: userInfo,
      expiresAt: expiresAt,
      redirect_path: `http://localhost:3000/`,
    });
    const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Redirect browser to root of application
        window.location.href = 'http://localhost:3000/';
      </script>
    </html>       
    `;

    res.send(htmlWithEmbeddedJWT);

    // res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

module.exports = router;
