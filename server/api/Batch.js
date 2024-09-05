const express = require('express');
const router = express.Router();
// Assuming you have a Batch model set up for querying the database
const Batch = require('../Schema');

router.get('/api/batch/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const batchDetails = await Batch.findById(batchId);
    if (!batchDetails) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batchDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;