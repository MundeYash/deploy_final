import React, { useState, useEffect } from "react";
import axios from "axios";

interface BatchDetails {
  batchCode: string;
  batchDescription: string;
  courseName: string;
  startDate: string;
  endDate: string;
  courseDuration: { value: number; format: string };
}

interface BatchCodeSelectorProps {
  batchCode: string | null;
}

const BatchCodeSelector: React.FC<BatchCodeSelectorProps> = ({ batchCode }) => {
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/batch`);
        const data = response.data;
        console.log(data);
        setBatchDetails({
          batchCode: data?.batchCode,
          batchDescription: data?.batchDescription,
          courseName: data?.courseName,
          startDate: data?.startDate,
          endDate: data?.endDate,
          courseDuration: data?.value || { value: 0, format: "days" },
        });
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    if (batchCode !== null) {
      console.log(batchCode);
      fetchData();
    }
  }, [batchCode]);

  return (
    <div className="mb-5">
      {batchCode && batchDetails && (
        <div className="container my-8 mx-auto p-4 bg-white rounded shadow mb-5">
          <h2 className="text-2xl font-bold text-center mb-6">Batch Details</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Batch Code</th>
                <th className="px-4 py-2 border">Batch Description</th>
                <th className="px-4 py-2 border">Course Name</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Course Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{batchDetails.batchCode}</td>
                <td className="border px-4 py-2">
                  {batchDetails.batchDescription}
                </td>
                <td className="border px-4 py-2">{batchDetails.courseName}</td>
                <td className="border px-4 py-2">
                  {new Date(batchDetails.startDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(batchDetails.endDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{`${batchDetails.courseDuration.value} ${batchDetails.courseDuration.format}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchCodeSelector;
