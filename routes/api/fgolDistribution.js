const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const FGOLDistribution = require('../../models/FGOLDistribution');
const User = require('../../models/User');

router.post(
  '/distribution',
  check('distributionAmount', 'DistributionAmount is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    try {
      const { distributionAmount, walletAddress, transactionHash, blockHash, transactionIndex } = req.body;
      let user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      const newDistribution = new FGOLDistribution({
        user: user._id,
        FGOLTokenAmount: distributionAmount,
        transactionHash,
        blockHash,
        transactionIndex
      });
      await newDistribution.save();

      console.log(newDistribution);
      res.json(newDistribution);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// router.post(
//   '/withdraw',
//   check('withdrawAmount', 'WithdrawAmount is required').notEmpty(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.json({ errors: errors.array() });
//     }
//     try {
//       const { withdrawAmount, walletAddress } = req.body;
//       let user = await User.findOne({ walletAddress });
//       if (!user) {
//         return res.status(400).json({ errors: [{ msg: 'User not found' }] });
//       }
//       const newWithdraw = new BlockumVault({
//         user: user._id,
//         amount: withdrawAmount,
//         vaultAction: VaultAction.Withdraw,
//       });
//       await newWithdraw.save();
//       res.json(newWithdraw);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

router.get('/history', async (req, res) => {
  try {
    const distributionHistory = await FGOLDistribution.find().populate('user').sort("-createdAt");
    res.json(distributionHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// router.get('/deposit-history', async (req, res) => {
//   try {
//     const vaultDepositHistory = await BlockumVault.find({
//       vaultAction: VaultAction.Deposit,
//     });
//     res.json(vaultDepositHistory);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.get('/withdraw-history', async (req, res) => {
//   try {
//     const vaultWithdrawHistory = await BlockumVault.find({
//       vaultAction: VaultAction.Withdraw,
//     });
//     res.json(vaultWithdrawHistory);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const userVaultHistory = await BlockumVault.find({
//       user: req.params.id,
//     });
//     res.json(userVaultHistory);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
