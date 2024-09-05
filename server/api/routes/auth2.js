const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Operator = require("../../models/OperatorSchema");

const router = express.Router();

// Sign-up route for operator
router.post("/register2", async (req, res) => {
  const { center, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOperator = new Operator({ center, email, password: hashedPassword });
    await newOperator.save();
    res.status(201).send("Operator registered successfully");
  } catch (error) {
    res.status(500).send("Error registering operator");
  }
});

// Sign-in route for operator
router.post("/login2", async (req, res) => {
  const { email, password } = req.body;
  try {
    const operator = await Operator.findOne({ email });
    if (!operator) {
      return res.status(404).send("Operator not found");
    }
    const isMatch = await bcrypt.compare(password, operator.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ id: operator._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});



module.exports = router;
