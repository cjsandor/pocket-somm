import DataDisplay from './DataDisplay';

function Results({ data }) {
  if (!data) {
    return <p className="text-center text-gray-500">No results available</p>;
  }

  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Analysis Results</h2>
      <DataDisplay data={dataArray} />
      {!Array.isArray(data) && data.llm_summary && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">LLM Summary</h3>
          <p className="text-gray-700">{data.llm_summary}</p>
        </div>
      )}
    </div>
  );
}

export default Results;
