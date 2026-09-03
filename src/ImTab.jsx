// ==========================================
// 📂 src/components/ImTab.jsx
// ==========================================
import React, { useState } from 'react';
import { Boxes, Download, Copy, Edit2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { copyToClipboard, exportToCsv } from './utils';

export function ImTab({ data, setData }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleExportIm = () => {
      if(data.length === 0) {
        toast.error("ไม่มีข้อมูลให้ Export");
        return;
    }
      const headers = ["Prefix", "Suffix", "Part ID", "Method", "Place", "Station", "Part Name", "Drawing", "GL Account", "Cost Center", "Cost Structure", "Order Type", "Part Unit", "Purchase Group", "Val Class", "Thickness", "Width", "Length", "Ex Wall", "Color", "Status"];
      const rows = data.map(row => [
          row.col1, row.col2, row.partId, row.method, row.place, row.station, row.partName, row.drawId, row.gl, row.cc, row.cs, row.ot, row.unit, row.pg, row.vc, row.t, row.l1, row.l2, row.exw, row.color, row.status
      ]);
      
      exportToCsv("IM_Master_Data.csv", [headers, ...rows]);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleCopyIm = () => {
    if(data.length === 0) {
        toast.error("ไม่มีข้อมูลให้คัดลอก");
        return;
    }
    const headers = ["Part ID", "Method", "Place", "Station", "Part Name", "Drawing", "GL Account", "Cost Center", "Cost Structure", "Order Type", "Part Unit", "Purchase Group", "Val Class", "Thickness", "Width", "Length", "Ex Wall", "Color", "Status"];
    const rows = data.map(row => [
      row.partId, row.method, row.place, row.station, row.partName, row.drawId, row.gl, row.cc, row.cs, row.ot, row.unit, row.pg, row.vc, row.t, row.l1, row.l2, row.exw, row.color, row.status
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    copyToClipboard(tsv);
    toast.success("คัดลอกสำเร็จ! สามารถนำไป Paste ใน Excel ได้เลย");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Boxes className="w-5 h-5 text-blue-600 mr-2"/> Item Master Database
        </h3>
        <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center border ${isEditing ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:text-blue-600 hover:bg-slate-50'}`}>
              {isEditing ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Done</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit</>}
            </button>
            <button onClick={handleExportIm} className="text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <button onClick={handleCopyIm} className="text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center">
              <Copy className="w-4 h-4 mr-2" /> Copy Text
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar w-full">
        {data.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
             <Boxes className="w-14 h-14 mx-auto mb-4 opacity-50" />
             <p className="text-sm">ไม่มีข้อมูล Item Master<br/>กรุณา Import ไฟล์ CSV เพื่อดึงข้อมูล หรือกดปุ่ม Test ระบบ</p>
           </div>
        ) : (
          <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-xs tracking-wide">
              <tr>
                <th className="px-3 py-2.5 border-r border-slate-300"></th>
                <th className="px-3 py-2.5 border-r border-slate-300"></th>
                <th className="px-3 py-2.5 border-r border-slate-300">Part ID</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Method</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Place</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Station</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Part Name</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Drawing</th>
                <th className="px-3 py-2.5 border-r border-slate-300">GL Account</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Cost Center</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Cost Structure</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Order Type</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Part Unit</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Pur. Group</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Val Class</th>
                <th className="px-3 py-2.5 border-r border-slate-300 bg-[#00b0f0] text-black">Thickness</th>
                <th className="px-3 py-2.5 border-r border-slate-300 bg-[#00b0f0] text-black">Width</th>
                <th className="px-3 py-2.5 border-r border-slate-300 bg-[#00b0f0] text-black">Length</th>
                <th className="px-3 py-2.5 border-r border-slate-300 text-center">Ex Wall</th>
                <th className="px-3 py-2.5 border-r border-slate-300">Color</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-200 transition-colors text-slate-800 ${row.status === 'New' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-yellow-50'}`}>
                  <td className="px-3 py-2 border-r border-slate-200 font-medium">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.col1} onChange={e => handleCellChange(idx, 'col1', e.target.value)} /> : row.col1}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.col2} onChange={e => handleCellChange(idx, 'col2', e.target.value)} /> : row.col2}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.partId} onChange={e => handleCellChange(idx, 'partId', e.target.value)} /> : row.partId}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.method} onChange={e => handleCellChange(idx, 'method', e.target.value)} /> : row.method}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.place} onChange={e => handleCellChange(idx, 'place', e.target.value)} /> : row.place}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.station} onChange={e => handleCellChange(idx, 'station', e.target.value)} /> : row.station}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.partName} onChange={e => handleCellChange(idx, 'partName', e.target.value)} /> : row.partName}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.drawId} onChange={e => handleCellChange(idx, 'drawId', e.target.value)} /> : row.drawId}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-right">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.gl} onChange={e => handleCellChange(idx, 'gl', e.target.value)} /> : row.gl}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.cc} onChange={e => handleCellChange(idx, 'cc', e.target.value)} /> : row.cc}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.cs} onChange={e => handleCellChange(idx, 'cs', e.target.value)} /> : row.cs}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.ot} onChange={e => handleCellChange(idx, 'ot', e.target.value)} /> : row.ot}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.unit} onChange={e => handleCellChange(idx, 'unit', e.target.value)} /> : row.unit}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.pg} onChange={e => handleCellChange(idx, 'pg', e.target.value)} /> : row.pg}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.vc} onChange={e => handleCellChange(idx, 'vc', e.target.value)} /> : row.vc}</td>
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.t && !isEditing ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.t} onChange={e => handleCellChange(idx, 't', e.target.value)} /> : row.t}</td>
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.l1 && !isEditing ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.l1} onChange={e => handleCellChange(idx, 'l1', e.target.value)} /> : row.l1}</td>
                  <td className={`px-3 py-2 border-r border-slate-200 text-right ${row.l2 && !isEditing ? 'bg-[#00b0f0] text-black font-semibold' : ''}`}>{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.l2} onChange={e => handleCellChange(idx, 'l2', e.target.value)} /> : row.l2}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.exw} onChange={e => handleCellChange(idx, 'exw', e.target.value)} /> : row.exw}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded" value={row.color} onChange={e => handleCellChange(idx, 'color', e.target.value)} /> : row.color}</td>
                  <td className={`px-3 py-2 font-bold ${row.status === '1' && !isEditing ? 'text-green-600' : 'text-slate-800'}`}>{isEditing ? <input className="w-full px-1 border border-blue-300 rounded font-normal" value={row.status} onChange={e => handleCellChange(idx, 'status', e.target.value)} /> : row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
