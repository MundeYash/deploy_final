import React, { useEffect, useState } from "react";
import axios from "axios";

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/data"); // Adjust the URL to match your API endpoint
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to format duration
  const formatDuration = (duration) => {
    return duration.map((d) => `${d.value} ${d.format}`).join(", ");
  };

  // Render the table
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">S. No.</th>
            <th className="px-4 py-2 border">Batch Code</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Course Name</th>
            <th className="px-4 py-2 border">Start Date</th>
            <th className="px-4 py-2 border">End Date</th>
            <th className="px-4 py-2 border">Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.code &&
            data.code.map((code, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{data.code}</td>
                <td className="px-4 py-2 border">{data.description[index]}</td>
                <td className="px-4 py-2 border">{data.name[index]}</td>
                <td className="px-4 py-2 border">
                  {new Date(data.startDate[index]).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(data.endDate[index]).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {formatDuration(data.duration)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
