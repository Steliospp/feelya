/**
 * Convert an array of objects to CSV and trigger browser download.
 * @param {string} filename - e.g. "employees-report.csv"
 * @param {Array<Object>} rows - data rows
 * @param {Array<{key:string, label:string}>} columns - column definitions
 */
export function downloadCSV(filename, rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');

  const csv = header + '\n' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
