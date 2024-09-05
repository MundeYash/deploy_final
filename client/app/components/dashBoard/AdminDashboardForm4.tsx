"use client";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import * as XLSX from "xlsx";


import DataTable4 from "../dataTable/DataTable4";

import { Button } from "../ui/button";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "../ui/select";
import { Input } from "../ui/input";


import {  useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";

export default function Admin(login) {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [candidatesData, setCandidatesData] = useState([]);

  const [selectedBatchCode, setSelectedBatchCode] = useState("");
  const [selectedBatchDescription, setSelectedBatchDescription] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [durationFormat, setDurationFormat] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredBatchData, setfilteredBatchData] = useState([]);
  const [filteredBatchDetails, setFilteredBatchDetails] = useState([]);

  const [batchCounts, setBatchCounts] = useState({});
  const [employeeData, setEmployeeData] = useState([]);

  const defaultSelectValue = ""; // Define a default value for select elements
  async function fetchData() {
    const response = await axios.get("http://localhost:4000/data");
    console.log(`4000/data: ${response.data}`);
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
    fetchCandidatesData();
  }, []);

  const handleBatchCodeChange = (value) =>
    setSelectedBatchCode(value || defaultSelectValue);
  const handleBatchDescriptionChange = (value) =>
    setSelectedBatchDescription(value || defaultSelectValue);
  const handleCourseNameChange = (value) =>
    setSelectedCourseName(value || defaultSelectValue);
  const handleDurationChange = (value) =>
    setSelectedDuration(value || defaultSelectValue);
  const handleStartDateChange = (e) =>
    setStartDate(e.target.value || defaultSelectValue);
  const handleEndDateChange = (e) =>
    setEndDate(e.target.value || defaultSelectValue);

  async function fetchCandidatesData() {
    const response = await axios.get("http://localhost:4000/candidates");
    setFilteredData(response.data);
  }

  const applyFilters = () => {
    if (!filteredData) return;
    console.log(`filteredData`, filteredData);
    console.log(`selectedBatchCode`, selectedBatchCode);
    console.log(`selectedBatchDescription`, selectedBatchDescription);
    console.log(`selectedCourseName`, selectedCourseName);
    console.log(`selectedDuration`, selectedDuration);
    console.log(`startDate`, startDate);
    console.log(`endDate`, endDate);
    // console.log(`format`, format);
    const filteredBatchData = filteredData.batchData?.filter((item) => {
      const batchCodeMatch = selectedBatchCode
        ? item.batchCode === selectedBatchCode
        : true;
      const batchDescriptionMatch = selectedBatchDescription
        ? item.batchDescription === selectedBatchDescription
        : true;
      const courseNameMatch = selectedCourseName
        ? item.courseName === selectedCourseName
        : true;
      const durationMatch = selectedDuration
        ? item.courseDuration.value === selectedDuration.value &&
          item.courseDuration.format === selectedDuration.format
        : true;
      const startDateMatch = startDate
        ? new Date(item.startDate) >= new Date(startDate)
        : true;
      const endDateMatch = endDate
        ? new Date(item.endDate) <= new Date(endDate)
        : true;

      return (
        batchCodeMatch &&
        batchDescriptionMatch &&
        courseNameMatch &&
        durationMatch &&
        startDateMatch &&
        endDateMatch
      );
    });
    // .map((item) => item.batchCode);
    setfilteredBatchData(filteredBatchData);
    const filteredCandidates = filteredData.employeeData.filter((candidate) =>
      // filteredBatchData.includes(candidate.batchCode)
      filteredBatchData.includes(candidate.batchCode)
    );
    console.log("batchFilter", filteredBatchData);
    console.log("filter", filteredCandidates);
    setCandidatesData(filteredCandidates);

    // After filtering batch codes, find the corresponding batch details
    const filteredBatchDetails = filteredData.batchData.filter((batch) =>
      filteredBatchData.includes(batch.batchCode)
    );

    // Assuming you have a state to hold the filtered batch details for the DataTable2 component
    setFilteredBatchDetails(filteredBatchDetails);
  };

  // function for clearing all the filters (remaing to be implemented)

  const clearFilters = () => {
    setSelectedBatchCode(defaultSelectValue);
    setSelectedBatchDescription(defaultSelectValue);
    setSelectedCourseName(defaultSelectValue);
    setSelectedDuration(defaultSelectValue);
    setStartDate(defaultSelectValue);
    setEndDate(defaultSelectValue);

    setCandidatesData([]); // Optionally, you might want to reset the candidates data as well
    setfilteredBatchData([]); // Clear filtered batch data
    setFilteredBatchDetails([]); // Clear filtered batch details

    // Resetting the Select components to show placeholder values
    batchCodeSelectRef.current?.reset();
    batchDescriptionSelectRef.current?.reset();
    courseNameSelectRef.current?.reset();
    durationSelectRef.current?.reset();
  };

  // Refs for select components
  const batchCodeSelectRef = useRef(null);
  const batchDescriptionSelectRef = useRef(null);
  const courseNameSelectRef = useRef(null);
  const durationSelectRef = useRef(null);

  const handleGeneratePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define a height for the table
    const tableHeight = 10 + candidatesData.length * 10; // Adjust the multiplier based on the number of rows

    // Use html2canvas to capture the table and convert it to a canvas
    html2canvas(document.querySelector("#pdfTable"), { scale: 1 }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Add an image to the PDF
        doc.addImage(imgData, "PNG", 10, 10, 180, tableHeight);

        // Save the PDF
        doc.save("table.pdf");
      }
    );
  };

  const handleExport = () => {
    // Creating a new workbook
    const workbook = XLSX.utils.book_new();

    // Creating a worksheet
    const worksheet = XLSX.utils.json_to_sheet(candidatesData);

    // Adding the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates Data");

    // Exporting the workbook as an Excel file
    XLSX.writeFile(workbook, "candidates_data.xlsx");
  };

  return (
    <div className="flex flex-col min-h-screen mt-2 mb-8">
      <h2 className="text-2xl font-bold text-center">Batch Master Data Report </h2>
      
      <section className="bg-gray-100 py-8 px-8 flex flex-col gap-6 mt-8 mb-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            <span className="font-bold text-gray-600">-</span>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <Input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>

          <Select
            ref={batchCodeSelectRef}
            onValueChange={handleBatchCodeChange}
            value={selectedBatchCode}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select Batch Code" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                {data &&
                  data?.code?.sort().map(
                    (item, index) =>
                      item && (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      )
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            ref={batchDescriptionSelectRef}
            onValueChange={handleBatchDescriptionChange}
            value={selectedBatchDescription}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select Batch Description" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                {data &&
                  data?.description?.sort().map(
                    (item, index) =>
                      item && (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      )
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            ref={courseNameSelectRef}
            onValueChange={handleCourseNameChange}
            value={selectedCourseName}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select Course Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                {data &&
                  data?.name?.sort().map(
                    (item, index) =>
                      item && (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      )
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            ref={durationSelectRef}
            onValueChange={handleDurationChange}
            value={selectedDuration}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select Duration in weeks" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data &&
                  data?.duration?.sort().map(
                    (item, index) =>
                      item && (
                        <SelectItem key={index} value={item}>
                          {item.value + " " + item.format}
                        </SelectItem>
                      )
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex justify-end p-4 space-x-4">
            <Button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Apply
            </Button>
            <Button
              onClick={clearFilters}
             
            >
              Clear
            </Button>
          </div>
        </div>
      </section>


      {/* Report Printing options  */}

      <section className="bg-gray-100 py-6 px-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <DataTable4
            batchData={filteredBatchData}
            employeeData={filteredData.employeeData}
           
          />
        </div>
      </section>
    </div>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
