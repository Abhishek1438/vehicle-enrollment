const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define admin endpoints
router.post('/mmy', adminController.createMMY);
router.get('/mmy', adminController.getMMY);
router.put('/mmy/:id', adminController.updateMMY);
router.delete('/mmy/:id', adminController.deleteMMY);
router.get('/requests', adminController.listEnrollmentRequests);
router.put('/requests/accept/:id', adminController.acceptEnrollmentRequest);
router.put('/requests/reject/:id', adminController.rejectEnrollmentRequest);

module.exports = router;
