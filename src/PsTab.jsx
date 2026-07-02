import React, { useState } from 'react';
import { ListTodo, Download, Copy } from 'lucide-react';
import { copyToClipboard } from './utils';

export default function PsTab({ data, setData }) {
  const handleExportPs = () => {
      if(data.length === 0) return alert("ไม่มีข้อมูลให้ Export");
      const headers = ["part_id_parent", "part_id_child", "amount", "method", "place", "station"];
      const csvContent = [headers.join(','), ...data.map(row => [row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "PS_BOM_Data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleCopyPs = () => {
    if(data.length === 0) return alert("ไม่มีข้อมูลให้คัดลอก");
    const rows = data.map(row => [row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station].join('\t'));
    copyToClipboard(rows.join('\n'));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center"><ListTodo className="w-5 h-5 text-indigo-600 mr-2" /> PS (Exterior-Wall) BOM Data</h3>
        <div className="flex gap-2">
            <button onClick={handleExportPs} className="text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center"><Download className="w-4 h-4 mr-2" /> Export CSV</button>
            <button onClick={handleCopyPs} className="text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center"><Copy className="w-4 h-4 mr-2" /> Copy Text</button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar w-full">
        {data.length === 0 ? (
           <div className="p-12 text-center text-slate-400"><ListTodo className="w-14 h-14 mx-auto mb-4 opacity-50" /><p className="text-sm">ไม่มีข้อมูล BOM Data<br/>กรุณา Import ไฟล์ CSV เพื่อดึงข้อมูล</p></div>
        ) : (
          <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-blue-50 text-blue-800 font-semibold border-b border-blue-200 text-xs tracking-wide">
              <tr>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[150px]">part_id_parent</th>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[150px]">part_id_child</th>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[70px] text-center">amount</th>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[70px] text-center">method</th>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[70px] text-center">place</th>
                <th className="px-4 py-2 border-r border-blue-200 min-w-[100px]">station</th>
              </tr>
            </thead>
            <tbody>{data.map((row, idx) => (<tr key={idx} className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors"><td className={`px-4 py-2 border-r border-slate-200 font-bold ${row.isBlue ? "text-blue-600" : "text-slate-800"}`}>{row.part_id_parent}</td><td className="px-4 py-2 border-r border-slate-200 text-slate-800">{row.part_id_child}</td><td className="px-4 py-2 border-r border-slate-200 text-slate-800 font-medium text-center">{row.amount}</td><td className="px-4 py-2 border-r border-slate-200 text-slate-800 text-center">{row.method}</td><td className="px-4 py-2 border-r border-slate-200 text-slate-800 text-center">{row.place}</td><td className="px-4 py-2 border-r border-slate-200 text-slate-800">{row.station}</td></tr>))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}