import React from 'react';
import { motion } from 'framer-motion';

const DataTable = ({ data, columns }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-auto custom-scrollbar">
      <table className="min-w-full text-xs sm:text-sm text-left align-middle whitespace-nowrap">
        <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-xl border-b border-slate-700/50">
          <tr>
            <th scope="col" className="w-8 px-3 sm:px-4 py-3 sm:py-4 font-semibold text-slate-500 border-b border-slate-700/50">#</th>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                scope="col" 
                className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-300 tracking-wider text-[10px] sm:text-xs uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-transparent">
          {data.map((row, rowIdx) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(rowIdx * 0.02, 0.5) }} /* Stagger cap at 0.5s */
              key={rowIdx} 
              className="hover:bg-emerald-900/10 group transition-colors duration-200"
            >
              <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-slate-600 font-mono text-[10px] sm:text-xs group-hover:text-emerald-500 transition-colors">
                {rowIdx + 1}
              </td>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 sm:px-6 py-2.5 sm:py-3 text-slate-300 font-light group-hover:text-white transition-colors">
                  {row[col] !== undefined && row[col] !== null ? row[col].toString() : (
                    <span className="text-slate-600 italic">null</span>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
