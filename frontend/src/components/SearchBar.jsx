import { FiSearch } from 'react-icons/fi';
import TextareaAutosize from 'react-textarea-autosize';

const SearchBar = ({ query, setQuery, handleSearch, loading }) => (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <TextareaAutosize
        minRows={1}
        maxRows={6}
        className="w-full px-6 py-3 text-lg text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 resize-none"
        placeholder="What do you want to research today?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSearch())}
        disabled={loading}
      />
      <button
        className="w-full flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
        onClick={handleSearch}
        disabled={loading}
      >
        <FiSearch className="w-6 h-6" />
        <span className="ml-2 text-lg font-semibold">{loading ? 'Researching...' : 'Research'}</span>
      </button>
    </div>
  );

  export default SearchBar;