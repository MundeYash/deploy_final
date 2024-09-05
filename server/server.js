const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Batch } = require("./Schema");
const { Employee } = require("./Schema");
const { Certificate } = require("./Schema");

// Assuming Schema.js contains User schema
const Admin = require("./models/Admin");
const Operator = require("./models/OperatorSchema");

const {
  remove,
  update,
  getDetails,
  getAllCanditates,
} = require("./candidateServices/candidate");

const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/authMiddleware");
const app = express();
dotenv.config();

require("./dbConnect");

connectDB();
app.use(express.json());
app.use(cors());

// this route is returning the maximum value of the batchcode
app.get("/batchCode", async (req, res) => {
  const batch = await Batch.aggregate([
    { $group: { _id: null, maxBatchCode: { $max: "$batchCode" } } },
  ]);
  console.log(batch);
  res.json(batch);
});

app.post("/submit/batch", async (req, res) => {
  const formdata = req.body;
  console.log(formdata);
  // Decrypt data
  const decryptedData = CryptoJS.AES.decrypt(
    formdata.encryptedData,
    "secretKey"
  ).toString(CryptoJS.enc.Utf8);
  const decryptedObj = JSON.parse(decryptedData);
  // Process the decrypted data
  //   console.log(decryptedObj);
  try {
    const newEmployee = new Batch(decryptedObj);

    console.log(newEmployee);
    if (await newEmployee.save()) {
      res.status(201).json({ message: "saved on database :)" }); // Send a simple response
    } else {
      throw error;
    }
  } catch (error) {
    console.log(error);
  }

  //   res.status(200).json({ message: "submited" }); // Send a simple response
});

// this route is returning all the details of the candidates with particular batchcode
app.get("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const employeeData = await Employee.find({ batchCode: id });
    res.status(200).json(employeeData);
  } catch (error) {
    res.status(500).send({ message: "Error getting employee" });
  }
});

// This route give all the batch details of particular batchcode
app.get("/batch/:code", async (req, res) => {
  const batchCode = req.params.code;
  try {
    const batchDetails = await Batch.findOne({ batchCode: batchCode });
    if (batchDetails) {
      console.log(batchDetails);
      res.status(200).json(batchDetails);
    } else {
      res.status(404).send({ message: "Batch not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// this route give all details of all the batchCode

app.get("/data", async (req, res) => {
  try {
    const data = await Batch.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          code: { $addToSet: "$batchCode" },
          description: { $addToSet: "$batchDescription" },
          name: { $addToSet: "$courseName" },
          startDate: { $addToSet: "$startDate" },
          endDate: { $addToSet: "$endDate" },
          duration: { $addToSet: "$courseDuration" },
        },
      },
    ]);

    // Extract the arrays from the result
    const result = data[0];

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/submit/employee", async (req, res) => {
  const formdata = req.body;
  console.log(formdata);

  // Decrypt data
  const decryptedData = CryptoJS.AES.decrypt(
    formdata.encryptedData,
    "secretKey"
  ).toString(CryptoJS.enc.Utf8);
  const decryptedObj = JSON.parse(decryptedData);

  // Process the decrypted data
  //   console.log(decryptedObj);
  try {
    const newEmployee = new Employee(decryptedObj);

    // console.log(newEmployee);
    if (await newEmployee.save()) {
      res.status(201).json({ message: "saved on database :)" }); // Send a simple response
    } else {
      throw error;
    }
  } catch (error) {
    console.log(error);
  }

  //   res.status(200).json({ message: "submited" }); // Send a simple response
});

//candidate services for update and delete
app.get("/candidates", getAllCanditates);
app.put("/candidate/update", update);
app.delete("/candidate/delete/:id", remove);
app.get("/candidate/:id", getDetails);

app.use(express.json({ extended: true }));
app.use("/api/auth", authRoutes);

// This route finds the highest certificate number in the Certificate collection for a all batchcodes .
app.get("/certificate/:batchCode", async (req, res) => {
  const batchCode = req.params.batchCode;
  try {
    // Find the certificate with the maximum certificate number for the given batch code
    const maxCertificate = await Certificate.findOne({})
      .sort({ certificateNumber: -1 }) // Sort in descending order by certificateNumber
      .limit(1); // Limit the result to 1 document

    console.log(maxCertificate);

    if (maxCertificate) {
      res.json({ lastCertificateNumber: maxCertificate.certificateNumber });
    } else {
      res.json({ lastCertificateNumber: 1000 }); // Default value if no certificates found
    }
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* fetching the last certificate number that is updated  */

app.post("/assignCertificates/:batchCode", async (req, res) => {
  try {
    const { batchCode } = req.params;
    const updatedCandidates = req.body;

    // Use Promise.all to wait for all save operations to complete
    const certificatePromises = updatedCandidates.map(async (candidate) => {
      // Check if the candidate already has a certificate
      const existingCertificate = await Certificate.findOne({
        "name.firstName": candidate.firstName,
        "name.lastName": candidate.lastName,
        batchCode: candidate.batchCode,
      });

      if (existingCertificate) {
        // If there's an exemption reason, update the status accordingly
        if (candidate.exemptionReason) {
          await Certificate.updateOne(
            { _id: existingCertificate._id },
            { status: candidate.exemptionReason }
          );
        } else if (
          existingCertificate.certificateNumber !== candidate.certificateNumber
        ) {
          throw new Error(
            `Duplicate certificate assignment detected for candidate ${candidate.firstName} ${candidate.lastName} with different certificate numbers.`
          );
        }
        return existingCertificate;
      }

      // Create the certificate
      const newCertificate = new Certificate({
        name: {
          firstName: candidate.firstName,
          lastName: candidate.lastName,
        },
        certificateNumber: candidate.certificateNumber,
        batchCode: candidate.batchCode,
      });

      // Save the certificate
      await newCertificate.save();

      // Update the employee with the certificate number
      await Employee.updateOne(
        { _id: candidate._id },
        { certificateNumber: candidate.certificateNumber }
      );

      return newCertificate;
    });

    // Wait for all certificates to be saved and employees to be updated
    await Promise.all(certificatePromises);

    res.send("Certificates updated successfully");
  } catch (error) {
    console.error("Error updating certificates", error);
    res.status(500).send(`Error updating certificates: ${error.message}`);
  }
});

// Update candidate status
app.post("/exemptCandidate/:candidateId", async (req, res) => {
  const { candidateId } = req.params;
  const { reason } = req.body;
  try {
    await Employee.findByIdAndUpdate(candidateId, { status: reason });
    res.status(200).send("Exemption saved successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save exemption.");
  }
});

// Assuming getCandidates is already implemented to include the status
app.get("/employees/:batchCode", async (req, res) => {
  const { batchCode } = req.params;
  try {
    const candidates = await Employee.find({ batchCode: batchCode });
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch candidates.");
  }
});
/***********************************Batch Updation  */

// Route to fetch batch details by batch code
app.get("/batch/details/:batchCode", async (req, res) => {
  const batchCode = req.params.batchCode;
  try {
    const batchDetails = await Batch.findOne({ batchCode: batchCode });
    if (batchDetails) {
      res.status(200).json(batchDetails);
    } else {
      res.status(404).json({ message: "Batch not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching batch details" });
  }
});

// Route to update batch details by batchcode
app.put("/batch/update/:batchCode", async (req, res) => {
  const batchCode = req.params.batchCode;
  const updatedData = req.body;
  try {
    const updatedBatch = await Batch.findOneAndUpdate(
      { batchCode: batchCode },
      updatedData,
      { new: true }
    );
    if (updatedBatch) {
      res.status(200).json(updatedBatch);
    } else {
      res.status(404).json({ message: "Batch not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating batch details" });
  }
});

// **************************************
// Sign-up route for admin
app.post("/api/auth/register", async (req, res) => {
  const { center, email, password, rememberMe } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      center,
      email,
      password: hashedPassword,
      rememberMe,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register admin" });
  }
});

// Sign-in route for admin
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
});

// **************************for operator section

// Sign-up route for operator
app.post("/api/auth/Register", async (req, res) => {
  const { center, email, password, rememberMe } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOperator = new Operator({
      center,
      email,
      password: hashedPassword,
      rememberMe,
    });
    await newOperator.save();
    res.status(201).json({ message: "Operator registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register Operator" });
  }
});

// Sign-in route for operator
app.post("/api/auth/Login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const operator = await Operator.findOne({ email });
    if (!operator) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, operator.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: operator._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
});

// Start the server
const port = process.env.PORT || 4000; // Choose any port you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
