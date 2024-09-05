"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SelectChangeEvent } from '@mui/material/Select';
import Alert from "@mui/material/Alert";
import {
  CardTitle,

  CardHeader
} from "../ui/card";

import { Button } from "../ui/button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ShowBatchDetails from "./ShowBatchDetails";



interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  designation: string;
  employeeId: string;
  phoneNumber: string;
  certificateNumber?: string;
  status?: string;
}

interface FormData {
  [key: string]: any;
}
// Define a function to map or validate alert.type
const getAlertSeverity = (type: string): 'error' | 'warning' | 'info' | 'success' | undefined => {
  switch (type) {
    case 'error':
    case 'warning':
    case 'info':
    case 'success':
      return type;
    default:
      return undefined; // or handle invalid types appropriately
  }
};


export default function Component() {
  const [batchCode, setBatchCode] = useState<string | null>(null);
  
  const [data, setData] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  


  const [selectedReason, setSelectedReason] = useState("");

  // Replace showExemptionReason state with selectedCandidateForExemption
  const [selectedCandidateForExemption, setSelectedCandidateForExemption] =
    useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (batchCode) {
      fetchEmployeeData(batchCode);
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

  const cancelExemption = (id: string) => {
    if (selectedCandidateForExemption === id) {
      setSelectedCandidateForExemption(null);
      setSelectedReason("");
    }
  };

  const fetchEmployeeData = async (id: string) => {
    try {
      if (id) {
        const response = await axios.get(
          `http://localhost:4000/employees/${id}`
        );
        setCandidates(
          response.data.filter(
            (candidate: Candidate) => !candidate.certificateNumber
          )
        );
      }
    } catch (err) {
      console.error("Error fetching employee data", err);
    }
  };

  // Function to handle the exemption of a candidate

  const handleExemptCandidate = async (candidateId: string) => {
    if (!selectedReason) return;
    try {
      await axios.post(`http://localhost:4000/exemptCandidate/${candidateId}`, {
        reason: selectedReason,
      });
      setCandidates(
        candidates.filter((candidate) => candidate._id !== candidateId)
      );
      setSelectedCandidateForExemption(null);
      setSelectedReason("");
      setAlert({ type: "success", message: "Exemption saved successfully." });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000); // Hide alert after 5 seconds
    } catch (error) {
      console.error("Failed to save exemption reason:", error);
      setAlert({ type: "error", message: "Failed to exempt candidate." });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000); // Hide alert after 5 seconds
    }
  };

  // Modify showExemptionReasonDropdown to accept a candidate ID
  const showExemptionReasonDropdown = (id: string) => {
    setSelectedCandidateForExemption(id);
  };
  const handleCodeChange = (event: SelectChangeEvent<string | null>) => {
    setBatchCode(event.target.value as string);
  };

  const generateCertificates = async () => {
    try {
      // Fetch the last certificate number assigned for the given batchCode
      const response = await axios.get(
        `http://localhost:4000/certificate/${batchCode}`
      );
      let maxCertNumber = response.data.lastCertificateNumber;

      // Update candidates with new certificate numbers locally
      const updatedCandidates = candidates.map((candidate) => {
        maxCertNumber += 1;
        return {
          ...candidate,
          certificateNumber: `${maxCertNumber}`,
        };
      });

      // Update the state with the new candidate data
      setCandidates(updatedCandidates);

      //send the updated candidate data to the server
      const res = await axios.post(
        `http://localhost:4000/assignCertificates/${batchCode}`,
        updatedCandidates
      );

      setAlert({
        type: "success",
        message:
          "Certificate numbers assigned successfully! and removed from table after 5 seconds",
      });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000); // Hide alert after 5 seconds
      // Remove candidates after assigning certificate numbers
      setTimeout(() => {
        setCandidates([]);
      }, 5000); // Adjust time as needed
    } catch (error) {
      console.error("Error generating certificates", error);
      setAlert({
        type: "error",
        message: "Failed to assign certificate numbers.",
      });
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <CardHeader className="justify-between mt-0 ">
        <img
          alt="Header Logo"
          className="mx-auto h-12 w-auto"
          src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
        />
        <CardTitle className="text-2xl text-center">Assign Certificate Numbers </CardTitle>
      </CardHeader>

      <div className="mt-0 mb-4">
        <div className="flex justify-center">
          <ShowBatchDetails batchCode={batchCode} />
        </div>

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
                  data.code.sort().map((item: string, index: number) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>} */}
        {alert.message && <Alert severity={getAlertSeverity(alert.type)}>{alert.message}</Alert>}

        {batchCode && (
          <div className="container my-8 mx-auto p-4 bg-white rounded shadow mb-4">
            <h2 className="text-2xl font-bold text-center mb-6">Candidates</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">S. No.</th>
                  <th className="py-2 px-4 border"> Name</th>
                  <th className="py-2 px-4 border">Roll Number</th>
                  <th className="py-2 px-4 border">Designation</th>
                  <th className="py-2 px-4 border">Employee ID</th>
                  <th className="py-2 px-4 border">Phone Number</th>
                  <th className="py-2 px-4 border">Certificate Number</th>
                  <th className="py-2 px-4 border">Status</th>{" "}
                  {/* Added Status column */}
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {candidate.firstName + " " + candidate.lastName}
                    </td>

                    <td className="py-2 px-4 border">{candidate.rollNumber}</td>

                    <td className="py-2 px-4 border">
                      {candidate.designation}
                    </td>
                    <td className="py-2 px-4 border">{candidate.employeeId}</td>
                    <td className="py-2 px-4 border">
                      {candidate.phoneNumber}
                    </td>
                    <td className="py-2 px-4 border">
                      {candidate.certificateNumber}
                    </td>
                    <td className="py-2 px-4 border">
                      {candidate.status || "okay"}{" "}
                      {/* Displaying status with default "okay" */}
                    </td>

                    <td className="py-2 px-4 border">
                      <div className="flex space-x-2">
                        <label htmlFor="reason-select">Select Reason</label>
                        {selectedCandidateForExemption === candidate._id ? (
                          
                          <select
                          id="reason-select" 
                            onChange={(e) => setSelectedReason(e.target.value)}
                            defaultValue="Select Reason"
                          >
                            <option disabled>Select Reason</option>
                            <option value="Absent">Absent</option>
                            <option value="Less Attendance">
                              Less Attendance
                            </option>
                            <option value="Failed Exam">Failed Exam</option>
                            <option value="Others">Others</option>
                          </select>
                        ) : (
                          <Button
                            onClick={() =>
                              showExemptionReasonDropdown(candidate._id)
                            }
                          >
                            Exempt
                          </Button>
                        )}
                        {selectedReason &&
                          selectedCandidateForExemption === candidate._id && (
                            <Button
                              onClick={() =>
                                handleExemptCandidate(candidate._id)
                              }
                            >
                              Confirm
                            </Button>
                          )}

                        <Button onClick={() => cancelExemption(candidate._id)}>
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end m-4">
          <Button
            onClick={generateCertificates}
            disabled={candidates.length === 0}
            className="mt-4"
          >
            Generate Certificate
          </Button>
        </div>
      </div>
    </>
  );
}
