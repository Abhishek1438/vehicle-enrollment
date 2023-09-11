const MMY = require('../models/MMY');
const EnrollmentRequest = require('../models/enrollmentRequest');

// CRUD operations for Make, Model, Year, and VIN prefixes
exports.createMMY = async (req, res) => {
  try {
    const { make, model, year, vinPrefix } = req.body;

    const existingMMY = await MMY.findOne({ make, model, year });

    if (existingMMY) {
      return res.status(400).json({ error: 'MMY combination already exists' });
    }

    const existingVinPrefix = await MMY.findOne({ vinPrefix });
    if (existingVinPrefix) {
      return res.status(400).json({ error: 'vinPrefix already exists' });
    }

    const newMMY = new MMY({ make, model, year, vinPrefix });
    await newMMY.save();

    res.status(201).json(newMMY);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMMY = async (req, res) => {
  try {
    const mmyList = await MMY.find();
    res.status(200).json(mmyList);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMMY = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, vinPrefix } = req.body;

    const updatedMMY = await MMY.findByIdAndUpdate(
      id,
      { make, model, year, vinPrefix },
      { new: true }
    );

    if (!updatedMMY) {
      return res.status(404).json({ error: 'MMY not found' });
    }

    res.status(200).json(updatedMMY);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteMMY = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMMY = await MMY.findByIdAndDelete(id);

    if (!deletedMMY) {
      return res.status(404).json({ error: 'MMY not found' });
    }

    res.status(200).json({ message: 'MMY deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List enrollment requests
exports.listEnrollmentRequests = async (req, res) => {
  try {
    const enrollmentRequests = await EnrollmentRequest.find();
    res.status(200).json(enrollmentRequests);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Accept an enrollment request
exports.acceptEnrollmentRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollmentRequest = await EnrollmentRequest.findByIdAndUpdate(
      id,
      { status: 'Accepted' },
      { new: true }
    );
    await EnrollmentRequest.findByIdAndUpdate(id, {
      $set: { responseDate: Date.now() },
    });

    if (!enrollmentRequest) {
      return res.status(404).json({ error: 'Enrollment request not found' });
    }

    res.status(200).json({ message: 'Enrollment request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reject an enrollment request
exports.rejectEnrollmentRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const enrollmentRequest = await EnrollmentRequest.findByIdAndUpdate(
      id,
      { status: 'Rejected' },
      { new: true }
    );
    await EnrollmentRequest.findByIdAndUpdate(id, {
      $set: { responseDate: Date.now() },
    });

    if (!enrollmentRequest) {
      return res.status(404).json({ error: 'Enrollment request not found' });
    }

    res.status(200).json({ message: 'Enrollment request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
