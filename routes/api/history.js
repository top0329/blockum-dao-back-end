const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const VaultAction = require('../../config/vaultAction');
const BlockumVault = require('../../models/BlockumVault');
const User = require('../../models/User');
const History  = require('../../models/DepositHistory');

router.post(
  '/',
  check('amount', 'amount is required').notEmpty(),
  check('created', 'created is required').notEmpty(),
  check('type', 'created is required').notEmpty(),
  check('walletAddress', "Wallet Address is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    try {
      const { amount, created, type, walletAddress } = req.body;
      
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not found' }] });
      }
      const newDeposit = new History({
        user: user._id,
        amount, created, type
      });
      await newDeposit.save();
      res.json(newDeposit);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get(
  '/:walletAddress',
  async (req, res) => {
    const { walletAddress } = req.params;
    if (!walletAddress) {
      return res.json({ errors: 'no wallet address' });
    }

    try {
      
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not found' }] });
      }

      const deposits = await History.find({user:user._id}).sort("-created");
      res.json(deposits);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/withdraw',
  check('withdrawAmount', 'WithdrawAmount is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    try {
      const { withdrawAmount, walletAddress } = req.body;
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      const newWithdraw = new BlockumVault({
        user: user._id,
        LPTokenAmount: withdrawAmount,
        vaultAction: VaultAction.Withdraw,
      });
      await newWithdraw.save();
      res.json(newWithdraw);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/history', async (req, res) => {
  try {
    const vaultHistory = await BlockumVault.find();
    res.json(vaultHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/deposit-history', async (req, res) => {
  try {
    const vaultDepositHistory = await BlockumVault.find({vaultAction: VaultAction.Deposit});
    res.json(vaultDepositHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/withdraw-history', async (req, res) => {
  try {
    const vaultWithdrawHistory = await BlockumVault.find({vaultAction: VaultAction.Withdraw});
    res.json(vaultWithdrawHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userVaultHistory = await BlockumVault.find({
      user: req.params.id,
    });
    res.json(userVaultHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
