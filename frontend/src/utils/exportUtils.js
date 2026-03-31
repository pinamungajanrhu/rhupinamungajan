import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to an Excel (XLSX) file
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Output filename (without extension)
 */
export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export data to a PDF file with an auto-table
 * @param {Array<string>} headers - Table column headers
 * @param {Array<Array<any>>} data - 2D array of table rows
 * @param {string} filename - Output filename (without extension)
 * @param {string} title - Title text printed at the top of the PDF
 */
export const exportToPDF = (headers, data, filename, title = "Export Report") => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

  doc.autoTable({
    startY: 30,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129] } // matching emerald-500
  });

  doc.save(`${filename}.pdf`);
};
