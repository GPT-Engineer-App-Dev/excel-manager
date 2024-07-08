import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UploadExcel = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleEditRow = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const handleDeleteRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Upload and Manage Excel Sheet</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
      <Button onClick={handleAddRow} className="mb-4">Add Row</Button>
      <Table>
        <TableHeader>
          <TableRow>
            {data.length > 0 && Object.keys(data[0]).map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(row).map((key) => (
                <TableCell key={key}>
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) => handleEditRow(rowIndex, key, e.target.value)}
                    className="w-full"
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UploadExcel;