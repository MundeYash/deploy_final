"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Alert from "@mui/material/Alert";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { IoCloseCircle } from "react-icons/io5";
import CandidateUpdate from "./CandidateUpdate";

import { FormData, Candidate } from "./lib/types";
import ShowBatchDetails from "../certificate/ShowBatchDetails";

export default function Component() {
  const [batchCode, setBatchCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [data, setData] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState<Partial<Candidate>>({});
  const [errors, setErrors] = useState<FormData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchDetails, setBatchDetails] = useState<any | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter candidates based on batchCode
  const filteredCandidates = candidates.filter(
    (candidate) => candidate.batchCode === batchCode
  );
  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  // Calculate the slice of candidates to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCandidates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [showCandidateUpdate, setShowCandidateUpdate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (batchCode) {
      fetchEmployeeData(batchCode);
    }
  }, [batchCode]);

  useEffect(() => {
    if (data && batchCode) {
      const index = data.code.indexOf(batchCode);
      if (index !== -1) {
        setBatchDetails({
          batchCode: data.code[index],
          batchDescription: data.description[index],
          courseName: data.name[index],
          startDate: data.startDate[index],
          endDate: data.endDate[index],
          courseDuration: data.duration[index] || { value: 0, format: "days" },
        });
      }
    }
  }, [batchCode, data]);

  const handleScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  function validateForm() {
    let isValid = true;
    const newErrors: FormData = {};

    if (!formData.firstName) {
      isValid = false;
      newErrors.firstName = "First name is required.";
    }

    if (!formData.rollNumber) {
      isValid = false;
      newErrors.rollNumber = "Roll number is required.";
    } else if (!/^\d+$/.test(formData.rollNumber)) {
      isValid = false;
      newErrors.rollNumber = "Roll number must be numeric.";
    }

    if (!formData.designation) {
      isValid = false;
      newErrors.designation = "Designation is required.";
    }

    if (!formData.phoneNumber) {
      isValid = false;
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      isValid = false;
      newErrors.phoneNumber =
        "Phone number must be numeric and 10 digits long.";
    }

    if (!formData.email) {
      isValid = false;
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      isValid = false;
      newErrors.email = "Email must be in a valid format.";
    }

    setErrors(newErrors);
    return isValid;
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/data");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const fetchCandidateDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/candidate/${id}`);
      setEditData(response.data);
      setEditForm(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching candidate details", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const fetchEmployeeData = async (id: string) => {
    try {
      if (id) {
        const response = await axios.get(
          `http://localhost:4000/employees/${id}`
        );
        setCandidates(response.data);
      }
    } catch (err) {
      console.error("Error fetching employee data", err);
    }
  };

  const handleCodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBatchCode(event.target.value as string);
  };

  const handleSubmit = async () => {
    if (!batchCode) {
      setAlert({ type: "error", message: "Batch code is required." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const updatedFormData = { batchCode, ...formData };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(updatedFormData),
      "secretKey"
    ).toString();

    try {
      await axios.post("http://localhost:4000/submit/employee", {
        encryptedData,
      });
      setAlert({
        type: "success",
        message: "Candidate details submitted successfully.",
      });
      fetchEmployeeData(batchCode);
      handleScroll();
      setFormData({});
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleEdit = async (id: string) => {
    setIsModalOpen(true);
    await fetchCandidateDetails(id);
    batchCode && fetchEmployeeData(batchCode);
    setShowCandidateUpdate(true);
  };

  const handleDelete = (id: string) => {
    setCandidateToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!candidateToDelete) return;

    try {
      await axios.delete(
        `http://localhost:4000/candidate/delete/${candidateToDelete}`
      );
      fetchEmployeeData(batchCode);
      setAlert({ type: "success", message: "Candidate deleted successfully." });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000); // Hide alert after 5 seconds
      handleScroll();
    } catch (err) {
      console.error("Error deleting record", err);
    } finally {
      // Hide confirmation modal and reset candidateToDelete state
      setShowConfirmModal(false);
      setCandidateToDelete(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <p className="text-lg mb-4">
              Are you sure you want to delete this candidate?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <ShowBatchDetails batchCode={batchCode} />
      </div>

      {editForm && (
        <div className="w-[700px] h-auto bg-gray-400 relative ">
          <IoCloseCircle
            className="absolute top-0 right-0 z-40 w-10 h-10 cursor-pointer"
            onClick={() => {
              setEditForm(false);
              fetchEmployeeData(batchCode);
            }}
          />
          <CandidateUpdate>{editData}</CandidateUpdate>
        </div>
      )}

      <Card className="w-full max-w-lg mx-auto py-8 px-6 mt-0 mb-2 bg-blue-100 shadow-lg">
        <CardHeader className="text-center">
          <img
            alt="Header Logo"
            className="mx-auto h-12 w-auto"
            src="https://www.itvoice.in/wp-content/uploads/2013/12/NIELIT-Logo.png"
          />
          <CardTitle className="text-2xl">Candidate Entry Form</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
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
                    data.code.sort().map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full"
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
                {errors.rollNumber && (
                  <p className="text-red-500 text-sm">{errors.rollNumber}</p>
                )}
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

                {errors.designation && (
                  <p className="text-red-500 text-sm">{errors.designation}</p>
                )}
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
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
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
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
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

        <CardFooter className="flex justify-center">
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>

      {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>}

      <div>
        {batchCode && (
          <div className="container my-8 mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold text-center mb-6">Candidates</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">S. No.</th>
                  <th className="py-2 px-4 border">First Name</th>
                  <th className="py-2 px-4 border">Last Name</th>
                  <th className="py-2 px-4 border">Roll Number</th>
                  <th className="py-2 px-4 border">Designation</th>
                  <th className="py-2 px-4 border">Employee ID</th>
                  <th className="py-2 px-4 border">Phone Number</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Remarks</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((candidate, index) => (
                  <tr key={candidate._id}>
                    <td className="border px-4 py-2">
                      {index + 1 + indexOfFirstItem}
                    </td>
                    <td className="py-2 px-4 border">{candidate.firstName}</td>
                    <td className="py-2 px-4 border">{candidate.lastName}</td>
                    <td className="py-2 px-4 border">{candidate.rollNumber}</td>
                    <td className="py-2 px-4 border">
                      {candidate.designation}
                    </td>
                    <td className="py-2 px-4 border">{candidate.employeeId}</td>
                    <td className="py-2 px-4 border">
                      {candidate.phoneNumber}
                    </td>
                    <td className="py-2 px-4 border">{candidate.email}</td>
                    <td className="py-2 px-4 border">{candidate.remarks}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEdit(candidate._id)}>
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(candidate._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center space-x-2 mt-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
