const mongoose = require('mongoose');

const enrollmentRequestSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  vin: String,
  licensePlate: String,
  status: String,
  vehiclePhoto: String,
  requestDate: { type: Date, default: Date.now },
  responseDate: { type: Date },
});

const EnrollmentRequest = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);

module.exports = EnrollmentRequest;
