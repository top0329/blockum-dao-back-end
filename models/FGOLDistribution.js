const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Distribution = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    FGOLTokenAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('fgol-distribution', Distribution);
