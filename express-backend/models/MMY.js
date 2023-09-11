const mongoose = require('mongoose');

const mmySchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  vinPrefix: {
    type: String,
    required: true,
  },
});

const MMY = mongoose.model('MMY', mmySchema);

module.exports = MMY;
