const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user) => {
  // Sign the JWT
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      sub: user._id,
      loginID: user.loginID,
      role: user.role,
      iss: 'api.sport',
      aud: 'api.sport',
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 10 strength
    bcrypt.genSaltSync(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request',
    });
  }
  if (req.user.role !== 'user') {
    return res.status(401).json({ message: 'NOT User' });
  }
  next();
};

module.exports = {
  createToken,
  hashPassword,
  verifyPassword,
  requireUser,
};
