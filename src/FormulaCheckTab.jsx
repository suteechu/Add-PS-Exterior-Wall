import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Edit2, Save, X } from 'lucide-react';

export default function FormulaCheckTab({ formulaData, setFormulaData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState([]);

  const handleEdit = () => {
    setEditData(JSON.parse(JSON.stringify(formulaData)));
    setIsEditing(true);
  };

  const handleSave = () => {
    setFormulaData(editData);
    localStorage.setItem('formula_master_data', JSON.stringify(editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (index, field, value) => {
    const newData = [...editData];
    newData[index] = { ...newData[index], [field]: value };
    setEditData(newData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <ClipboardCheck className="w-5 h-5 text-indigo-600 mr-2" /> 
          เช็คสูตรต่างๆ (Formula Master Data)
        </h3>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-sm font-medium">
                <X className="w-4 h-4" /> ยกเลิก
              </button>
              <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm font-medium">
                <Save className="w-4 h-4" /> บันทึก
              </button>
            </div>
          ) : (
            <button onClick={handleEdit} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">
              <Edit2 className="w-4 h-4" /> แก้ไขข้อมูล
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar w-full">
         <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 border-r border-slate-300">Group</th>
                <th className="px-4 py-3 border-r border-slate-300">Code (Item)</th>
                <th className="px-4 py-3 border-r border-slate-300">Name</th>
                <th className="px-4 py-3 border-r border-slate-300">Label</th>
                <th className="px-4 py-3 border-r border-slate-300">Station</th>
                <th className="px-4 py-3">Rate (ต่อ 1 ตร.ม.)</th>
              </tr>
            </thead>
            <tbody>
              {(isEditing ? editData : formulaData).map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors text-slate-800">
                  <td className="px-4 py-2 border-r border-slate-200 bg-slate-50/50">
                    {isEditing ? <input type="text" className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={item.group || ''} onChange={e => handleChange(idx, 'group', e.target.value)} /> : <span className="font-bold">{item.group}</span>}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200">
                    {isEditing ? <input type="text" className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={item.code || ''} onChange={e => handleChange(idx, 'code', e.target.value)} /> : <span className="text-blue-700 font-semibold">{item.code}</span>}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200 max-w-[300px]">
                    {isEditing ? <input type="text" className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={item.name || ''} onChange={e => handleChange(idx, 'name', e.target.value)} /> : <div className="text-slate-600 truncate" title={item.name}>{item.name}</div>}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200">
                    {isEditing ? <input type="text" className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={item.label || ''} onChange={e => handleChange(idx, 'label', e.target.value)} /> : item.label}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-200">
                    {isEditing ? <input type="text" className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={item.station || ''} onChange={e => handleChange(idx, 'station', e.target.value)} /> : <span className="text-slate-600">{item.station}</span>}
                  </td>
                  <td className="px-4 py-2 bg-emerald-50/30">
                    {isEditing ? <input type="number" step="0.001" className="w-full px-2 py-1 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" value={item.rate !== undefined ? item.rate : ''} onChange={e => handleChange(idx, 'rate', e.target.value)} /> : <span className="font-bold text-emerald-600">{!isNaN(parseFloat(item.rate)) ? parseFloat(item.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : item.rate}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}