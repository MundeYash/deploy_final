"use client";

import DataTable from "../dataTable/DataTable";

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

import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";

interface OperatorProps {
  login: string;
}

// Define types for the data structures
interface CourseDuration {
  value: number;
  format: string;
}

interface BatchData {
  batchCode: string;
  batchDescription: string;
  courseName: string;
  courseDuration: CourseDuration;
  startDate: string;
  endDate: string;
}

interface EmployeeData {
  batchCode: string;
  certificateNumber: string;
}

interface FilteredData {
  batchData: BatchData[];
  employeeData: EmployeeData[];
}


export default function Operator({ login }: OperatorProps) {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null);
  const [candidatesData, setCandidatesData] = useState<EmployeeData[]>([]); // Ensure the state is typed as EmployeeData[]


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
  const handleBatchCodeChange = (value: string | null) =>
    setSelectedBatchCode(value || defaultSelectValue);
  const handleBatchDescriptionChange = (value: string | null) =>
    setSelectedBatchDescription(value || defaultSelectValue);
  const handleCourseNameChange = (value: string | null) =>
    setSelectedCourseName(value || defaultSelectValue);
  const handleDurationChange = (value: string | null) =>
    setSelectedDuration(value || defaultSelectValue);

  // use
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value || defaultSelectValue);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
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
      ?.filter((item: BatchData) => {
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
      .map((item: BatchData) => item.batchCode);


    const filteredCandidates = filteredData.employeeData.filter(
     (candidate: EmployeeData) =>
      
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
    <div className="flex flex-col min-h-screen  mb-8">
      <h2 className="text-2xl font-bold text-center">Candidate Report </h2>

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
                    (item: string, index: number) =>
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
                    (item: string, index: number) =>
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
                    (item: string, index: number) =>
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
                    (item: string, index: number) =>
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
            <Button onClick={clearFilters}>Clear</Button>
          </div>
        </div>
      </section>

      {/* Report Printing options  */}

      <section className="bg-gray-100 py-6 px-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <DataTable candidatesData={candidatesData} login={login} />
        </div>
      </section>
    </div>
  );
}
