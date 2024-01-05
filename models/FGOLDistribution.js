const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FGOLDistributionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    FGOLTokenAmount: {
      type: Number,
      required: true,
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

module.exports = mongoose.model('fgol-distribution', FGOLDistributionSchema);
