const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
// Define customer endpoints

router.get(
  '/requests',
  upload.single('vehiclePhoto'),
  customerController.listCustomerEnrollmentRequests
);
router.post('/submit-request', customerController.submitEnrollmentRequest);

module.exports = router;
