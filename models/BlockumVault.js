const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VaultAction = require('../config/vaultAction');

const BlockumVaultSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    vaultAction: {
      type: String,
      enum: Object.keys(VaultAction),
      default: VaultAction.Deposit,
    },
    LPTokenAmount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('blockum-vault', BlockumVaultSchema);
