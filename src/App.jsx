import React, { useState, useRef, useEffect } from 'react';
import { 
  Boxes, ListTodo, FileSpreadsheet, Check, Upload, Calculator, Plus, Save, Trash2, Copy, X, Download, Zap
} from 'lucide-react';

// === MOCK DATA ===
const initialPsJobsData = [];
const initialImMasterData = [];
const initialPsBomData = [];

// === VARIANT MAPPING ===
const panelVariants = [
  { code: "A", suffix: "WIC" }, { code: "B", suffix: "GIC" }, { code: "C", suffix: "GBC" },
  { code: "D", suffix: "BIC" }, { code: "E", suffix: "BBC" }, { code: "F", suffix: "EIC" },
  { code: "G", suffix: "SIC" }, { code: "Q", suffix: "WBC" }, { code: "H", suffix: "SB" },
  { code: "J", suffix: "GW" },  { code: "K", suffix: "MB" },  { code: "L", suffix: "EG" },
  { code: "M", suffix: "AG" },  { code: "N", suffix: "PU-W" }
];

const defaultRow = {
  partId: '', method: '', place: '', station: '', partName: '', drawing: '', glAccount: '',
  costCenter: '', costStructure: '', orderType: '', partUnit: '', purchaseGroup: '',
  valClass: '', thickness: '', width: '', length: '', exWall: '', color: '', status: '',
  taperSide: '', tp1: '', tp2: '', tp3: '', tp4: ''
};

const gridColumns = [
  { label: "Part ID", field: "partId", width: "min-w-[150px]" },
  { label: "Method", field: "method", width: "min-w-[80px]" },
  { label: "Place", field: "place", width: "min-w-[70px]" },
  { label: "Station", field: "station", width: "min-w-[130px]" },
  { label: "Part Name", field: "partName", width: "min-w-[220px]" },
  { label: "Drawing", field: "drawing", width: "min-w-[130px]" },
  { label: "GL Account", field: "glAccount", width: "min-w-[100px]" },
  { label: "Cost Center", field: "costCenter", width: "min-w-[110px]" },
  { label: "Cost Structure", field: "costStructure", width: "min-w-[160px]" },
  { label: "Order Type", field: "orderType", width: "min-w-[100px]" },
  { label: "Part Unit", field: "partUnit", width: "min-w-[90px]" },
  { label: "Pur. Group", field: "purchaseGroup", width: "min-w-[100px]" },
  { label: "Val Class", field: "valClass", width: "min-w-[90px]" },
  { label: "Thickness", field: "thickness", width: "min-w-[90px]" },
  { label: "Width", field: "width", width: "min-w-[80px]" },
  { label: "Length", field: "length", width: "min-w-[80px]" },
  { label: "Ex Wall", field: "exWall", width: "min-w-[80px]" },
  { label: "Color", field: "color", width: "min-w-[80px]" },
  { label: "Status", field: "status", width: "min-w-[80px]" },
  { label: "Taper Side", field: "taperSide", width: "min-w-[100px]" },
  { label: "TP1 Upper", field: "tp1", width: "min-w-[100px]" },
  { label: "TP2 Upper R", field: "tp2", width: "min-w-[110px]" },
  { label: "TP3", field: "tp3", width: "min-w-[80px]" },
  { label: "TP4 Upper L", field: "tp4", width: "min-w-[110px]" }
];

// === ฟังก์ชันคัดลอกข้อความ ===
const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy', err);
    alert("ไม่สามารถคัดลอกข้อมูลได้");
  }
  document.body.removeChild(textArea);
};

// === Helper Functions ===
const isBasePanelId = (partId) => partId && (partId.startsWith('AAFP') || partId.startsWith('CCFP') || partId.startsWith('BBFP') || partId.startsWith('DDFP'));
const isFrameId = (partId) => partId && (partId.startsWith('AAFE') || partId.startsWith('CCFE') || partId.startsWith('BBFE') || partId.startsWith('DDFE'));
const isBoardId = (partId) => partId && (partId.startsWith('AAFZ') || partId.startsWith('CCFZ') || partId.startsWith('BBFZ') || partId.startsWith('DDFZ'));

// === MASTER FORMULA DATA (อัตราส่วนต่อ 1 ตร.ม.) ===
const formulaMasterData = [
    // Frame & Structure
    { code: 'AAFE70020', group: 'Frame', label: 'Frame', rate: 1.5, station: 'PF-FP', name: 'Exterior Pipe size 32*14*1.0 L 3.187 m' },
    { code: 'AAST03010', group: 'Structure', label: 'Rivet', rate: 5.0174, station: 'PF-FP', name: 'EW rivet 7x19' },
    
    // Boards
    { code: 'AADZ09904', group: 'Board', label: 'SB 25mm', rate: 1/2.97, station: 'PF-BP (Ext-wall)', name: 'SB_25x1235x2405mm (ZCA68010101488)' },
    { code: 'AADZ09903', group: 'Board', label: 'SB 16mm', rate: 1/2.88, station: 'PF-BP (Ext-wall)', name: 'SB_16x1200x2400 (ZCA64610100003)' },
    { code: 'AAFZ09901', group: 'Board', label: 'SB 12mm', rate: 1/2.88, station: 'PF-BP (Ext-wall)', name: 'SB_12x1200x2400 _no sanding ZCA64210100003' },
    { code: 'AAFZ09902', group: 'Board', label: 'SB 12x1032', rate: 1/3.34, station: 'PF-BP (Ext-wall)', name: 'SB_12x1032x3240 _no SD (ZCA68010101483)' },
    { code: 'AAFZ09903', group: 'Board', label: 'SB 12 B', rate: 1/3.34, station: 'PF-BP (Ext-wall)', name: 'SB_12x1032x3240 _no sanding (ZCA68010101485) Grade B' },
    { code: 'DDFZ09902', group: 'Board', label: 'SB High', rate: 1/3.76, station: 'PF-BP (Ext-wall)', name: 'SB_12x1032x3650 _no SD (ZCA68010101487)_High Unit' },
    { code: 'AALZ09320', group: 'Board', label: 'SB 10mm', rate: 1/2.88, station: 'PF-BP (Ext-wall)', name: 'SB_10x1200x2400' },
    { code: 'AAHZ09900', group: 'Board', label: 'SB 8 Sand', rate: 1/3.39, station: 'PF-BP (Ext-wall)', name: 'SB_8x1200x2831 _sanding (ZCA68010101478)' },
    { code: 'DDHZ09900', group: 'Board', label: 'SB 8 High', rate: 1/3.89, station: 'PF-BP (Ext-wall)', name: 'SB_8x1200x3243_sanding (ZCA68010101486)_High Unit' },
    { code: 'AAGY0002A', group: 'Board', label: 'GB 9mm', rate: 1/2.03, station: 'PF-BP (Ext-wall)', name: 'GB_9x898x2264' },
    { code: 'AAGY5070A', group: 'Board', label: 'MGB 9mm', rate: 1/2.88, station: 'PF-BP (Ext-wall)', name: 'MGB_9x1200x2400' },

    // Tiles (รวมทุกสี)
    { code: 'AAFT00010', group: 'Tile', label: '217 White', rate: 51, station: 'PF-TP', name: 'GT 2.40X8.68X0.32 Custalian White (Std.)' },
    { code: 'AAFT00110', group: 'Tile', label: '104 White', rate: 33, station: 'PF-TP', name: 'GT 2.40X4.16X0.32 Custalian White (Std.)' },
    { code: 'AAFT00210', group: 'Tile', label: 'Cor White', rate: 61, station: 'PF-TP', name: 'GT 2.40X5.54X0.32 Custalian White (Corner)' },
    
    { code: 'AAFT00020', group: 'Tile', label: '217 Grey', rate: 51, station: 'PF-TP', name: 'GT 2.40X8.68X0.32 Custalian Grey (Std.)' },
    { code: 'AAFT00120', group: 'Tile', label: '104 Grey', rate: 33, station: 'PF-TP', name: 'GT 2.40X4.16X0.32 Custalian Grey (Std.)' },
    { code: 'AAFT00220', group: 'Tile', label: 'Cor Grey', rate: 61, station: 'PF-TP', name: 'GT 2.40X5.54X0.32 Custalian Grey (Corner)' },
    
    { code: 'AAFT00030', group: 'Tile', label: '217 Brown', rate: 51, station: 'PF-TP', name: 'GT 2.40X8.68X0.32 Custalian Brown (Std.)' },
    { code: 'AAFT00130', group: 'Tile', label: '104 Brown', rate: 33, station: 'PF-TP', name: 'GT 2.40X4.16X0.32 Custalian Brown (Std.)' },
    { code: 'AAFT00230', group: 'Tile', label: 'Cor Brown', rate: 61, station: 'PF-TP', name: 'GT 2.40X5.54X0.32 Custalian Brown (Corner)' },
    
    { code: 'AAFT00040', group: 'Tile', label: '217 Beige', rate: 51, station: 'PF-TP', name: 'GT 2.40X8.68X0.32 Custalian Beige (Std.)' },
    { code: 'AAFT00140', group: 'Tile', label: '104 Beige', rate: 33, station: 'PF-TP', name: 'GT 2.40X4.16X0.32 Custalian Beige (Std.)' },
    { code: 'AAFT00240', group: 'Tile', label: 'Cor Beige', rate: 61, station: 'PF-TP', name: 'GT 2.40X5.54X0.32 Custalian Beige (Corner)' },
    
    { code: 'AAFT00050', group: 'Tile', label: '217 Sand', rate: 51, station: 'PF-TP', name: 'GT 2.40X8.68X0.32 Custalian Sand (Std.)' },
    { code: 'AAFT00150', group: 'Tile', label: '104 Sand', rate: 33, station: 'PF-TP', name: 'GT 2.40X4.16X0.32 Custalian Sand (Std.)' },
    { code: 'AAFT00250', group: 'Tile', label: 'Cor Sand', rate: 61, station: 'PF-TP', name: 'GT 2.40X5.54X0.32 Custalian Sand (Corner)' },

    // AATC Chemicals
    { code: 'AATC02110', group: 'AATC', label: 'AATC02110', rate: 0.95, station: 'Kanban => PF-TP', name: 'Glue of ex panel WH C (Kendy White)' },
    { code: 'AATC02130', group: 'AATC', label: 'AATC02130', rate: 1.05, station: 'Kanban => PF-TP', name: 'SCG PATTERN COATING' },
    { code: 'AATC02140', group: 'AATC', label: 'AATC02140', rate: 0.11, station: 'Kanban => PF-TP', name: 'SCG SEALER2' },
    { code: 'AATC02150', group: 'AATC', label: 'AATC02150', rate: 0.38, station: 'Kanban => PF-TP', name: 'SCG TOP COAT S-BEIGE' },
    { code: 'AATC02160', group: 'AATC', label: 'AATC02160', rate: 0.77, station: 'Kanban => PF-TP', name: 'SCG TOP COAT G-WHITE' },
    { code: 'AATC02170', group: 'AATC', label: 'AATC02170', rate: 0.38, station: 'Kanban => PF-TP', name: 'SCG TOP COAT M-BROWN' },
    { code: 'AATC02180', group: 'AATC', label: 'AATC02180', rate: 0.38, station: 'Kanban => PF-TP', name: 'SCG TOP COAT E-GREY' }
];

// === COMPONENTS ===
function AaftCalculatorModal({ isOpen, onClose }) {
  const [areaInput, setAreaInput] = useState(1);
  const [widthInput, setWidthInput] = useState('');
  const [lengthInput, setLengthInput] = useState('');

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
      let rounded = Math.round(num * 100) / 100;
      return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  };

  // สร้างข้อมูลตารางเพื่อ Copy (รวมทุกรายการที่จำนวน > 0)
  const generatedItems = [];
  if (isValid) {
      formulaMasterData.forEach(item => {
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
    if (generatedItems.length === 0) return alert("ไม่มีข้อมูลให้คัดลอก โปรดระบุพื้นที่");
    const headers = ["Project", "Station / Task", "Item", "Due Date", "Qty", "Reason Code", "Method To Carry", "Extra Order No", "First QTY", "ระบุสาเหตุ Extra", "Add/Close Demand", "Part Name"];
    const rows = generatedItems.map(row => [
        row.project, row.station, row.item, row.dueDate, row.qty, row.reasonCode,
        row.method, row.extraOrder, row.firstQty, row.remark, row.addClose, row.partName
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    copyToClipboard(tsv);
    alert("คัดลอกตารางสำเร็จ! สามารถนำไป Paste ใน Excel ได้เลยครับ");
  };

  const frameStructItems = formulaMasterData.filter(i => i.group === 'Frame' || i.group === 'Structure');
  const boardItems = formulaMasterData.filter(i => i.group === 'Board');
  const tileItems = formulaMasterData.filter(i => i.group === 'Tile');
  const aatcItems = formulaMasterData.filter(i => i.group === 'AATC');

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
                <div className="w-full md:w-1/3">
                    <label className="block text-slate-700 text-xs font-bold mb-1.5">กว้าง (มม.)</label>
                    <input type="number" step="0.01" min="0" value={widthInput} onChange={(e) => handleDimensionsChange(e.target.value, lengthInput)} placeholder="ความกว้าง"
                        className="shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm"/>
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-slate-700 text-xs font-bold mb-1.5">ยาว (มม.)</label>
                    <input type="number" step="0.01" min="0" value={lengthInput} onChange={(e) => handleDimensionsChange(widthInput, e.target.value)} placeholder="ความยาว"
                        className="shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm"/>
                </div>
                <div className="w-full md:w-1/3">
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
            {/* Calculation Result Summary Panel */}
            <div className="lg:col-span-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
                <h3 className="font-bold text-slate-700 text-sm border-b pb-2">ผลลัพธ์การคำนวณ</h3>
                
                {/* Frame & Structure */}
                {frameStructItems.map((item, idx) => (
                    <div key={item.code} className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between" title={item.name}>
                        <div>
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 inline-block">{item.label}</span>
                            <div className="text-slate-800 font-bold text-sm">{item.code}</div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-xl font-extrabold text-slate-800">{isValid ? formatNumber(inputArea * item.rate) : '0'}</span>
                            <span className="ml-1 text-[10px] text-slate-500 font-medium">
                                {item.group === 'Frame' ? 'เส้น' : 'Pc.'}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Tiles Grid */}
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

                {/* Boards Grid */}
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

                {/* AATC Grid */}
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

            {/* Excel Table Section */}
            <div className="lg:col-span-3 flex flex-col min-h-0 border-l border-slate-200 pl-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="font-bold text-slate-700 text-sm">2. ตารางผลลัพธ์ (ฟอร์แมต Excel)</h3>
                    <button onClick={handleCopyTable} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 shadow-sm border border-emerald-200">
                        <Copy className="w-4 h-4" /> Copy Table
                    </button>
                </div>
                
                <div className="border border-slate-300 rounded-lg overflow-x-auto custom-scrollbar flex-1 bg-white">
                    <table className="w-full text-[13px] text-center border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b-2 border-slate-400">
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
                                <th className="px-3 py-2 bg-orange-200 text-black font-bold">Part Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedItems.length > 0 ? (
                                generatedItems.map((row, idx) => (
                                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
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
                                        <td className="px-3 py-1.5 text-left text-xs text-slate-600 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.partName}>{row.partName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="p-8 text-center text-slate-400">
                                        กรุณาระบุพื้นที่ (กว้างxยาว หรือ ตร.ม.) เพื่อสร้างข้อมูล
                                    </td>
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

// === MAIN APP COMPONENT ===
export default function App() {
  const [activeTab, setActiveTab] = useState('create_ps');
  const [psJobs, setPsJobs] = useState(initialPsJobsData);
  const [imMasterData, setImMasterData] = useState(initialImMasterData);
  const [psBomData, setPsBomData] = useState(initialPsBomData);
  const [psGridData, setPsGridData] = useState([{ ...defaultRow }]);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('erp_system_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.psGridData && parsed.psGridData.length > 0) setPsGridData(parsed.psGridData);
        if (parsed.imMasterData && parsed.imMasterData.length > 0) setImMasterData(parsed.imMasterData);
        if (parsed.psBomData && parsed.psBomData.length > 0) setPsBomData(parsed.psBomData);
        if (parsed.psJobs && parsed.psJobs.length > 0) setPsJobs(parsed.psJobs);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "'Supermarket', sans-serif" }}>
      <style>
        {`
          @font-face {
            font-family: 'Supermarket';
            src: url('https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/Supermarket/Supermarket.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/Supermarket/Supermarket.woff') format('woff');
            font-weight: normal; font-style: normal; font-display: swap;
          }
          * { font-family: 'Supermarket', sans-serif !important; }
          .custom-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}
      </style>
      
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm">IM</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">IM (Item Master) <span className="text-red-600">Auto</span> PS Exterior-Wall</h1>
            <p className="text-xs text-slate-500 mt-0.5">Smart CSV Parser (คำนวณ ตร.ม. อัตโนมัติ)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <button onClick={() => setActiveTab('create_ps')} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'create_ps' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <FileSpreadsheet className="w-4 h-4" /> Create PS (IM Mode)
          </button>
          <button onClick={() => setActiveTab('im')} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'im' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <Boxes className="w-4 h-4" /> Item Auto
          </button>
          <button onClick={() => setActiveTab('ps')} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'ps' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <ListTodo className="w-4 h-4" /> PS Auto
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button onClick={() => setIsCalculatorOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 shadow-sm border border-indigo-200">
            <Calculator className="w-4 h-4" /> เครื่องมือคำนวณค่า (Copy)
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="w-full">
          {activeTab === 'create_ps' && (
            <CreatePsTab 
              psGridData={psGridData} setPsGridData={setPsGridData}
              imMasterData={imMasterData} setImMasterData={setImMasterData}
              psBomData={psBomData} setPsBomData={setPsBomData}
              psJobs={psJobs} setPsJobs={setPsJobs} setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'im' && <ImTab data={imMasterData} />}
          {activeTab === 'ps' && <PsTab data={psBomData} setData={setPsBomData} />}
        </div>
      </main>

      <AaftCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
}

// === CREATE PS TAB ===
function CreatePsTab({ psGridData, setPsGridData, imMasterData, setImMasterData, psBomData, setPsBomData, psJobs, setPsJobs, setActiveTab }) {
  const fileInputRef = useRef(null);

  // กู้คืนฟังก์ชันที่ใช้ในปุ่มต่างๆ
  const handleGridChange = (index, field, value) => {
    const newData = [...psGridData];
    newData[index] = { ...newData[index], [field]: value };
    setPsGridData(newData);
  };

  const handleAddRow = () => {
    setPsGridData([...psGridData, { ...defaultRow }]);
  };

  const handleSaveData = () => {
    const dataToSave = { psGridData, imMasterData, psBomData, psJobs };
    localStorage.setItem('erp_system_data', JSON.stringify(dataToSave));
    alert("บันทึกข้อมูลสำเร็จ! (ข้อมูลจะยังอยู่แม้จะปิดหรือรีเฟรชหน้าต่าง)");
  };

  const handleClearData = () => {
    if(window.confirm("คุณต้องการล้างข้อมูลทั้งหมดในระบบใช่หรือไม่?")) {
      setPsGridData([{ ...defaultRow }]);
      setImMasterData([]);
      setPsBomData([]);
      setPsJobs([]);
      localStorage.removeItem('erp_system_data');
    }
  };

  // ฟังก์ชันย่อยสำหรับประมวลผลข้อมูล CSV ให้อยู่ในรูปแบบที่ต้องการ
  const processCSVData = (csvText) => {
      const lines = csvText.split('\n').map(line => line.replace(/\r/g, '').trim()).filter(line => line && !line.match(/^,+$/));
      
      if (lines.length < 2) {
          alert("ข้อผิดพลาด: ไฟล์ CSV ไม่มีข้อมูลหรือมีแค่หัวตาราง");
          return;
      }

      const newData = [];
      const hasHeaders = lines[0].toUpperCase().includes('PART ID');
      const startIdx = hasHeaders ? 1 : 0; 
      let errorRows = [];

      for (let i = startIdx; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (!cols[0]) continue;
          
          if (cols.length < 5) {
              errorRows.push(i + 1);
              continue;
          }

          newData.push({
              partId: cols[0] || '', method: cols[1] || '', place: cols[2] || '', station: cols[3] || '',
              partName: cols[4] || '', drawing: cols[5] || '', glAccount: cols[6] || '', costCenter: cols[7] || '',
              costStructure: cols[8] || '', orderType: cols[9] || '', partUnit: cols[10] || '',
              purchaseGroup: cols[11] || '', valClass: cols[12] || '', thickness: cols[13] || '',
              width: cols[14] || '', length: cols[15] || '', exWall: cols[16] || '', color: cols[17] || '',
              status: cols[18] || '', taperSide: cols[19] || '', tp1: cols[20] || '', tp2: cols[21] || '',
              tp3: cols[22] || '', tp4: cols[23] || ''
          });
      }

      if (errorRows.length > 0) {
          alert(`ระบบพบข้อมูลไม่สมบูรณ์ที่บรรทัด: ${errorRows.join(', ')}\n(ระบบจะข้ามบรรทัดเหล่านี้ไป)`);
      }

      if (newData.length > 0) setPsGridData(newData);

      let newImItems = [];
      let newBomItems = [];
      const existingImIds = new Set(imMasterData.map(item => item.partId));

      newData.forEach(row => {
          if (!existingImIds.has(row.partId)) {
              let col1 = ""; let col2 = "";
              let exwValue = row.exWall || ""; 

              if (isBasePanelId(row.partId)) {
                  const fpLastChar = row.partId.slice(-1).toUpperCase();
                  const suffixMap = {
                      '0': 'WI', 'A': 'WIC', 'B': 'GIC', 'C': 'GBC', 'D': 'BIC', 'E': 'BBC',
                      'F': 'EIC', 'G': 'SIC', 'Q': 'WBC', 'H': 'SB', 'J': 'GW', 'K': 'MB',
                      'L': 'EG', 'M': 'AG', 'N': 'PU-W'
                  };
                  col2 = suffixMap[fpLastChar] || '';
                  if (fpLastChar === '0') {
                      col1 = 'Panel หลัก :';
                      exwValue = '0'; 
                  } else {
                      col1 = col2 ? fpLastChar : '';
                  }
              } else if (isFrameId(row.partId)) { col1 = "เฟรม Cotco :"; } 
              else if (isBoardId(row.partId)) { col1 = "Smartboard :"; }
              
              newImItems.push({
                  col1, col2, partId: row.partId, method: row.method || "2", place: row.place || "F",
                  station: row.station || "", partName: row.partName || "", drawId: row.drawing || "",
                  gl: row.glAccount || "", cc: row.costCenter || "", cs: row.costStructure || "",
                  ot: row.orderType || "", unit: row.partUnit || "PC", pg: row.purchaseGroup || "",
                  vc: row.valClass || "", t: row.thickness || "", l1: row.width || "", l2: row.length || "",
                  exw: exwValue, color: row.color || "", status: row.status || ""
              });
              existingImIds.add(row.partId);
          }
      });

      const addBomItem = (parent, child, amount, method, place, station, isBlue) => {
          if (!parent || !child) return;
          const existsInState = psBomData.some(bom => bom.part_id_parent === parent && bom.part_id_child === child);
          const existsInNew = newBomItems.some(bom => bom.part_id_parent === parent && bom.part_id_child === child);
          if (!existsInState && !existsInNew) newBomItems.push({ part_id_parent: parent, part_id_child: child, amount: String(amount), method, place, station, isBlue });
      };

      const getRate = (code) => {
          const found = formulaMasterData.find(f => f.code === code);
          return found ? found.rate : 0;
      };

      const basePanels = newData.filter(r => isBasePanelId(r.partId) && r.partId.endsWith('0'));
      
      if (basePanels.length === 0) {
          alert("คำเตือน: ไม่พบรหัส Base Panel (รหัสที่ลงท้ายด้วย 0) ในไฟล์ที่นำเข้า การสร้างสูตร Variants อาจไม่สมบูรณ์");
      }

      basePanels.forEach(fpBase => {
          const projectCode = fpBase.partId.length >= 8 ? fpBase.partId.substring(4, 8) : '';
          let feBase = newData.find(r => isFrameId(r.partId) && r.partId.includes(projectCode));
          if (!feBase) feBase = newData.find(r => isFrameId(r.partId)); 
          
          let fzBase = newData.find(r => isBoardId(r.partId) && r.partId.includes(projectCode));
          if (!fzBase) fzBase = newData.find(r => isBoardId(r.partId));

          const areaImpNum = ((Number(fzBase?.width || 0) * Number(fzBase?.length || 0)) / 1000000);
          const formatQtyImp = (num) => {
              let rounded = Math.round(num * 100) / 100;
              return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
          };

          const fzPartName = fzBase?.partName || '';
          const hasTp45 = fzPartName.toLowerCase().includes('tp_45');

          const qty217Calc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00010')) : "0";
          const qty104Calc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00110')) : "0";
          const qtyCornerCalc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00210')) : "0";

          if (feBase) addBomItem(fpBase.partId, feBase.partId, "1", "2", "F", "PF-FP", false);
          if (Number(qty217Calc) > 0) addBomItem(fpBase.partId, `AAFT00010`, qty217Calc, "2", "F", "PF-TP", false);
          if (Number(qty104Calc) > 0) addBomItem(fpBase.partId, `AAFT00110`, qty104Calc, "2", "F", "PF-TP", false);
          if (hasTp45 && Number(qtyCornerCalc) > 0) addBomItem(fpBase.partId, `AAFT00210`, qtyCornerCalc, "2", "F", "PF-TP", false);
          if (fzBase) addBomItem(fpBase.partId, fzBase.partId, "1", "2", "F", "PF-BP (Ext-wall)", false);
          
          const baseId = fpBase.partId.slice(0, -1);
          const baseName = fpBase.partName.replace(/\s+WI\s*$/i, '');
          
          panelVariants.forEach((variant) => {
              const vPartId = baseId + variant.code;
              const vPartName = baseName + " " + variant.suffix;
              
              if (!existingImIds.has(vPartId)) {
                  newImItems.push({
                      col1: variant.code, col2: variant.suffix, partId: vPartId,
                      method: "2", place: "F", station: "PF-TP",
                      partName: vPartName, drawId: fpBase.drawing || "", gl: "716307",
                      cc: "1631-10300", cs: fpBase.costStructure || "", ot: "3", unit: "PC", pg: fpBase.purchaseGroup || "4P0", vc: fpBase.valClass || "0V07",
                      t: "", l1: "", l2: "", exw: "1", color: "", status: fpBase.status || "" 
                  });
                  existingImIds.add(vPartId);
              }

              if(feBase) addBomItem(vPartId, feBase.partId, "1", "2", "F", "PF-FP", true);
              
              const aaftCodes = ['A','B','C','D','E','F','G','Q'];
              const sprayCodes = ['H','J','K','L','M','N'];

              if (aaftCodes.includes(variant.code)) {
                  let tCode = 1; let cCode = 1; 
                  switch (variant.code) {
                      case 'A': tCode = 1; cCode = 1; break; 
                      case 'B': tCode = 2; cCode = 1; break; 
                      case 'C': tCode = 2; cCode = 2; break; 
                      case 'D': tCode = 3; cCode = 1; break; 
                      case 'E': tCode = 3; cCode = 2; break; 
                      case 'F': tCode = 4; cCode = 1; break; 
                      case 'G': tCode = 5; cCode = 1; break; 
                      case 'Q': tCode = 1; cCode = 2; break; 
                      default: break;
                  }

                  if (Number(qty217Calc) > 0) addBomItem(vPartId, `AAFT000${tCode}0`, qty217Calc, "2", "F", "PF-TP", true);
                  if (Number(qty104Calc) > 0) addBomItem(vPartId, `AAFT001${tCode}0`, qty104Calc, "2", "F", "PF-TP", true);
                  if (hasTp45 && Number(qtyCornerCalc) > 0) addBomItem(vPartId, `AAFT002${tCode}0`, qtyCornerCalc, "2", "F", "PF-TP", true);
                  if (fzBase) addBomItem(vPartId, fzBase.partId, "1", "2", "F", "PF-BP (Ext-wall)", true);

                  const qtyCoat = formatQtyImp(areaImpNum * getRate('AATC02110'));
                  if (Number(qtyCoat) > 0) addBomItem(vPartId, `AATC021${cCode}0`, qtyCoat, "2", "F", "Kanban => PF-TP", true);
              } 
              else if (sprayCodes.includes(variant.code)) {
                  if(fzBase) addBomItem(vPartId, fzBase.partId, "1", "2", "F", "PF-BP (Ext-wall)", true);

                  const qty30 = formatQtyImp(areaImpNum * getRate('AATC02130'));
                  const qty40 = formatQtyImp(areaImpNum * getRate('AATC02140'));
                  if (Number(qty30) > 0) addBomItem(vPartId, `AATC02130`, qty30, "2", "F", "Kanban => PF-TP", true);
                  if (Number(qty40) > 0) addBomItem(vPartId, `AATC02140`, qty40, "2", "F", "Kanban => PF-TP", true);

                  let thirdCoatCode = ''; let thirdCoatRate = 0;
                  if (variant.code === 'H') { thirdCoatCode = 'AATC02150'; thirdCoatRate = getRate('AATC02150'); }
                  else if (variant.code === 'J') { thirdCoatCode = 'AATC02160'; thirdCoatRate = getRate('AATC02160'); }
                  else if (variant.code === 'K') { thirdCoatCode = 'AATC02170'; thirdCoatRate = getRate('AATC02170'); }
                  else if (variant.code === 'L') { thirdCoatCode = 'AATC02180'; thirdCoatRate = getRate('AATC02180'); }
                  else if (variant.code === 'M') { thirdCoatCode = 'AATC03200'; thirdCoatRate = 0.38; } // Assume default if not in list
                  else if (variant.code === 'N') { thirdCoatCode = 'AATC02340'; thirdCoatRate = 0.77; }

                  if (thirdCoatCode && thirdCoatRate > 0) {
                      const qtyThird = formatQtyImp(areaImpNum * thirdCoatRate);
                      if (Number(qtyThird) > 0) addBomItem(vPartId, thirdCoatCode, qtyThird, "2", "F", "Kanban => PF-TP", true);
                  }
              }
          });
      });

      if (newImItems.length > 0) {
          setImMasterData(prev => [...newImItems, ...prev].sort((a, b) => a.partId.localeCompare(b.partId)));
      }
      if (newBomItems.length > 0) {
          setPsBomData(prev => [...newBomItems, ...prev].sort((a, b) => {
              if (a.part_id_parent === b.part_id_parent) {
                  const getPriority = (id) => {
                      if (isFrameId(id)) return 1;
                      if (id.startsWith('AAFT')) return 2;
                      if (isBoardId(id)) return 3;
                      if (id.startsWith('AATC')) return 4;
                      return 5;
                  };
                  const pA = getPriority(a.part_id_child);
                  const pB = getPriority(b.part_id_child);
                  if (pA !== pB) return pA - pB;
                  return a.part_id_child.localeCompare(b.part_id_child);
              }
              return a.part_id_parent.localeCompare(b.part_id_parent);
          }));
      }

      alert(`นำเข้าข้อมูลและสร้างสูตรสำเร็จ!\n- ประมวลผลกลุ่ม Base Panel พบ: ${basePanels.length} กลุ่ม\n- สร้าง IM Master และ BOM อัตโนมัติเรียบร้อยแล้วครับ`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        processCSVData(event.target.result);
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบรูปแบบไฟล์ CSV");
      }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const handleTestMode = () => {
    // ข้อมูลจำลองสำหรับการกดปุ่ม Test Mode
    const mockCsvData = `Part ID,Method,Place,Station,Part Name,Drawing,GL Account,Cost Center,Cost Structure,Order Type,Part Unit,Purchase Group,Val Class,Thickness,Width,Length,Ex Wall,Color,Status,Taper Side,TP1,TP2,TP3,TP4
AAFP01010,2,F,PF-TP,TWH WB 450 B KI*Low*WI,DWG-001,716307,1631-10300,Exterior wall panel,3,PC,4P0,0V07,100,1032,2790,0,White,1,,,,,
AAFE01010,2,F,PF-FP,FR IED frame 0098 door R,DWG-002,716307,1631-10300,Exterior wall panel,3,PC,4P2,0V07,1.0,32,3187,0,Silver,1,,,,,
AAFZ01010,2,F,PF-BP,SB_12x1032x2790_tp_45,DWG-003,716306,1631-10300,Exterior wall panel,5,PC,4P2,0V06,12,1032,2790,1,Grey,2,,,,,`;
    
    // ยืนยันการเคลียร์ข้อมูลเก่าก่อนเริ่ม Test
    if (psGridData.length > 1 || imMasterData.length > 0) {
        if(!window.confirm("ระบบกำลังจะเคลียร์ข้อมูลเดิมทั้งหมดและใส่ข้อมูลทดสอบ (Mock Data) ลงไปแทน ต้องการดำเนินการต่อหรือไม่?")) {
            return;
        }
        setPsGridData([{ ...defaultRow }]);
        setImMasterData([]);
        setPsBomData([]);
        setPsJobs([]);
    }
    
    try {
        processCSVData(mockCsvData);
    } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการสร้างข้อมูลจำลอง");
    }
  };

  const fzRow = psGridData.find(r => isBoardId(r.partId)) || {};
  const wVal = Number(fzRow.width) || 0;
  const lVal = Number(fzRow.length) || 0;
  
  const areaNum = (wVal * lVal) / 1000000;
  const fzArea = areaNum.toFixed(2); 
  
  const formatQty = (num) => {
    let rounded = Math.round(num * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  };

  const getFormulaRate = (code) => {
      const found = formulaMasterData.find(f => f.code === code);
      return found ? found.rate : 0;
  };

  const hasTp45UI = (fzRow.partName || '').toLowerCase().includes('tp_45');
  
  const qtyAATC = areaNum > 0 ? formatQty(areaNum * getFormulaRate('AATC02110')) : "0";
  const tile217Auto = areaNum > 0 ? formatQty(areaNum * getFormulaRate('AAFT00010')) : "0";
  const tile104Auto = areaNum > 0 ? formatQty(areaNum * getFormulaRate('AAFT00110')) : "0";
  const tileCornerAuto = (areaNum > 0 && hasTp45UI) ? formatQty(areaNum * getFormulaRate('AAFT00210')) : "0";

  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out]">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 mt-2">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 mr-2"/> Create PS (IM Mode)
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button onClick={handleTestMode} className="text-purple-700 hover:text-purple-800 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all font-bold flex items-center justify-center flex-1 sm:flex-none">
              <Zap className="w-4 h-4 mr-1.5" /> Test ระบบ (ข้อมูลจำลอง)
            </button>
            <button onClick={handleAddRow} className="text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-1.5" /> Add Row
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:text-blue-800 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none cursor-pointer">
              <Upload className="w-4 h-4 mr-1.5" /> Import (.csv)
            </button>
            <button onClick={handleSaveData} className="text-emerald-600 hover:text-emerald-800 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none">
              <Save className="w-4 h-4 mr-1.5" /> บันทึกข้อมูล
            </button>
            <button onClick={handleClearData} className="text-red-500 hover:text-red-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none">
              <Trash2 className="w-4 h-4 mr-1.5" /> ล้างข้อมูล
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                {gridColumns.map(col => (
                    <th key={col.field} className={`px-3 py-2.5 border-r border-slate-200 ${col.width}`}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {psGridData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200 bg-yellow-50/70 hover:bg-yellow-100 transition-colors">
                  {gridColumns.map(col => (
                    <td key={col.field} className="p-0 border-r border-slate-200">
                        <input type="text" value={row[col.field] || ''} onChange={(e) => handleGridChange(idx, col.field, e.target.value)} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-800" placeholder={`-`} />
                    </td>
                  ))}
                </tr>
              ))}

              {/* === XX Section === */}
              <tr className="bg-indigo-100 text-indigo-800 font-semibold border-b border-indigo-200 uppercase tracking-wider text-xs">
                <td className="px-3 py-2.5 border-r border-indigo-200 font-bold" colSpan={4}>
                  <Calculator className="w-4 h-4 inline-block mr-1.5 mb-0.5" /> XX : สรุปสูตร
                  <span className="ml-2 font-bold text-blue-600 normal-case px-2 py-1 bg-white rounded shadow-sm border border-indigo-200">({fzArea} ตร.ม.)</span>
                </td>
                <td className="px-3 py-2.5 border-r border-indigo-200 text-left font-bold">Child</td>
                <td className="px-3 py-2.5 border-r border-indigo-200 text-right">Q'ty</td>
                <td className="px-3 py-2.5 border-r border-indigo-200 text-center">Method</td>
                <td className="px-3 py-2.5 border-r border-indigo-200 text-center">Place</td>
                <td className="px-3 py-2.5 border-r border-indigo-200 text-center">Station</td>
                <td className="px-3 py-2.5" colSpan={15}>Part name</td>
              </tr>

              <tr className="border-b border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
                <td className="p-0 border-r border-indigo-100" colSpan={4}></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="AAFT00010" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value={tile217Auto} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-blue-700 text-right font-bold"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}><input type="text" readOnly value="GT 2.40X8.68X0.32 Custalian White (Std.)" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700"/></td>
              </tr>

              <tr className="border-b border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
                <td className="p-0 border-r border-indigo-100" colSpan={4}></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="AAFT00110" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value={tile104Auto} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-blue-700 text-right font-bold"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}><input type="text" readOnly value="GT 2.40X4.16X0.32 Custalian White (Std.)" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700"/></td>
              </tr>

              <tr className={`border-b border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors ${!hasTp45UI ? 'opacity-50 bg-slate-50/50 grayscale' : ''}`}>
                <td className="p-0 border-r border-indigo-100" colSpan={4}></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="AAFT00210" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-indigo-100">
                    <input type="text" readOnly value={tileCornerAuto} className={`w-full h-full px-3 py-2.5 bg-transparent outline-none text-right font-bold ${hasTp45UI ? 'text-blue-700' : 'text-slate-400'}`}/>
                </td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}>
                    <div className="flex items-center w-full h-full px-3 py-2.5 bg-transparent text-slate-700">
                        GT 2.40X5.54X0.32 Custalian White (Corner) 
                        {!hasTp45UI && <span className="ml-2 text-[10px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-100">(ข้าม: ไม่มี tp_45 ใน Board)</span>}
                    </div>
                </td>
              </tr>

              <tr className="border-b border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100/50 transition-colors">
                <td className="p-0 border-r border-indigo-100" colSpan={4}></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="AATC02110" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value={qtyAATC} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-blue-700 text-right font-bold"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-indigo-100"><input type="text" readOnly value="Kanban => PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}><input type="text" readOnly value="Glue of ex panel WH C (Kendy White)" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700"/></td>
              </tr>
              
               <tr className="border-b border-indigo-100 bg-teal-50/40 hover:bg-teal-100/50 transition-colors">
                <td className="px-3 py-2.5 border-r border-teal-200 font-bold text-teal-700 text-right" colSpan={4}>ตัวอย่างกลุ่มสีพ่น (เช่น Variant H, J, K)</td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="AATC02130" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value={areaNum > 0 ? formatQty(areaNum * getFormulaRate('AATC02130')) : 0} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-teal-700 text-right font-bold"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="Kanban => PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}><input type="text" readOnly value="SCG PATTERN COATING" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700"/></td>
              </tr>
              <tr className="border-b border-indigo-100 bg-teal-50/40 hover:bg-teal-100/50 transition-colors">
                <td className="p-0 border-r border-teal-100" colSpan={4}></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="AATC02140" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 font-medium"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value={areaNum > 0 ? formatQty(areaNum * getFormulaRate('AATC02140')) : 0} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-teal-700 text-right font-bold"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="F" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0 border-r border-teal-100"><input type="text" readOnly value="Kanban => PF-TP" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700 text-center"/></td>
                <td className="p-0" colSpan={15}><input type="text" readOnly value="SCG SEALER2" className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-700"/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ImTab({ data }) {
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
    const headers = ["Part ID", "Method", "Place", "Station", "Part Name", "Drawing", "GL Account", "Cost Center", "Cost Structure", "Order Type", "Part Unit", "Purchase Group", "Val Class", "Thickness", "Width", "Length", "Ex Wall", "Color", "Status"];
    const rows = data.map(row => [
      row.partId, row.method, row.place, row.station, row.partName, row.drawId, row.gl, row.cc, row.cs, row.ot, row.unit, row.pg, row.vc, row.t, row.l1, row.l2, row.exw, row.color, row.status
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    copyToClipboard(tsv);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Boxes className="w-5 h-5 text-blue-600 mr-2"/> Item Master Database
        </h3>
        <div className="flex gap-2">
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
                  <td className="px-3 py-2 border-r border-slate-200 font-medium">{row.col1}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.col2}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.partId}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.method}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.place}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.station}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.partName}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.drawId}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-right">{row.gl}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.cc}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.cs}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.ot}</td>
                  <td className="px-3 py-2 border-r border-slate-200 text-center">{row.unit}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.pg}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{row.vc}</td>
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

function PsTab({ data, setData }) {
  const [newParent, setNewParent] = useState('');
  const [newChild, setNewChild] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newMethod, setNewMethod] = useState('2');
  const [newPlace, setNewPlace] = useState('F');
  const [newStation, setNewStation] = useState('PF-TP');

  const handleAddManualItem = () => {
    if (!newParent || !newChild) {
      alert('กรุณากรอก part_id_parent และ part_id_child ให้ครบถ้วน');
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
    
    setData([newItem, ...data]);
    setNewChild('');
  };

  const handleExportPs = () => {
      if(data.length === 0) return alert("ไม่มีข้อมูลให้ Export");
      const headers = ["part_id_parent", "part_id_child", "amount", "method", "place", "station"];
      const csvContent = [
          headers.join(','),
          ...data.map(row => [
              row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station
          ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
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
    const headers = ["part_id_parent", "part_id_child", "amount", "method", "place", "station"];
    const rows = data.map(row => [
      row.part_id_parent, row.part_id_child, row.amount, row.method, row.place, row.station
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    copyToClipboard(tsv);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <ListTodo className="w-5 h-5 text-indigo-600 mr-2" /> PS (Exterior-Wall) BOM Data
        </h3>
        <div className="flex gap-2">
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
                    <td className={`px-4 py-2 border-r border-slate-200 font-bold ${parentTextClass}`}>{row.part_id_parent}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{row.part_id_child}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800 font-medium">{row.amount}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{row.method}</td>
                    <td className="px-4 py-2 border-r border-slate-200 text-slate-800">{row.place}</td>
                    <td className="px-4 py-2 text-slate-800">{row.station}</td>
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