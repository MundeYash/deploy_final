

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Operator = require('../models/OperatorSchema');

const router = express.Router();


// Register
router.post('/signup', async (req, res) => {
  const { center, email, password } = req.body;
  console.log(req.body)
  try {
      const userExists = await Admin.findOne({ email });
      console.log(userExists)
      if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const admin = new Admin({
          center,
          email,
          password
      });

      const res = await admin.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });
      console.log(token)
      res.status(201).json({ "message":"saved"});
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/signin', async (req, res) => {
  const { option, email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      admin: {
        id: admin.id,
        center: admin.center,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error during sign-in:', error.message);
    res.status(500).send('Server error');
  }
});



// for operator section 
//register
router.post('/signup2', async (req, res) => {
  const { center, email, password } = req.body;
  console.log(req.body)
  try {
      const userExists = await Operator.findOne({ email });
      console.log(userExists)
      if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const operator = new Operator({
          center,
          email,
          password
      });

      const res = await admin.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });
      console.log(token)
      res.status(201).json({ "message":"saved"});
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/signin2', async (req, res) => {
  const { option, email, password } = req.body;

  try {
    const operator = await Operator.findOne({ email });

    if (!operator) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await operator.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      operator: {
        id: operator.id,
        center: operator.center,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error during sign-in:', error.message);
    res.status(500).send('Server error');
  }
});




module.exports = router;


