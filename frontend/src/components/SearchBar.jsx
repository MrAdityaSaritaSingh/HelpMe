import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ query, setQuery, handleSearch, loading }) => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full px-5 py-3 text-lg text-gray-700 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
          placeholder="What do you want to research today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={loading}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center px-6 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
          onClick={handleSearch}
          disabled={loading}
        >
          <FiSearch className="w-6 h-6" />
          <span className="ml-2 text-lg font-semibold">{loading ? 'Researching...' : 'Research'}</span>
        </button>
      </div>
    </div>
  );

  export default SearchBar;