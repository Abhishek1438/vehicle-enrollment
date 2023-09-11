const EnrollmentRequest = require('../models/enrollmentRequest');

// List enrollment requests submitted by the customer
exports.listCustomerEnrollmentRequests = async (req, res) => {
  try {
    // Retrieve enrollment requests submitted by the customer (you need to implement this logic)
    // const customerId = req.user.id; // Assuming you have authenticated the user

    // const customerRequests = await EnrollmentRequest.find({ customerId });
    const customerRequests = await EnrollmentRequest.find({});
    res.status(200).json(customerRequests);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit a new enrollment request
exports.submitEnrollmentRequest = async (req, res) => {
  try {
    const { make, model, year, vin, licensePlate } = req.body;

    const newEnrollmentRequest = new EnrollmentRequest({
      make,
      model,
      year,
      vin,
      licensePlate,
      status: 'Pending',
      vehiclePhoto: 'D:\\',
      // customerId: user.email, // Assuming you have authenticated the user
    });
    console.log(req.body);

    await newEnrollmentRequest.save();

    res.status(201).json({ message: 'Enrollment request created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
