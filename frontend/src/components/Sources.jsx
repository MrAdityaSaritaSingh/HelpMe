import { FiLink } from 'react-icons/fi';

const getFaviconUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
  } catch (error) {
    return 'https://www.google.com/s2/favicons?domain=google.com&sz=32'; // Fallback favicon
  }
};

const Sources = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">Sources</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-center mb-2">
              <img
                src={getFaviconUrl(source.url)}
                alt="favicon"
                className="w-5 h-5 mr-3 rounded-full"
              />
              <p className="text-sm font-medium text-gray-500 truncate">
                {new URL(source.url).hostname}
              </p>
            </div>
            <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              {source.title}
            </h4>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sources;
