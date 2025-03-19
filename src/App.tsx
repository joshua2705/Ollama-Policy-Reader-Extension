import { Scan } from 'lucide-react';

function App() {
  return (
    <div className="w-96 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Scan className="text-blue-500" size={24} />
        <h1 className="text-xl font-bold">Policy Scanner</h1>
      </div>
      
      <p className="text-gray-600 mb-4">
        Navigate to any terms and policy page to scan and analyze its contents.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="font-medium mb-2">How to use:</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700">
          <li>Go to any website's terms or policy page</li>
          <li>Click the scan button in the bottom right corner</li>
          <li>View the analysis results</li>
        </ol>
      </div>
    </div>
  );
}

export default App;