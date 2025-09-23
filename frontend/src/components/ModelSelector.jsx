const ModelSelector = ({ selectedModel, setSelectedModel, loading, models }) => {
    return (
      <div className="w-full max-w-xs mx-auto mt-4">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default ModelSelector;
  