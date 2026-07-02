import React from 'react';
import { Boxes, Download, Copy } from 'lucide-react';
import { copyToClipboard } from './utils';

export default function ImTab({ data }) {
  const handleExportIm = () => {
      if(data.length === 0) return alert("ไม่มีข้อมูลให้ Export");
      const headers = ["Prefix", "Suffix", "Part ID", "Method", "Place", "Station", "Part Name", "Drawing", "GL Account", "Cost Center", "Cost Structure", "Order Type", "Part Unit", "Purchase Group", "Val Class", "Thickness", "Width", "Length", "Ex Wall", "Color", "Status"];
      const csvContent = [
          headers.join(','),
          ...data.map(row => [
              row.col1, row.col2, row.partId, row.method, row.place, row.station, row.partName, row.drawId, row.gl, row.cc, row.cs, row.ot, row.unit, row.pg, row.vc, row.t, row.l1, row.l2, row.exw, row.color, row.status
          ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "IM_Master_Data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleCopyIm = () => {
    if(data.length === 0) return alert("ไม่มีข้อมูลให้คัดลอก");
    const rows = data.map(row => [
      row.partId, row.method, row.place, row.station, row.partName, row.drawId, row.gl, row.cc, row.cs, row.ot, row.unit, row.pg, row.vc, row.t, row.l1, row.l2, row.exw, row.color, row.status
    ].join('\t'));
    copyToClipboard(rows.join('\n'));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center"><Boxes className="w-5 h-5 text-blue-600 mr-2"/> Item Master Database</h3>
        <div className="flex gap-2">
            <button onClick={handleExportIm} className="text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center"><Download className="w-4 h-4 mr-2" /> Export CSV</button>
            <button onClick={handleCopyIm} className="text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center"><Copy className="w-4 h-4 mr-2" /> Copy Text</button>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar w-full">
        {data.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
             <Boxes className="w-14 h-14 mx-auto mb-4 opacity-50" />
             <p className="text-sm">ไม่มีข้อมูล Item Master<br/>กรุณา Import ไฟล์ CSV เพื่อดึงข้อมูล</p>
           </div>
        ) : (
          <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-xs tracking-wide">
              <tr>
                {["", "", "Part ID", "Method", "Place", "Station", "Part Name", "Drawing", "GL Account", "Cost Center", "Cost Structure", "Order Type", "Part Unit", "Pur. Group", "Val Class"].map(h => <th key={h} className="px-3 py-2.5 border-r border-slate-300">{h}</th>)}
                {["Thickness", "Width", "Length"].map(h => <th key={h} className="px-3 py-2.5 border-r border-slate-300 bg-[#00b0f0] text-black">{h}</th>)}
                {["Ex Wall", "Color", "Status"].map(h => <th key={h} className="px-3 py-2.5 border-r border-slate-300 text-center">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-200 transition-colors text-slate-800 ${row.status === 'New' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-yellow-50'}`}>
                  {["col1", "col2", "partId", "method", "place", "station", "partName", "drawId", "gl", "cc", "cs", "ot", "unit", "pg", "vc"].map(k => <td key={k} className="px-3 py-2 border-r border-slate-200">{row[k]}</td>)}
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.t ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{row.t}</td>
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.l1 ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{row.l1}</td>
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.l2 ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{row.l2}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.exw}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.color}</td>
                  <td className={`px-3 py-2 font-bold ${row.status === '1' ? 'text-green-600' : 'text-slate-800'}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}