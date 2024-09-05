"use client";





import DataTable2 from "../dataTable/DataTable2";


import { Button } from "../ui/button";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "../ui/select";



import ShowBatchDetails from "../certificate/ShowBatchDetails";
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
  const [selectedDuration, setSelectedDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const defaultSelectValue = ""; // Define a default value for select elements
  async function fetchData() {
    const response = await axios.get("http://localhost:4000/data");
    console.log(response.data);
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
    fetchCandidatesData();
  }, []);

  console.log(candidatesData);
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
    console.log(response.data);
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

    const filteredBatchCodes = filteredData.batchData
      ?.filter((item) => {
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
      })
      .map((item) => item.batchCode);
    const filteredCandidates = filteredData.employeeData.filter(
      (candidate) =>
        // filteredBatchCodes.includes(candidate.batchCode)
        filteredBatchCodes.includes(candidate.batchCode) &&
        candidate.certificateNumber
    );

    setCandidatesData(filteredCandidates);
  };

  const clearFilters = () => {
    setSelectedBatchCode(defaultSelectValue);
    setSelectedBatchDescription(defaultSelectValue);
    setSelectedCourseName(defaultSelectValue);
    setSelectedDuration(defaultSelectValue);
    setStartDate(defaultSelectValue);
    setEndDate(defaultSelectValue);
    // Optionally, you might want to reset the candidates data as well
    setCandidatesData([]);
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

  return (
    <div className="flex flex-col min-h-screen  ">
      <h2 className="text-2xl font-bold text-center">Batch Report </h2>

  


      <section className="bg-gray-100 py-8 px-8 flex flex-col gap-6 mt-8 mb-8 rounded-lg shadow-md">
        <div className="flex items-center justify-start space-x-8">
          
        <Select
            ref={batchCodeSelectRef}
            onValueChange={handleBatchCodeChange}
            value={selectedBatchCode}
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select Batch Code " />
            </SelectTrigger>
            <SelectContent className="w-60">
              <SelectGroup>
                {data &&
                  data?.code?.sort().map((item, index) => {
                    if (item) {
                      return (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      );
                    }

                    return null;
                  })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-300 shadow-md"
            onClick={applyFilters}>Apply Filters</Button>
           <Button
              onClick={clearFilters}
             
            >
              Clear
            </Button>
          </div>
        </div>

        

       
        <div>
          <ShowBatchDetails batchCode={selectedBatchCode} />
        </div>
        
       
      </section>
      <section className="bg-gray-100 py-6 px-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <DataTable2
            candidatesData={candidatesData}
            selectedBatchCode={selectedBatchCode}
          />
        </div>
      </section>
    </div>
  );
}

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
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
