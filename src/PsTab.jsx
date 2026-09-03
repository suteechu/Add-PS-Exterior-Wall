// ==========================================
// 📂 src/components/PsTab.jsx
// ==========================================
import React, { useState } from 'react';
import { ListTodo, Download, Copy, Plus, Edit2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { copyToClipboard, exportToCsv } from './utils';

export function PsTab({ data, setData }) {
  const [newParent, setNewParent] = useState('');
  const [newChild, setNewChild] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newMethod, setNewMethod] = useState('2');
  const [newPlace, setNewPlace] = useState('F');
  const [newStation, setNewStation] = useState('PF-TP');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddManualItem = () => {
    if (!newParent || !newChild) {
      toast.error('กรุณากรอก part_id_parent และ part_id_child ให้ครบถ้วน');
      return;
    }
    const newItem = {
      part_id_parent: newParent.toUpperCase(),
      part_id_child: newChild.toUpperCase(),
      amount: newAmount,
      method: newMethod,
      place: newPlace,
      station: newStation,
      isBlue: true
    };
    
    setData(prev => [newItem, ...prev]);
    toast.success("เพิ่มข้อมูล BOM เรียบร้อยแล้ว");
    setNewParent('');
    setNewChild('');
  };

  const handleExportPs = () => {
      if(data.length === 0) {
        toast.error("ไม่มีข้อมูลให้ Export");
        return;
    }
      const headers = ["part_id_parent", "part_id_child", "amount", "method", "place", "station"];
      const rows = data.map(row => [
          row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station
      ]);
      
      exportToCsv("PS_BOM_Data.csv", [headers, ...rows]);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleCopyPs = () => {
    if(data.length === 0) {
        toast.error("ไม่มีข้อมูลให้คัดลอก");
        return;
    }
    const headers = ["part_id_parent", "part_id_child", "amount", "method", "place", "station"];
    const rows = data.map(row => [
      row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    copyToClipboard(tsv);
    toast.success("คัดลอกสำเร็จ! สามารถนำไป Paste ใน Excel ได้เลย");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <ListTodo className="w-5 h-5 text-indigo-600 mr-2" /> PS (Exterior-Wall) BOM Data
        </h3>
        <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center border ${isEditing ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:text-blue-600 hover:bg-slate-50'}`}>
              {isEditing ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Done</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit</>}
            </button>
            <button onClick={handleExportPs} className="text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <button onClick={handleCopyPs} className="text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md text-sm shadow-sm transition-all font-semibold flex items-center">
              <Copy className="w-4 h-4 mr-2" /> Copy Text
            </button>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 mb-2">เพิ่มรายการด้วยตนเอง (Manual Add)</h4>
          <div className="flex flex-wrap md:flex-nowrap gap-2 items-end">
              <div className="w-full md:w-auto flex-1">
                  <input type="text" value={newParent} onChange={(e) => setNewParent(e.target.value)} placeholder="part_id_parent" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-auto flex-1">
                  <input type="text" value={newChild} onChange={(e) => setNewChild(e.target.value)} placeholder="part_id_child (เช่น AAFT...)" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-20">
                  <input type="text" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="amount" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-20">
                  <input type="text" value={newMethod} onChange={(e) => setNewMethod(e.target.value)} placeholder="method" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-20">
                  <input type="text" value={newPlace} onChange={(e) => setNewPlace(e.target.value)} placeholder="place" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-32">
                  <input type="text" value={newStation} onChange={(e) => setNewStation(e.target.value)} placeholder="station" className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <button onClick={handleAddManualItem} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap">
                  <Plus className="w-3 h-3 mr-1" /> เพิ่ม
              </button>
          </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar w-full">
        {data.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
             <ListTodo className="w-14 h-14 mx-auto mb-4 opacity-50" />
             <p className="text-sm">ไม่มีข้อมูล BOM Data<br/>กรุณา Import ไฟล์ CSV หรือกดปุ่ม Test ระบบ</p>
           </div>
        ) : (
          <table className="w-full text-[13px] text-center border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-xs tracking-wide">
              <tr>
                <th className="px-4 py-2.5 border-r border-slate-300 w-48">part_id_parent</th>
                <th className="px-4 py-2.5 border-r border-slate-300 w-48">part_id_child</th>
                <th className="px-4 py-2.5 border-r border-slate-300 w-32">amount</th>
                <th className="px-4 py-2.5 border-r border-slate-300 w-28">method</th>
                <th className="px-4 py-2.5 border-r border-slate-300 w-28">place</th>
                <th className="px-4 py-2.5">station</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const parentTextClass = row.isBlue ? "text-blue-600" : "text-slate-800";

                return (
                  <tr key={idx} className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                    <td className={`px-4 py-2 border-r border-slate-200 font-bold ${parentTextClass}`}>{isEditing ? <input className="w-full px-1 border border-blue-300 rounded font-normal text-slate-800 text-center" value={row.part_id_parent} onChange={e => handleCellChange(idx, 'part_id_parent', e.target.value)} /> : row.part_id_parent}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded text-center" value={row.part_id_child} onChange={e => handleCellChange(idx, 'part_id_child', e.target.value)} /> : row.part_id_child}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800 font-medium">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded text-center" value={row.amount} onChange={e => handleCellChange(idx, 'amount', e.target.value)} /> : row.amount}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded text-center" value={row.method} onChange={e => handleCellChange(idx, 'method', e.target.value)} /> : row.method}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded text-center" value={row.place} onChange={e => handleCellChange(idx, 'place', e.target.value)} /> : row.place}</td>
                    <td className="px-4 py-2 text-slate-800">{isEditing ? <input className="w-full px-1 border border-blue-300 rounded text-center" value={row.station} onChange={e => handleCellChange(idx, 'station', e.target.value)} /> : row.station}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
