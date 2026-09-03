import React, { useState, useEffect } from 'react';
import { Calculator, X, Copy, Eye, EyeOff, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { copyToClipboard, exportToCsv } from './utils';
import { panelVariants } from './constants';

export default function AaftCalculatorModal({ isOpen, onClose, formulaData }) {
  const [areaInput, setAreaInput] = useState(1);
  const [widthInput, setWidthInput] = useState('');
  const [lengthInput, setLengthInput] = useState('');
  const excludeBoards = ['AADZ09904', 'AADZ09903', 'AAFZ09901', 'AALZ09320', 'AAHZ09900', 'DDHZ09900', 'AAGY0002A', 'AAGY5070A'];

  const [selectedItems, setSelectedItems] = useState(() => new Set((formulaData || []).map(i => i.code).filter(c => !excludeBoards.includes(c))));
  const [showCalcResult, setShowCalcResult] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('All');

  useEffect(() => {
      if (selectedVariant === 'All') {
          setSelectedItems(new Set((formulaData || []).map(i => i.code).filter(c => !excludeBoards.includes(c))));
          return;
      }
      
      let allowed = ['AAFE70020', 'AASB20710', 'AAST03010'];
      const boards = (formulaData || []).filter(i => i.group === 'Board' && !excludeBoards.includes(i.code)).map(i => i.code);
      allowed = [...allowed, ...boards];
      
      const aaftCodes = ['A','B','C','D','E','F','G','Q'];
      const sprayCodes = ['H','J','K','L','M','N'];
      
      if (selectedVariant === '0') {
          allowed.push('AAFT00010', 'AAFT00110', 'AAFT00210');
      } else if (aaftCodes.includes(selectedVariant)) {
          let tCode = 1; let cCode = 1; 
          switch (selectedVariant) {
              case 'A': tCode = 1; cCode = 1; break; 
              case 'B': tCode = 2; cCode = 1; break; 
              case 'C': tCode = 2; cCode = 2; break; 
              case 'D': tCode = 3; cCode = 1; break; 
              case 'E': tCode = 3; cCode = 2; break; 
              case 'F': tCode = 4; cCode = 1; break; 
              case 'G': tCode = 5; cCode = 1; break; 
              case 'Q': tCode = 1; cCode = 2; break; 
          }
          allowed.push(`AAFT000${tCode}0`, `AAFT001${tCode}0`, `AAFT002${tCode}0`);
          allowed.push(`AATC021${cCode}0`);
      } else if (sprayCodes.includes(selectedVariant)) {
          allowed.push('AATC02130', 'AATC02140');
          if (selectedVariant === 'H') allowed.push('AATC02150');
          else if (selectedVariant === 'J') allowed.push('AATC02160');
          else if (selectedVariant === 'K') allowed.push('AATC02170');
          else if (selectedVariant === 'L') allowed.push('AATC02180');
          else if (selectedVariant === 'M') allowed.push('AATC03200');
          else if (selectedVariant === 'N') allowed.push('AATC02340');
      }
      setSelectedItems(new Set(allowed));
  }, [selectedVariant, formulaData]);

  if (!isOpen) return null;

  const handleDimensionsChange = (w, l) => {
    setWidthInput(w);
    setLengthInput(l);
    const width = parseFloat(w);
    const length = parseFloat(l);
    if (!isNaN(width) && !isNaN(length) && width >= 0 && length >= 0) {
        setAreaInput(+((width / 1000) * (length / 1000)).toFixed(4));
    }
  };

  const handleAreaChange = (val) => {
    setAreaInput(val);
    setWidthInput('');
    setLengthInput('');
  };

  const inputArea = parseFloat(areaInput);
  const isValid = !isNaN(inputArea) && inputArea > 0;

  const formatNumber = (num) => {
      let rounded = Math.round(num * 1000) / 1000;
      return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3);
  };

  const toggleItemSelection = (code) => {
      const newSet = new Set(selectedItems);
      if (newSet.has(code)) {
          newSet.delete(code);
      } else {
          newSet.add(code);
      }
      setSelectedItems(newSet);
  };

  const toggleAll = (checked, items) => {
      if (checked) {
          const newSet = new Set(selectedItems);
          items.forEach(item => newSet.add(item.item));
          setSelectedItems(newSet);
      } else {
          const newSet = new Set(selectedItems);
          items.forEach(item => newSet.delete(item.item));
          setSelectedItems(newSet);
      }
  };

  const generatedItems = [];
  if (isValid && formulaData) {
      formulaData.forEach(item => {
          const qty = formatNumber(inputArea * item.rate);
          if (parseFloat(qty) > 0) {
              generatedItems.push({
                  project: '', 
                  station: item.station, 
                  item: item.code, 
                  dueDate: '', 
                  qty: qty, 
                  reasonCode: '',
                  method: '', 
                  extraOrder: '', 
                  firstQty: qty, 
                  remark: '', 
                  addClose: 'Add',
                  partName: item.name 
              });
          }
      });
  }

  const handleCopyTable = () => {
    const itemsToCopy = generatedItems.filter(row => selectedItems.has(row.item));
    if (itemsToCopy.length === 0) {
        toast.error("ไม่มีข้อมูลที่เลือกให้คัดลอก");
        return;
    }

    const rows = itemsToCopy.map(row => [
        row.project, row.station, row.item, row.dueDate, row.qty, row.reasonCode,
        row.method, row.extraOrder, row.firstQty, row.remark, row.addClose, row.partName
    ].join('\t'));
    const tsvWithoutHeader = rows.join('\n');
    copyToClipboard(tsvWithoutHeader);
    toast.success(`คัดลอกสำเร็จ (${itemsToCopy.length} รายการ)!`);
  };

  const handleExportTable = () => {
    const itemsToCopy = generatedItems.filter(row => selectedItems.has(row.item));
    if (itemsToCopy.length === 0) {
        toast.error("ไม่มีข้อมูลที่เลือกให้ Export");
        return;
    }

    const headers = ["Project", "Station", "Item", "Due Date", "Qty", "Reason Code", "Method", "Extra Order", "First Qty", "Remark", "Add Close", "Part Name"];
    const rows = itemsToCopy.map(row => [
        row.project, row.station, row.item, row.dueDate, row.qty, row.reasonCode,
        row.method, row.extraOrder, row.firstQty, row.remark, row.addClose, row.partName
    ]);
    exportToCsv("AAFT_Calculator_Results.csv", [headers, ...rows]);
  };

  const frameStructItems = (formulaData || []).filter(i => i.group === 'Frame' || i.group === 'Structure');
  const boardItems = (formulaData || []).filter(i => i.group === 'Board' && !excludeBoards.includes(i.code));
  const tileItems = (formulaData || []).filter(i => i.group === 'Tile');
  const aatcItems = (formulaData || []).filter(i => i.group === 'AATC');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-7xl flex flex-col max-h-[95vh]">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center">
                <Calculator className="w-5 h-5 mr-2" /> เครื่องมือคำนวณค่า & สร้างตาราง (Copy to Excel)
            </h2>
            <p className="text-blue-100 text-xs mt-1">อัปเดตสูตรล่าสุดอ้างอิง 1 ตร.ม. (รวมทุกสี)</p>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3 text-sm">1. ระบุขนาดเพื่อคำนวณ (อ้างอิงฐาน 1 ตร.ม.)</h3>
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
                <div className="w-full md:w-1/4">
                    <label className="block text-slate-700 text-xs font-bold mb-1.5">แยกสี/แบบ (Variant)</label>
                    <select 
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="shadow-sm border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm font-medium bg-white"
                    >
                        <option value="All">เลือกอิสระทั้งหมด (All)</option>
                        <option value="0">รหัสลงท้าย 0 (Base White)</option>
                        {panelVariants.map(v => (
                            <option key={v.code} value={v.code}>{v.code} ({v.suffix})</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/4">
                    <label className="block text-slate-700 text-xs font-bold mb-1.5">กว้าง (มม.)</label>
                    <input type="number" step="0.01" min="0" value={widthInput} onChange={(e) => handleDimensionsChange(e.target.value, lengthInput)} placeholder="ความกว้าง"
                        className="shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm"/>
                </div>
                <div className="w-full md:w-1/4">
                    <label className="block text-slate-700 text-xs font-bold mb-1.5">ยาว (มม.)</label>
                    <input type="number" step="0.01" min="0" value={lengthInput} onChange={(e) => handleDimensionsChange(widthInput, e.target.value)} placeholder="ความยาว"
                        className="shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm"/>
                </div>
                <div className="w-full md:w-1/4">
                    <label className="block text-blue-700 text-xs font-bold mb-1.5">พื้นที่รวม (ตร.ม.) *พิมพ์แก้ได้</label>
                    <div className="relative">
                        <input type="number" step="0.01" value={areaInput} onChange={(e) => handleAreaChange(e.target.value)}
                            className="shadow-sm appearance-none border border-blue-400 bg-blue-50 rounded-lg w-full py-2 px-3 text-blue-900 font-bold leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 text-sm"/>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-600 text-xs font-bold">ตร.ม.</div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
            {showCalcResult && (
                <div className="lg:col-span-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
                    <h3 className="font-bold text-slate-700 text-sm border-b pb-2">ผลลัพธ์การคำนวณ</h3>
                    
                    {frameStructItems.map((item, idx) => (
                    <div key={item.code} className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between" title={item.name}>
                        <div>
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 inline-block">{item.label}</span>
                            <div className="text-slate-800 font-bold text-sm">{item.code}</div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-xl font-extrabold text-slate-800">{isValid ? formatNumber(inputArea * item.rate) : '0'}</span>
                            <span className="ml-1 text-[10px] text-slate-500 font-medium">{item.group === 'Frame' ? 'เส้น' : 'Pc.'}</span>
                        </div>
                    </div>
                ))}

                <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">กลุ่ม Tile (ทุกสี)</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {tileItems.map(item => (
                            <div key={item.code} className="bg-blue-50 rounded-lg p-2 border border-blue-100 shadow-sm text-center" title={item.name}>
                                <div className="text-blue-800 font-bold text-[10px] mb-0.5 truncate">{item.label}</div>
                                <div className="text-sm font-extrabold text-slate-800">{isValid ? formatNumber(inputArea * item.rate) : '0'}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">กลุ่ม Board (1 / Area)</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {boardItems.map(item => (
                            <div key={item.code} className="bg-purple-50 rounded-lg p-2 border border-purple-100 shadow-sm text-center" title={item.name}>
                                <div className="text-purple-800 font-bold text-[10px] mb-0.5 truncate">{item.code}</div>
                                <div className="text-sm font-extrabold text-slate-800">{isValid ? formatNumber(inputArea * item.rate) : '0'}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">กลุ่ม AATC</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {aatcItems.map(item => (
                            <div key={item.code} className="bg-orange-50 rounded-lg p-2 border border-orange-100 shadow-sm text-center" title={item.name}>
                                <div className="text-orange-800 font-bold text-[10px] mb-0.5 truncate">{item.code}</div>
                                <div className="text-sm font-extrabold text-slate-800">{isValid ? formatNumber(inputArea * item.rate) : '0'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            <div className={`${showCalcResult ? 'lg:col-span-3 border-l border-slate-200 pl-6' : 'lg:col-span-4'} flex flex-col min-h-0`}>
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-700 text-sm">2. ตารางผลลัพธ์ (ฟอร์แมต Excel)</h3>
                        <button 
                            onClick={() => setShowCalcResult(!showCalcResult)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        >
                            {showCalcResult ? <><EyeOff className="w-3.5 h-3.5" /> ซ่อนผลคำนวณ</> : <><Eye className="w-3.5 h-3.5" /> แสดงผลคำนวณ</>}
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExportTable} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm border border-emerald-200">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button onClick={handleCopyTable} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 shadow-sm border border-emerald-200">
                            <Copy className="w-4 h-4" /> Copy Table
                        </button>
                    </div>
                </div>
                
                <div className="border border-slate-300 rounded-lg overflow-x-auto custom-scrollbar flex-1 bg-white">
                    <table className="w-full text-[13px] text-center border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b-2 border-slate-400">
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={generatedItems.length > 0 && generatedItems.every(r => selectedItems.has(r.item))}
                                        onChange={(e) => toggleAll(e.target.checked, generatedItems)} title="เลือกทั้งหมด" />
                                </th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Project</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Station / Task</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Item</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-gray-300 text-black font-bold">Due Date</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Qty</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Reason Code</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Method To Carry</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">Extra Order No</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-gray-300 text-black font-bold">First QTY</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-yellow-300 text-black font-bold">ระบุสาเหตุ Extra</th>
                                <th className="px-3 py-2 border-r border-slate-300 bg-red-600 text-white font-bold">Add/Close Demand</th>
                                <th className="px-3 py-2 bg-orange-200 text-black font-bold text-left">Part Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedItems.length > 0 ? (
                                generatedItems.map((row, idx) => (
                                    <tr key={idx} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${selectedItems.has(row.item) ? '' : 'hidden'}`}>
                                        <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={selectedItems.has(row.item)} onChange={() => toggleItemSelection(row.item)} />
                                        </td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.project}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.station}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200 font-semibold">{row.item}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200 bg-gray-50/50">{row.dueDate}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200 font-bold text-blue-700 bg-blue-50/30">{row.qty}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.reasonCode}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.method}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.extraOrder}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200 bg-gray-50/50 font-bold text-blue-700">{row.firstQty}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200">{row.remark}</td>
                                        <td className="px-3 py-1.5 border-r border-slate-200 font-bold text-red-600">{row.addClose}</td>
                                        <td className="px-3 py-1.5 text-left text-xs text-slate-600 truncate max-w-[250px]" title={row.partName}>{row.partName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="p-8 text-center text-slate-400">กรุณาระบุพื้นที่ (กว้างxยาว หรือ ตร.ม.) เพื่อสร้างข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}