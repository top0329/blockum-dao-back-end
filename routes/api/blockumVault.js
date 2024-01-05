const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const VaultAction = require('../../config/vaultAction');
const BlockumVault = require('../../models/BlockumVault');
const User = require('../../models/User');
const History  = require('../../models/DepositHistory');

router.post(
  '/deposit',
  check('amount', 'amount is required').notEmpty(),
  check('walletAddress', 'walletAddress is required').notEmpty(),
  check('created', 'created is required').notEmpty(),
  check('type', 'type is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    try {
      const { amount, walletAddress, created, type, transactionHash, blockHash, transactionIndex  } = req.body;
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not found' }] });
      }
      const newDeposit = new BlockumVault({
        user: user._id,
        LPTokenAmount: amount,
        vaultAction: VaultAction.Deposit,
        transactionHash,
        blockHash,
        transactionIndex
      });

      console.log(newDeposit)
      await newDeposit.save();
      
      const newDepositHistory = new History({
        user: user._id,
        created, type, amount,
        transactionHash,
        blockHash,
        transactionIndex
      });

      await newDepositHistory.save();
      res.json(newDepositHistory);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/withdraw',
  check('amount', 'amount is required').notEmpty(),
  check('walletAddress', 'walletAddress is required').notEmpty(),
  check('created', 'created is required').notEmpty(),
  check('type', 'type is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    try {
      const { amount, walletAddress, created, type, transactionHash, blockHash, transactionIndex } = req.body;
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      const newWithdraw = new BlockumVault({
        user: user._id,
        LPTokenAmount: amount,
        vaultAction: VaultAction.Withdraw,
        transactionHash,
        blockHash,
        transactionIndex
      });

      console.log(newWithdraw)
      await newWithdraw.save();

      const newWithdrawtHistory = new History({
        user: user._id,
        created, type, amount,
        transactionHash,
        blockHash,
        transactionIndex
      });

      await newWithdrawtHistory.save();
      res.json(newWithdrawtHistory);
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
