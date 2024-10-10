import DataDisplay from './DataDisplay';

function Results({ data }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">Analysis Results</h2>
      <DataDisplay data={[data]} />
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Download CSV
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default Results;