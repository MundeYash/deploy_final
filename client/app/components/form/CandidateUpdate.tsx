"use client";
import Alert from "@mui/material/Alert";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

import CryptoJS from "crypto-js";
import axios from "axios";
import { ReactNode, useState } from "react";

interface CandidateUpdateProps {
  children: ReactNode;
}

export default function CandidateUpdate({ children }: CandidateUpdateProps) {
  const [alert, setAlert] = useState(false);
  const [batchCode, setBatchCode] = useState("");
  const [formData, setFormData] = useState(children);
  const [data, setData] = useState(null);
  const [candidates, setCandidates] = useState();
  const [isCandidateUpdateOpen, setIsCandidateUpdateOpen] = useState(false); // State to control visibility


  async function handleSubmit() {
    // console.log("submit");
    setFormData({ batchCode: batchCode, ...formData });
    console.log(formData);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      "secretKey"
    ).toString();
    console.log(encryptedData);

    const response = await axios.put("http://localhost:4000/candidate/update", {
      encryptedData: encryptedData,
    });
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
    console.log(response);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  async function fetchEmployeeData(id: String) {
    try {
      // setLoading(true);
      if (id !== "") {
        const response = await axios.get(
          `http://localhost:4000/employees/${id}`
        );
        // console.log(response.data);
        setCandidates(response.data);
      }
      // setLoading(false);
    } catch (err) {
      console.log(err);
    }
    // setData(response.data);
  }
  const handleCodeChange = (event) => {
    setBatchCode(event.target.value);
  };
  return (
    <>
    
      <Card className="w-full max-w-lg mx-auto py-8 px-6 absolute z-10 right-0 mt-2 ml-auto bg-gray-100 shadow-lg ">
        <CardHeader className="text-center">
          <img
            alt="Header Logo"
            className="mx-auto h-12 w-auto"
            src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
          />

          <CardTitle className="text-2xl">Candidate Updation Form</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Batch Code {formData.batchCode}
                </InputLabel>
              </FormControl>
            </Box>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rollNumber">
                    Roll Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="Roll Number"
                    value={formData.rollNumber || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

           

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="designation">
                    Designation
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="designation"
                    placeholder="Designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="Employee ID"
                    value={formData.employeeId || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Remarks"
                  value={formData.remarks || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end  ">
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                handleSubmit();
              }}
              type="submit"
            >
              Update
            </Button>

          </div>
        </CardFooter>

        {alert && (
          <Alert
            severity="info"
            className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg"
          >
            Record Updated Successfully Close Form .
          </Alert>
        )}
      </Card>


    </>
  );
}
