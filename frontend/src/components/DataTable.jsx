import React from 'react';

const DataTable = ({ data, columns }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 overflow-x-auto border border-gray-200 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                scope="col" 
                className="px-6 py-3 font-semibold text-gray-700 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {row[col] !== undefined && row[col] !== null ? row[col].toString() : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
