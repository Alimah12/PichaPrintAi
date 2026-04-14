'use client';

interface BOMTableProps {
  csvData: string | null;
}

export default function BOMTable({ csvData }: BOMTableProps) {
  if (!csvData) {
    return (
      <div className="text-gray-300 text-sm p-8 text-center bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        BOM will appear here
      </div>
    );
  }
  
  const rows = csvData.split('\n').filter(r => r.trim());
  const headers = rows[0]?.split(',') || [];
  const data = rows.slice(1);
  
  return (
    <div className="overflow-auto max-h-[400px] border border-gray-200 rounded-xl bg-white">
      <table className="w-full text-sm">
        <thead className="bg-white/5 backdrop-blur-md sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 font-medium text-gray-700 border-b text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const cols = row.split(',');
            return (
              <tr key={idx} className="border-b last:border-0 hover:bg-emerald-50/50">
                {cols.map((col, i) => (
                  <td key={i} className="px-4 py-3 text-gray-600 text-sm">
                    {col}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}