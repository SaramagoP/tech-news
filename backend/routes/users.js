const express = require('express');
const router = express.Router();
require('../models/connection');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

// route to create a new account
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields !' });
    return;
  }

  // check if an user has already been registered

  User.findOne({
    // check if user exists in database
    username: { $regex: new RegExp(req.body.username, 'i') },
  }).then((data) => {
    // if user doesn't exist, create a new user
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists !' });
    }
  });
});

// route to sign in
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields !' });
    return;
  }

  User.findOne({
    // check if user exists in database
    username: { $regex: new RegExp(req.body.username, 'i') },
  }).then((data) => {
    // if user exists, check if password is correct
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      // if user doesn't exist or password is incorrect
      res.json({ result: false, error: 'User not found' });
    }
  });
});

// route to check if user can bookmark
router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ result: true, canBookmark: data.canBookmark });
    } else {
      res.json({ result: false, error: 'User not found !' });
    }
  });
});

module.exports = router;
