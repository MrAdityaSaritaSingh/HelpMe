const ProviderSelector = ({ selectedProvider, setSelectedProvider, loading, providers }) => {
    return (
      <div className="w-full max-w-xs mx-auto mt-4">
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          disabled={loading || !providers.length}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {providers.map((provider) => (
            <option key={provider.name} value={provider.name}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default ProviderSelector;
  