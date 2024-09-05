import React, { useMemo } from "react";
import MaterialTable from "@material-table/core";
import { Button, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto"; // For automatic chart type detection

interface Employee {
  batchCode: string;
  certificateNumber: string;
  designation: string;
  email: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  remarks: string;
  rollNumber: string;
  __v: number;
  _id: string;
}

interface Candidate {
  batchCode: string;
  firstName: string;
  lastName: string;
  // Add other fields as necessary

  rollNumber: string; // Added rollNumber
  certificateNumber: string; // Added certificateNumber
  designation: string;
  tableData?: {
    id: number;
  };
}

// Define the types for the props
interface Batch {
  batchCode: string;
  startDate: string;
  endDate: string;
  courseDuration: {
    value: number;
    format: string;
  };
  departmentAddress: string;
  participantsNo: number;
  batchDescription: string;
  courseName: string;
  remarks: string; // Added remarks property
  revenueOfBatch: number; // Added revenueOfBatch property
  technologyName: string; // Added technologyName property
  trainingMode: string; // Added trainingMode property
  venueDetails: string; // Added venueDetails property
  venueOfTraining: string; 
}

interface DataTableProps {
  batchData: Batch[];
  employeeData: Employee[];
  login: string;
}

// Define the type for the accumulator
interface ChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

const DataTable = ({ batchData, employeeData, login }: { batchData: Batch[], employeeData: Employee[], login: string })  => {
  console.log("tableBatchData", batchData);
  console.log("new EmployeeData", employeeData);

  
  // Prepare data for the charts
const chartData = batchData.reduce<ChartData>(
  (acc, batch) => {
    const totalCandidates = employeeData.filter(
      (emp) => emp.batchCode === batch.batchCode
    ).length;
    acc.labels.push(batch.batchCode);
    acc.data.push(totalCandidates);
    // Generate a consistent color for each batch code
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    acc.backgroundColor.push(`rgb(${r}, ${g}, ${b})`);
    return acc;
  },
  { labels: [], data: [], backgroundColor: [] } // Include backgroundColor in the accumulator
);

const barChartData = {
  labels: chartData.labels,
  datasets: [
    {
      label: "Total Candidates",
      data: chartData.data,
      backgroundColor: chartData.backgroundColor, // Use the pre-generated colors
      borderColor: chartData.backgroundColor.map(color => {
        // Optionally, you can darken the border color or use a different logic
        return color.replace('rgb', 'rgba').replace(')', ', 1)');
      }),
      borderWidth: 1,
    },
  ],
};

const pieChartData = {
  labels: chartData.labels,
  datasets: [
    {
      label: "Total Candidates",
      data: chartData.data,
      backgroundColor: chartData.backgroundColor, // Use the same colors as in the bar chart
      hoverOffset: 4,
    },
  ],
};

  // Function to find smallest and largest certificate numbers for a given batchCode
  function countEmployeesWithBatchCode(
    employeeData: Employee[],
    batchCode: string
  ): number {
    const count = employeeData.filter(
      (employee) => employee.batchCode === batchCode
    ).length;
    return count;
  }

  // Function to find smallest and largest certificate numbers for a given batchCode
  function findCertificateNumberRange(
    employeeData: Employee[],
    batchCode: string
  ): string {
    const filteredEmployees = employeeData.filter(
      (employee) => employee.batchCode === batchCode
    );

    if (filteredEmployees.length === 0) {
      return `NIL`;
    }

    let minCertificateNumber = filteredEmployees[0].certificateNumber;
    let maxCertificateNumber = filteredEmployees[0].certificateNumber;

    filteredEmployees.forEach((employee) => {
      if (employee.certificateNumber < minCertificateNumber) {
        minCertificateNumber = employee.certificateNumber;
      }
      if (employee.certificateNumber > maxCertificateNumber) {
        maxCertificateNumber = employee.certificateNumber;
      }
    });
    return `${minCertificateNumber} - ${maxCertificateNumber}`;
  }

  // Memoized filtered data with unique batchCode
  const uniquebatchData = useMemo(() => {
    const unique: { [key: string]: any } = {};
    batchData.forEach((candidate) => {
      if (!unique[candidate.batchCode]) {
        unique[candidate.batchCode] = {
          ...candidate,

          startDate: candidate.startDate
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-"), // Convert startDate to dd-mm-yyyy format
          endDate: candidate.endDate
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-"), // Convert endDate to dd-mm-yyyy format
          courseDuration: `${candidate.courseDuration.value} ${candidate.courseDuration.format}`, // Combine value and format
          departmentName: candidate.departmentAddress, // Added departmentName
          strength: candidate.participantsNo, // Added strength
          total: countEmployeesWithBatchCode(employeeData, candidate.batchCode), // Count of employees in the batch
          certificateNumberRange: findCertificateNumberRange(
            employeeData,
            candidate.batchCode
          ),
          // Additional fields from batchData
          remarks: candidate.remarks,
          revenueOfBatch: candidate.revenueOfBatch,
          technologyName: candidate.technologyName,
          trainingMode: candidate.trainingMode,
          venueDetails: candidate.venueDetails,
          venueOfTraining: candidate.venueOfTraining,
        };
      }
    });
    return Object.values(unique);
  }, [batchData]);
  console.log("uniqueData", uniquebatchData);

  const handleExportToExcel = () => {
    // Specify column headers
    const tableColumn = [
      "Batch Code",
      "Department Name",
      "Course Name",
      "Technology Name",
      "Course Duration",
      "Start Date",
      "End Date",
      "Department Address",
      "Training Mode",
      "Venue Details",
      "Venue of Training",
      "Revenue of Batch",
      "Total Certificate Issued",
      "No of Participants",
      "Certificate Number Range",
      "Remarks",
    ];

    // Extract only the specified columns from batchData
    const filteredData = batchData.map((batch) => ({
      "Batch Code": batch.batchCode,
      "Department Name": batch.batchDescription,
      "Course Name": batch.courseName,
      "Technology Name": batch.technologyName,
      "Course Duration": `${batch.courseDuration.value} ${batch.courseDuration.format}`,
      "Start Date": batch.startDate
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-"),
      "End Date": batch.endDate.split("T")[0].split("-").reverse().join("-"),
      "Department Address": batch.departmentAddress,
      "Training Mode": batch.trainingMode,
      "Venue Details": batch.venueDetails,
      "Venue of Training": batch.venueOfTraining,
      "Revenue of Batch": batch.revenueOfBatch,
      "Total Certificate Issued": countEmployeesWithBatchCode(
        employeeData,
        batch.batchCode
      ),
      "No of Participants": batch.participantsNo,
      "Certificate Number Range": findCertificateNumberRange(
        employeeData,
        batch.batchCode
      ),
      Remarks: batch.remarks,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      header: tableColumn,
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Data");

    // Save the file
    XLSX.writeFile(workbook, "batch_Report.xlsx");
  };

  const handleExportToPDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape", // Set orientation to landscape
    });

    
      // Fetch image from URL and convert to base64
      const imageUrl = 'https://upload.wikimedia.org/wikipedia/en/b/b4/NIELIT_Logo.jpg';
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      const reader = new FileReader();
    
      reader.readAsDataURL(imageBlob); 
      reader.onloadend = function() {
        const base64data = reader.result;  
        // Add image to PDF at top left corner
        if (typeof base64data === "string") {
        doc.addImage(base64data, 'JPEG', 10, 9, 40, 30); // Adjust position and size as needed
    
           // Set the position for the organization name to ensure it does not overlap with the logo
           const orgNameXPosition = 10 + 30 + 10; // Image width + 10 units for padding
           const orgNameYPosition = 9;  // Adjust based on the height of your logo
    
    
        doc.setTextColor(0, 0, 128); // Dark blue
    
        // Adjust font size and position for English translation
        doc.setFontSize(13);
        doc.text(
          "National Institute of Electronics and Information Technology (NIELIT)",
          80,
          25
        );
    
        // Set font for additional information
        doc.setFontSize(8);
        doc.setFont("times", "normal");
        doc.text(
          "(An Autonomous Scientific Society of Ministry of Electronics and Information Technology. MeitY, Govt. of India)",
          80,
          30
        );
    
        // Add space between header and table
        const headerHeight = 70; // Adjust as needed
    
    // Set text color to dark blue and font style to bold for the header
    const tableColumn = [
      "Batch Code",
      "Department Name",
      "Course Name",
      "Technology Name",
      "Course Duration",
      "Start Date",
      "End Date",
      "Department Address",
      "Training Mode",
      "Venue Details",
      "Venue of Training",
      "Revenue of Batch",
      "Total Certificate Issued",
      "No of Participants",
      "Certificate Number Range",
      "Remarks",
    ];

    const tableRows = batchData.map((batch) => [
      batch.batchCode,
      batch.batchDescription, // Assuming this is the correct field name
      batch.courseName,
      batch.technologyName,
      `${batch.courseDuration.value} ${batch.courseDuration.format}`,
      batch.startDate.split("T")[0].split("-").reverse().join("-"),
      batch.endDate.split("T")[0].split("-").reverse().join("-"),
      batch.departmentAddress,
      batch.trainingMode,
      batch.venueDetails,
      batch.venueOfTraining,
      batch.revenueOfBatch,
      countEmployeesWithBatchCode(employeeData, batch.batchCode),
      batch.participantsNo,
      findCertificateNumberRange(employeeData, batch.batchCode),
      batch.remarks,
    ]);


         // Set draw color to blue for borders
  doc.setDrawColor(0, 0, 0); // Blue color

  // Example: Draw a border around the header
  // Adjust x, y, width, and height as needed
  doc.rect(10, 10, 277, 28, 'S'); // Draws a rectangle (border only)

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      didDrawPage: (data:any) => {
        // Draw a border around the table or the entire page
        // For the entire page, you might use the full width and height
        // For example, for an A4 page:
        doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20, 'S');
      },
      
      styles: { fontSize: 8, cellPadding: 1, overflow: "linebreak" },
      theme: "grid",
      pageBreak: "auto",
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: "auto" }, // Adjusted width for batchCode
        1: { cellWidth: "auto" }, // Auto width for batchDescription
        2: { cellWidth: "auto" }, // Auto width for courseName
        3: { cellWidth: "auto" }, // Auto width for technologyName
        4: { cellWidth: 14 }, // Adjusted width for courseDuration
        5: { cellWidth: "auto" }, // Auto width for startDate
        6: { cellWidth: "auto" }, // Auto width for endDate
        // Add or adjust other columns as necessary
      },
    });

    doc.save(`batch_Report_${new Date().toISOString()}.pdf`);
  } else {
    console.error("Failed to convert image to base64");
  }
  };
  };

  return (
    <>
      <div>
        <Stack direction="row" spacing={2} marginBottom={2}>
          {login !== "operator" ? (
            <>
              <Button
                onClick={handleExportToExcel}
                variant="contained"
                color="primary"
              >
                Export to Excel
              </Button>
              <Button
                onClick={handleExportToPDF}
                variant="contained"
                color="secondary"
              >
                Export to PDF
              </Button>
            </>
          ) : null}
        </Stack>

        <MaterialTable
          title="Batch Master  Data"
          columns={[
            {
              title: "Serial No",
              field: "tableData.id",
              render: (rowData) => rowData.tableData.id + 1, // Add 1 because tableData.id starts from 0
              cellStyle: { padding: "2px", paddingLeft: "30px" }, // Reduced cell padding
              headerStyle: {
                padding: "2px",
                paddingLeft: "10px",
                fontWeight: "bold",
              }, // Minimize header padding

              // Highlighted header
              width: "5%", // Adjust width as needed to ensure it's minimal
            },
            {
              title: "Batch Code",
              field: "batchCode",
              cellStyle: { padding: "2px" },
              headerStyle: { padding: "2px", fontWeight: "bold" }, // Highlighted header
              width: "5%",
            },
            {
              title: "Department Name  ",
              field: "batchDescription",
              cellStyle: { width: "4%", maxWidth: "40%", padding: "4px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            },
            {
              title: "Course Name",
              field: "courseName",
              cellStyle: { width: "30%", maxWidth: "35%", padding: "4px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            },

            { title: "Technology Name", field: "technologyName" },
            {
              title: "Course Duration",
              field: "courseDuration",
              cellStyle: { width: "10%", maxWidth: "10%", padding: "4px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            }, // Display combined course duration

            {
              title: "Start Date",
              field: "startDate",
              cellStyle: { padding: "4px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            },
            {
              title: "End Date ",
              field: "endDate",
              cellStyle: { width: "8%", maxWidth: "8%", padding: "4px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            },

            // Add the new column for Department Name
            {
              title: "Department Address",
              field: "departmentName", // Adjust the field name based on your data structure
            },

            { title: "Training Mode", field: "trainingMode" },
            { title: "Venue of Training", field: "venueOfTraining" },

            { title: "Venue Details", field: "venueDetails" },
          
            { title: "Revenue of Batch", field: "revenueOfBatch" },

            {
              title: "Total Certificate Issued",
              field: "total",
              cellStyle: { padding: "4px" },
              headerStyle: { fontWeight: "bold" },
              width: "5%",
            },
            // Add the new column for Strength
            {
              title: "No of Participants",
              field: "strength", // Adjust the field name based on your data structure
            },

            {
              title: "CertificateNo Range",
              field: "certificateNumberRange",
              cellStyle: { padding: "2px" },
              headerStyle: { fontWeight: "bold" }, // Highlighted header
            },
            // New fields

            { title: "Remarks", field: "remarks" },
          ]}
          // data={batchData}
          data={uniquebatchData} // Use uniquebatchData here
          options={{
            search: true,
            paging: true,
            filtering: true,
            
            sorting: true,
            rowStyle: (rowData, index) => ({
              backgroundColor: index % 2 === 0 ? "#" : "#8cbed6", // Light grey for odd rows, white for even
            }),
            headerStyle: {
              backgroundColor: "#039be5", // Darker shade for header
              color: "#FFF", // White text color for header
            },
            pageSize: 10, // Default number of rows to display
            pageSizeOptions: [5, 10, 20, 50, 100], // Options for changing the number of rows displayed
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px 0",
        }}
      >
        <div style={{ width: "45%", height: "400px" }}>
          <h2>Batch Code vs Total Candidates</h2>
          <Bar
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
        <div style={{ width: "45%", height: "400px" }}>
          <h2>Batch Code Distribution</h2>
          <Pie
            data={pieChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
