import { FiClock, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

const QueryHistory = ({ history, onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="border border-gray-200/80 rounded-xl shadow-sm bg-white/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-3 text-left"
        >
          <div className="flex items-center">
            <FiClock className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-semibold text-gray-700">Recent Queries</span>
          </div>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {isOpen && (
          <div className="px-3 pb-3">
            <ul className="space-y-1">
              {history.map((item, index) => (
                <li
                  key={index}
                  onClick={() => onSelect(item)}
                  className="p-2 text-gray-600 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-2">
              <button
                onClick={onClear}
                className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
              >
                <FiTrash2 className="w-4 h-4 mr-1.5" />
                Clear History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryHistory;
