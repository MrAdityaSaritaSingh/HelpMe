const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2 mt-10">
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-300"></div>
      <p className="ml-4 text-lg text-gray-600">Analyzing sources and generating answer...</p>
    </div>
  );

  export default LoadingSpinner;