"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Alert from "@mui/material/Alert";
import { CardHeader, CardContent, CardFooter, Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ShowBatchDetails from "../certificate/ShowBatchDetails";
import { SelectChangeEvent } from '@mui/material';

type AlertType = "error" | "info" | "success" | "warning" | "";

interface AlertState {
  type: AlertType;
  message: string;
}

interface FormData {
  batchDescription: string;
  departmentAddress: string;
  trainingMode: string;
  venueOfTraining: string;
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
  venueDetails: string;
}

interface FormData {
  [key: string]: any;
}

export default function Component() {
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

  const [batchCode, setBatchCode] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = React.useState<AlertState>({ type: '', message: '' });

  const [errors, setErrors] = useState<FormData>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (batchCode) {
      fetchBatchDetails(batchCode);
    }
  }, [batchCode]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/data");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const fetchBatchDetails = async (code: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/batch/details/${code}`
      );
      const batchData = response.data;

      // Convert date strings to YYYY-MM-DD format for input fields
      batchData.startDate = new Date(batchData.startDate)
        .toISOString()
        .split("T")[0];
      batchData.endDate = new Date(batchData.endDate)
        .toISOString()
        .split("T")[0];

      setFormData(batchData);
      // setFormData(response.data);
    } catch (err) {
      console.error("Error fetching batch details", err);
    }
  };

  const handleCodeChange = (event: SelectChangeEvent<string | null>) => {
    setBatchCode(event.target.value as string);
  };

  // Modified handleInputChange to handle courseDuration separately
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "courseDurationValue" || name === "courseDurationFormat") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        courseDuration: {
          ...prevFormData.courseDuration,
          [name === "courseDurationValue" ? "value" : "format"]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Form validation function
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
      if (revenue < 0 || revenue > 10000000000) {
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
  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);

    // Convert dates back to ISO format before sending to backend
    const updatedFormData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      await axios.put(
        `http://localhost:4000/batch/update/${batchCode}`,
        updatedFormData
      );
      setAlert({
        type: "success",
        message: "Batch details updated successfully",
      });
      // Clear the alert after 5 seconds
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 5000);
    } catch (err) {
      console.error("Error updating batch details", err);
      setAlert({ type: "error", message: "Error updating batch details" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="flex justify-center">
        <ShowBatchDetails batchCode={batchCode} />
      </div>

      <div className="mt-0 mb-2 flex flex-col items-center">
        <Card className=" w-4/5  mt-0 mb-2 bg-blue-100 shadow-lg ">
          <CardHeader className="text-center">
            <img
              alt="Header Logo"
              className="mx-auto h-12 w-auto"
              src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
            />
            <h1 className="text-2xl font-bold mt-2">Batch Update Form</h1>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-center space-x-4">
                <Box sx={{ minWidth: 120 }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">
                      Select Batch Code
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={batchCode}
                      label="Select Batch Code"
                      onChange={handleCodeChange}
                    >
                      {data &&
                        data.code.sort().map((item: string, index: number)=> (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-3/4 max-w-xs">
                  <Label htmlFor="batchDescription" className="w-1/4 max-w-sm">
                    Batch Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="batchDescription"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.batchDescription}
                    className="w-full"
                  />

                  {errors.batchDescription && (
                    <Alert severity="error">{errors.batchDescription}</Alert>
                  )}
                </div>
              </div>

              <div className="space-y-2 w-3/4 ">
                <Label htmlFor="departmentAddress">Address of Department</Label>
                <Input
                  name="departmentAddress"
                  id="departmentAddress"
                  type="text"
                  value={formData.departmentAddress}
                  onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
               
                    <label id="venueOfTrainingLabel"className="w-3/4 max-w-xs"  htmlFor="venueOfTraining">Venue of Training <span className="text-red-500">*</span></label>
                      
                    
                    <select
                      id="venueOfTraining"
                      name="venueOfTraining" // Added name attribute
                      className="select-field"
                      value={formData.venueOfTraining}
                      onChange={handleInputChange}
                       aria-labelledby="venueOfTrainingLabel"
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
                      name="venueDetails"
                      id="venueDetails"
                      type="text"
                      onChange={handleInputChange}
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
                    name="courseName"
                    id="courseName"
                    type="text"
                    onChange={handleInputChange}
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
                    name="technologyName"
                    id="technologyName"
                    type="text"
                    onChange={handleInputChange}
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
                      name="revenueOfBatch"
                      id="revenueOfBatch"
                      type="number"
                      min="0"
                      onChange={handleInputChange}
                      value={formData.revenueOfBatch}
                      placeholder="Enter revenue of batch"
                      max="1000" // Restrict input value up to 1000000
                    />
                    {errors.revenueOfBatch && (
                      <Alert severity="error">{errors.revenueOfBatch}</Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-3/4 max-w-xs">
                  <label htmlFor="courseDurationFormat" className="w-3/4 max-w-xs">
                    Course Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      name="courseDurationValue"
                      id="courseDurationValue"
                      type="number"
                      min="0"
                      onChange={handleInputChange}
                      value={formData.courseDuration.value}
                      placeholder="Enter Duration"
                    />
                    <select
                      name="courseDurationFormat"
                      id="courseDurationFormat"
                      className="select-field"
                      value={formData.courseDuration.format}
                      onChange={handleInputChange}
                      
                    >
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  {errors.courseDuration && (
                    <Alert severity="error">{errors.courseDuration.value} {errors.courseDuration.format}</Alert>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 w-36">
                  <Label htmlFor="startDate" className="w-36">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="startDate"
                    id="startDate"
                    type="date"
                    onChange={handleInputChange}
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
                    name="endDate"
                    id="endDate"
                    type="date"
                    onChange={handleInputChange}
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
                  name="participantsNo"
                  id="participantsNo"
                  type="number"
                  min="0"
                  onChange={handleInputChange}
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
                  name="remarks"
                  id="remarks"
                  onChange={handleInputChange}
                  value={formData.remarks}
                  placeholder="Enter remarks"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit}>Update</Button>
          </CardFooter>
        </Card>
      </div>

      {alert.message && (
        <Alert
          severity={alert.type || undefined}
          onClose={() => setAlert({ type: "", message: "" })}
        >
          {alert.message}
        </Alert>
      )}
    </>
  );
}
