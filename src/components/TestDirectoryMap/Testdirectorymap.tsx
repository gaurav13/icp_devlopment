"use client";

import React, { useEffect, useState } from "react";
import { fetchDirectoryMapping } from "@/constant/testdirectoryMap"; // Adjust the path if needed
(async () => {
  const result = await fetchDirectoryMapping();
  console.log("Test fetchDirectoryMapping:", result);
})();

const TestDirectoryMap: React.FC = () => {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching directory data...");
        const result = await fetchDirectoryMapping();
        console.log("Fetched data:", result);
        setData(result);
      } catch (err) {
        console.error("Error during fetchDirectoryMapping:", err); // Debug error
      }
    };
    fetchData();
  }, []);
  

  if (error) {
    console.error("Error state:", error); // Debug log
    return <div>Error: {error}</div>;
  }

  if (!data) {
    console.log("Data not yet loaded..."); // Debug log
    return <div>Loading...</div>;
  }

  console.log("Rendering data:", data); // Debug log
  return (
    <div>
      <h1>Directory Mapping</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};


export default TestDirectoryMap;
