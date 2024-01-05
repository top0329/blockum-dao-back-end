const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepositHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    // FGOLTokenAmount: {
    //   type: Number,
    //   required: true,
    // },
    amount: {
      type: Number,
      require: true
    },
    created: {
      type: Date,
      require: true
    },
    type: {
      type: Boolean,
      require: true
    },
    blockHash: {
      type: String,
      require: true
    },
    transactionHash: {
      type: String,
      require: true
    },
    transactionIndex: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('deposit', DepositHistorySchema);
