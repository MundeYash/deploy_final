import React, { ReactNode, useState, useEffect } from "react";
import axios from "axios";
import { Select, SelectChangeEvent, MenuItem, FormControl, InputLabel } from "@mui/material";

const BatchCodeSelector = () => {
  const [batchCode, setBatchCode] = useState<string>("");
  const [batchDetails, setBatchDetails] = useState<any | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/data");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

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

  const handleCodeChange =  (event: SelectChangeEvent<string>, child: ReactNode) => {
    setBatchCode(event.target.value as string);
  };

  return (
    <div>
      {batchDetails && (
        <div className="bg-white p-4 rounded-md shadow-sm mb-4 max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-2 text-center text-blue-500">
            Batch Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-700">
              <strong className="font-semibold">Batch Code:</strong>
              <span className="font-bold  text-red-500">
                {batchDetails.batchCode}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <strong className="font-semibold">Description:</strong>
              <span>{batchDetails.batchDescription}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <strong className="font-semibold">Course Name:</strong>
              <span>{batchDetails.courseName}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <strong className="font-semibold">Duration:</strong>
              <span>{`${new Date(
                batchDetails.startDate
              ).toLocaleDateString()} - ${new Date(
                batchDetails.endDate
              ).toLocaleDateString()}`}</span>
            </div>
          </div>
        </div>
      )}

      <FormControl fullWidth>
        <InputLabel id="batch-code-select-label">Select Batch Code</InputLabel>
        <Select
          labelId="batch-code-select-label"
          id="batch-code-select"
          value={batchCode}
          label="Select Batch Code"
          onChange={handleCodeChange}
        >
          {data?.code.map((item: string, index: number) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Existing table and other UI elements */}
    </div>
  );
};

export default BatchCodeSelector;
