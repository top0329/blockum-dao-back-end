const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.get('/all', async (req, res) => {
  // const users = User.find({});
  // console.log(users);
  res.send({ mgs: 'all users' });
});

// @route    POST api/users
// @desc     Connect user
// @access   Public
router.post(
  '/connect',
  check('walletAddress', 'WalletAddress is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { walletAddress } = req.body;
    try {
      let user = await User.findOne({ walletAddress });
      if (user) {
        return res.json({ msg: 'User already exists' });
      }
      // const avatar = normalize(
      //   gravatar.url(email, {
      //     s: '200',
      //     r: 'pg',s
      //     d: 'mm',
      //   }),
      //   { forceHttps: true }
      // );
      user = new User({
        walletAddress,
      });
      await user.save().then(() => {
        res.status(201).json({
          msg: 'User created successfully',
          user: user,
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/wallet-address/:id', async (req, res) => {
  try {
    const userVaultHistory = await User.find({
      _id: req.params.id,
    });
    res.json(userVaultHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
