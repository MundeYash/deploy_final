const {Employee} = require('../Schema.js')
const {Batch} = require('../Schema.js')
const CryptoJS = require("crypto-js");

async function update(req,res,next) {
  const formdata = req.body;
  // Decrypt data
  const decryptedData = CryptoJS.AES.decrypt(
    formdata.encryptedData,
    "secretKey"
  ).toString(CryptoJS.enc.Utf8);
  const decryptedObj = JSON.parse(decryptedData);

  console.log(decryptedObj)
  try
    {
    const result = await Employee.findByIdAndUpdate(decryptedObj._id, {
      firstName: decryptedObj.firstName,
      lastName: decryptedObj.lastName,
      batchCode: decryptedObj.batchCode,
      rollNumber: decryptedObj.rollNumber,
      certificateNumber: decryptedObj.certificateNumber,
      designation: decryptedObj.designation,
      employeeId: decryptedObj.employee,
      phoneNumber: decryptedObj.phoneNumber,
      email: decryptedObj.email,
      remarks: decryptedObj.remarks,
    });
  console.log(result);
  res.status(201).send({message:"Candidate details updated successfully"});}
  catch(error)
  {
    res.status(500).send(error);
  }
}

async function remove(req, res, next) {
  const id = req.params.id;
  console.log(id);
try {
    const doc = await Employee.findByIdAndDelete(id);
    if (doc) {
      console.log('Deleted document:', doc);
    } else {
      console.log('No document found with that ID');
    }
    res.status(201).json({message : 'Successfully deleted'});
  } catch (err) {
    console.error('Error deleting document:', err);
  }
}

async function getDetails(req,res,next){
  const id = req.params.id;
  console.log(id);
  try{
    const response = await Employee.findById(id);
    console.log(response)
    res.status(200).json(response);
  }
  catch(err){
    res.status(400).json(err);
  } 
}

async function getAllCanditates(req, res) {
  try {
    const data = await Employee.find();
    const batchdata = await Batch.find();
    res.status(200).json({employeeData: data, batchData: batchdata});
  } catch (error) {
    res.status(500).send({ message: "Error getting employee" });
  }
}

module.exports = { update, remove ,getDetails, getAllCanditates};
