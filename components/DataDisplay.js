'use client';

function DataDisplay({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const fieldsToShow = ['bottle_name', 'alcohol_percentage', 'description'];
  const columnNameMapping = {
    bottle_name: 'Bottle Name',
    alcohol_percentage: 'ABV',
    description: 'Description'
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {fieldsToShow.map((field) => (
              <th key={field} className="py-2 px-4 border-b text-left font-semibold">
                {columnNameMapping[field]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {fieldsToShow.map((field, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border-b">
                  {field === 'alcohol_percentage' 
                    ? `${row[field]}%` 
                    : row[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataDisplay;
