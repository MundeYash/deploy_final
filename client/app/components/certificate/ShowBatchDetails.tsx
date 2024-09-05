import React, { useState, useEffect } from "react";
import axios from "axios";

interface BatchDetails {
  batchCode: string;
  batchDescription: string;
  courseName: string;
  startDate: string;
  endDate: string;
  // courseDuration: { value: number; format: string };
}

interface BatchCodeSelectorProps {
  batchCode: string | null;
}

const BatchCodeSelector: React.FC<BatchCodeSelectorProps> = ({ batchCode }) => {
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/batch/${batchCode}`
        );
        const data = response.data;
        console.log(data);
        setBatchDetails({
          batchCode: data?.batchCode,
          batchDescription: data?.batchDescription,
          courseName: data?.courseName,
          startDate: data?.startDate,
          endDate: data?.endDate,
          // courseDuration: data?.value || { value: 0, format: "days" },
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
    <>
      <div className="mb-2">
        {batchCode && batchDetails && (
          <div className="container mx-auto my-2 p-2 bg-white rounded-lg shadow-lg">
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
              Batch Details
            </h2>
            <table className="w-full bg-gray-100">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-4 py-2 border border-gray-200 font-semibold text-left">
                    Batch Code
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Batch Description
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Course Name
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    Start Date
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-200 text-lg font-bold">
                    {batchDetails.batchCode}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-lg font-bold">
                    {batchDetails.batchDescription}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-lg font-bold">
                    {batchDetails.courseName}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-lg font-bold">
                    {new Date(batchDetails.startDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-lg font-bold">
                    {new Date(batchDetails.endDate).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default BatchCodeSelector;
