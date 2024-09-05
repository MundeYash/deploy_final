"use client";

import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { CardHeader, CardContent, CardFooter, Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import axios from "axios";
import CryptoJS from "crypto-js";

interface FormData {
  batchDescription: string;
  departmentAddress: string;
  trainingMode: string;
  venueOfTraining: string;
  venueDetails?: string;
  courseName: string;
  technologyName: string;
  revenueOfBatch: string;
  courseDuration: {
    value: string;
    format: string;
  };
  startDate: string;
  endDate: string;
  participantsNo: string;
  remarks: string;
}
interface Errors {
  batchDescription: string;
  departmentAddress: string;
  trainingMode: string;
  venueOfTraining: string;
  venueDetails?: string;
  courseName: string;
  technologyName: string;
  revenueOfBatch: string;
  courseDuration: {
    value: string;
    format: string;
  };
  startDate: string;
  endDate: string;
  participantsNo: string;
  remarks: string;
}
export default function Component() {
  const [alert2, setAlert2] = useState(false);
  const [batchCode, setBatchCode] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    batchDescription: "",
    departmentAddress: "",
    trainingMode: "offline",
    venueOfTraining: "NIELIT",
    courseName: "",
    technologyName: "",
    revenueOfBatch: "",
    courseDuration: {
      value: "",
      format: "weeks",
    },
    startDate: "",
    endDate: "",
    participantsNo: "",
    remarks: "",
    venueDetails: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [data, setData] = useState([]);
  const [revenueOfBatchUnit, setRevenueOfBatchUnit] = useState("thousands");

  async function fetchBatchCode() {
    try {
      const response = await axios.get("http://localhost:4000/batchCode");
      setBatchCode(parseInt(response.data[0].maxBatchCode) + 1);
    } catch (error) {
      console.error("Error fetching batch code:", error);
    }
  }

  useEffect(() => {
    fetchBatchCode();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    if (id === "courseDurationValue" || id === "courseDurationFormat") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        courseDuration: {
          ...prevFormData.courseDuration,
          [id === "courseDurationValue" ? "value" : "format"]: value,
        },
      }));
    } else if (id === "revenueOfBatchUnit") {
      setRevenueOfBatchUnit(value);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.batchDescription)
      newErrors.batchDescription = "Batch description is required.";
    if (!formData.departmentAddress)
      newErrors.departmentAddress = "Department address is required.";
    if (!formData.trainingMode)
      newErrors.trainingMode = "Training mode is required.";
    if (!formData.venueOfTraining)
      newErrors.venueOfTraining = "Venue of training is required.";
    if (formData.venueOfTraining === "outside" && !formData.venueDetails)
      newErrors.venueDetails = "Venue details are required for outside NIELIT.";
    if (!formData.courseName) newErrors.courseName = "Course name is required.";
    if (!formData.technologyName)
      newErrors.technologyName = "Technology name is required.";
    if (!formData.revenueOfBatch) {
      newErrors.revenueOfBatch = "Revenue of batch is required.";
    } else if (parseInt(formData.revenueOfBatch) < 0) {
      newErrors.revenueOfBatch = "Revenue cannot be negative.";
    }
    if (formData.revenueOfBatch) {
      const revenue = parseInt(formData.revenueOfBatch);
      if (
        parseInt(formData.revenueOfBatch) < 0 ||
        parseInt(formData.revenueOfBatch) >= 10000000000
      ) {
        newErrors.revenueOfBatch = "Revenue must be between 0 and 10000000000.";
      }
    }
    if (!formData.courseDuration.value)
      newErrors.courseDuration = "Course duration value is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (!formData.participantsNo)
      newErrors.participantsNo = "Number of participants is required.";
    else {
      const participants = parseInt(formData.participantsNo);
      if (participants < 1 || participants > 10000) {
        newErrors.participantsNo =
          "Number of participants must be between 1 and 10000.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      batchDescription: "",
      departmentAddress: "",
      trainingMode: "offline",
      venueOfTraining: "NIELIT",
      courseName: "",
      technologyName: "",
      revenueOfBatch: "",
      courseDuration: {
        value: "",
        format: "weeks",
      },
      startDate: "",
      endDate: "",
      participantsNo: "",
      remarks: "",
      venueDetails: "",
    });
  };

  const fetchBatchCodes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/data");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching batch codes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { code, description, name, startDate, endDate, duration } = data;
  }, [data]);

  async function handleSubmit() {
    if (batchCode === null) {
      console.error("Batch code is not set.");
      return;
    }
    if (!validateForm()) {
      return;
    }
    const dataToSubmit = { ...formData, batchCode };
    console.log(dataToSubmit);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSubmit),
      "secretKey"
    ).toString();

    try {
      const response = await axios.post("http://localhost:4000/submit/batch", {
        encryptedData,
      });
      console.log(response);
      setAlert2(true);
      setTimeout(() => {
        setAlert2(false);
      }, 3000);

      resetForm();

      fetchBatchCodes(); // Fetch updated list of batch codes
      setBatchCode(""); // Reset input field
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  console.log("Data", data);

  return (
    <>
      <div className="flex flex-col items-center">
        <Card className=" w-4/5  mt-0 mb-2 bg-blue-100 shadow-lg ">
          <CardHeader className="text-center">
            <img
              alt="Header Logo"
              className="mx-auto h-12 w-auto"
              src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
            />
            <h1 className="text-2xl font-bold mt-2">Batch Entry Form</h1>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-24">
                  <Label htmlFor="batchCode" className="w-16">
                    Batch code
                  </Label>
                  {batchCode !== null && (
                    <Input
                      id="batchCode"
                      type="text"
                      disabled
                      value={batchCode}
                    />
                  )}
                </div>

                <div className="space-y-2 w-3/4 max-w-xs">
                  <Label htmlFor="batchDescription" className="w-1/4 max-w-sm">
                    Batch Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="batchDescription"
                    type="text"
                    onChange={handleChange}
                    value={formData.batchDescription}
                    placeholder="Enter batch description"
                    className="w-full"
                  />
                  {errors.batchDescription && (
                    <Alert severity="error">{errors.batchDescription}</Alert>
                  )}
                </div>
              </div>

              <div className="space-y-2 w-3/4 ">
                <Label htmlFor="departmentAddress">
                  Address of Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="departmentAddress"
                  type="text"
                  value={formData.departmentAddress}
                  onChange={handleChange}
                  placeholder="Enter departmental address"
                />

                {errors.departmentAddress && (
                  <Alert severity="error">{errors.departmentAddress}</Alert>
                )}
              </div>

              <div className="flex justify-between">
                <div className="space-y-2">
                  <Label htmlFor="trainingMode">
                    Mode of Training <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="trainingMode"
                        name="trainingMode"
                        value="online"
                        checked={formData.trainingMode === "online"}
                        onChange={handleChange}
                        className="radio-button"
                      />
                      <span>Online</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="trainingMode"
                        name="trainingMode"
                        value="offline"
                        checked={formData.trainingMode === "offline"}
                        onChange={handleChange}
                        className="radio-button"
                      />
                      <span>Offline</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="trainingMode"
                        name="trainingMode"
                        value="hybrid"
                        checked={formData.trainingMode === "hybrid"}
                        onChange={handleChange}
                        className="radio-button"
                      />
                      <span>Hybrid</span>
                    </label>
                  </div>
                  {errors.trainingMode && (
                    <Alert severity="error">{errors.trainingMode}</Alert>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 w-3/4 max-w-xs">
                    <label
                      htmlFor="venueOfTraining"
                      className=" w-3/4 max-w-xs"
                    >
                      Venue of Training <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="venueOfTraining"
                      className="select-field"
                      value={formData.venueOfTraining}
                      onChange={handleChange}
                    >
                      <option value="NIELIT">NIELIT</option>
                      <option value="outside">Outside NIELIT</option>
                    </select>
                    {errors.venueOfTraining && (
                      <Alert severity="error">{errors.venueOfTraining}</Alert>
                    )}
                  </div>
                </div>

                {formData.venueOfTraining === "outside" && (
                  <div className="space-y-2">
                    <Label htmlFor="venueDetails">
                      Venue Details <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="venueDetails"
                      type="text"
                      onChange={handleChange}
                      value={formData.venueDetails}
                      placeholder="Enter venue details"
                    />
                    {errors.venueDetails && (
                      <Alert severity="error">{errors.venueDetails}</Alert>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-3/4 max-w-xs">
                  <Label htmlFor="courseName">
                    Course Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="courseName"
                    type="text"
                    onChange={handleChange}
                    value={formData.courseName}
                    placeholder="Enter course name"
                  />
                  {errors.courseName && (
                    <Alert severity="error">{errors.courseName}</Alert>
                  )}
                </div>
                <div className="space-y-2 w-4/5 max-w-xs">
                  <Label htmlFor="technologyName">
                    Technology Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="technologyName"
                    type="text"
                    onChange={handleChange}
                    value={formData.technologyName}
                    placeholder="Enter technology name"
                  />
                  {errors.technologyName && (
                    <Alert severity="error">{errors.technologyName}</Alert>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-3/4 max-w-xs">
                  <Label htmlFor="revenueOfBatch">
                    Revenue of Batch <span className="text-red-500">*</span>
                  </Label>

                  <div className="flex space-x-2">
                    <Input
                      id="revenueOfBatch"
                      type="number"
                      min="0"
                      onChange={handleChange}
                      value={formData.revenueOfBatch}
                      placeholder="Enter revenue of batch"
                      max="10000000000" // Restrict input value up to 1000000
                    />
                    {errors.revenueOfBatch && (
                      <Alert severity="error">{errors.revenueOfBatch}</Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-3/4 max-w-xs">
                  <label
                    htmlFor="courseDurationFormat"
                    className="w-3/4 max-w-xs"
                  >
                    Course Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="courseDurationValue"
                      type="number"
                      min="0"
                      onChange={handleChange}
                      value={formData.courseDuration.value}
                      placeholder="Enter Duration"
                    />
                    <select
                      id="courseDurationFormat"
                      className="select-field"
                      value={formData.courseDuration.format}
                      onChange={handleChange}
                    >
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  {errors.courseDuration && (
                    <Alert severity="error">
                      {errors.courseDuration.value +
                        errors.courseDuration.format}
                    </Alert>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-36">
                  <Label htmlFor="startDate" className="w-36">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    onChange={handleChange}
                    value={formData.startDate}
                  />
                  {errors.startDate && (
                    <Alert severity="error">{errors.startDate}</Alert>
                  )}
                </div>
                <div className="space-y-2 w-36 ">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    onChange={handleChange}
                    value={formData.endDate}
                  />
                  {errors.endDate && (
                    <Alert severity="error">{errors.endDate}</Alert>
                  )}
                </div>
              </div>

              <div className="space-y-2 w-1/4 max-w-xs">
                <Label htmlFor="participantsNo w-1/4 max-w-xs">
                  Total Number of Participants{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participantsNo"
                  type="number"
                  min="0"
                  onChange={handleChange}
                  value={formData.participantsNo}
                  placeholder="Enter number of participants"
                />
                {errors.participantsNo && (
                  <Alert severity="error">{errors.participantsNo}</Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  onChange={handleChange}
                  value={formData.remarks}
                  placeholder="Enter remarks"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>

      {alert2 && <Alert severity="success">Form submitted successfully!</Alert>}
    </>
  );
}
