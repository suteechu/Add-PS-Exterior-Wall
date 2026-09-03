import React, { useState, useEffect } from 'react';
import { Boxes, ListTodo, FileSpreadsheet, Calculator, ClipboardCheck, BookOpen } from 'lucide-react';
import CreatePsTab from './CreatePsTab';
import { ImTab } from './ImTab';
import { PsTab } from './PsTab';
import FormulaCheckTab from './FormulaCheckTab';
import ManualTab from './ManualTab';
import AaftCalculatorModal from './AaftCalculatorModal';
import { formulaMasterData as initialFormulaData } from './constants';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './index.css';

const initialPsJobsData = [];
const initialImMasterData = [];
const initialPsBomData = [];

export default function App() {
  const [activeTab, setActiveTab] = useState('create_ps');
  const [psJobs, setPsJobs] = useState(initialPsJobsData);
  const [imMasterData, setImMasterData] = useState(initialImMasterData);
  const [psBomData, setPsBomData] = useState(initialPsBomData);
  const [psGridData, setPsGridData] = useState([{ 
    partId: '', method: '', place: '', station: '', partName: '', drawing: '', glAccount: '',
    costCenter: '', costStructure: '', orderType: '', partUnit: '', purchaseGroup: '',
    valClass: '', thickness: '', width: '', length: '', exWall: '', color: '', status: '',
    taperSide: '', tp1: '', tp2: '', tp3: '', tp4: ''
  }]);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [formulaData, setFormulaData] = useState(initialFormulaData);

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
    const savedFormula = localStorage.getItem('formula_master_data');
    if (savedFormula) {
      try {
        const parsed = JSON.parse(savedFormula);
        if (parsed && parsed.length > 0) setFormulaData(parsed);
      } catch (e) {
        console.error("Failed to load formula data", e);
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
          <button onClick={() => setActiveTab('formula')} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'formula' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <ClipboardCheck className="w-4 h-4" /> เช็คสูตรต่างๆ
          </button>
          <button onClick={() => setActiveTab('manual')} className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            <BookOpen className="w-4 h-4" /> คู่มือ
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button onClick={() => setIsCalculatorOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 shadow-sm border border-indigo-200">
            <Calculator className="w-4 h-4" /> เครื่องมือคำนวณค่า
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
              formulaData={formulaData}
            />
          )}
          {activeTab === 'im' && <ImTab data={imMasterData} setData={setImMasterData} />}
          {activeTab === 'ps' && <PsTab data={psBomData} setData={setPsBomData} />}
          {activeTab === 'formula' && <FormulaCheckTab formulaData={formulaData} setFormulaData={setFormulaData} />}
          {activeTab === 'manual' && <ManualTab />}
        </div>
      </main>

      <AaftCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} formulaData={formulaData} />
      <Toaster position="top-right" />
    </div>
  );
}