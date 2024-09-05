import React from "react";
import { Button } from "../ui/button";
import * as XLSX from "xlsx";

const ExcelExportButton = ({ candidatesData }) => {
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

  return <Button onClick={handleExport}>Excel</Button>;
};

export default ExcelExportButton;
