'use client';

import { useMemo } from 'react';

function DataDisplay({ data }) {
  const memoizedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }
    return data;
  }, [data]);

  if (!memoizedData) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const headers = Object.keys(memoizedData[0] || {});

  if (headers.length === 0) {
    return <p className="text-center text-gray-500">Invalid data format</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header) => (
              <th key={header} className="py-2 px-4 border-b text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memoizedData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border-b">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataDisplay;