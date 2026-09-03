import React, { useRef, useState, useMemo } from 'react';
import { FileSpreadsheet, Plus, Upload, Save, Trash2, Calculator, Play, Search, ChevronDown } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import { defaultRow, gridColumns, panelVariants } from './constants';
import { isBasePanelId, isFrameId, isBoardId, copyToClipboard } from './utils';

export default function CreatePsTab({ psGridData, setPsGridData, imMasterData, setImMasterData, psBomData, setPsBomData, psJobs, setPsJobs, setActiveTab, formulaData }) {
  const fileInputRef = useRef(null);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set([0]));
  const [importMode, setImportMode] = useState("replace");

  const handleRunAuto = () => {
      const dataToRun = psGridData.filter((_, idx) => selectedRowIds.has(idx));
      if (dataToRun.length === 0) {
          toast.error("กรุณาเลือกข้อมูลอย่างน้อย 1 รายการเพื่อดำเนินการ");
          return;
      }

      let newImItems = [];
      let newBomItems = [];
      const existingImIds = new Set(imMasterData.map(item => item.partId));

      dataToRun.forEach(row => {
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
          const found = formulaData.find(f => f.code === code);
          return found ? found.rate : 0;
      };

      const basePanels = dataToRun.filter(r => isBasePanelId(r.partId));
      if (basePanels.length === 0) {
          toast.error("ไม่พบรหัส Panel (AAFP, CCFP, ฯลฯ) ในไฟล์ที่เลือกเพื่อสร้าง BOM");
          return;
      }

      basePanels.forEach(fpBase => {
          const isBaseZero = fpBase.partId.endsWith('0');
          const projectCode = fpBase.partId.length >= 8 ? fpBase.partId.substring(4, 8) : '';
          let feBase = dataToRun.find(r => isFrameId(r.partId) && r.partId.includes(projectCode)) || dataToRun.find(r => isFrameId(r.partId)); 
          let fzBase = dataToRun.find(r => isBoardId(r.partId) && r.partId.includes(projectCode)) || dataToRun.find(r => isBoardId(r.partId));

          const widthNum = Number(fzBase?.width || fpBase.width || 0);
          const lengthNum = Number(fzBase?.length || fpBase.length || 0);
          const areaImpNum = ((widthNum * lengthNum) / 1000000);
          const formatQtyImp = (num) => {
              let rounded = Math.round(num * 1000) / 1000;
              return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3);
          };

          const fzPartName = fzBase?.partName || fpBase.partName || '';
          const hasTp45 = fzPartName.toLowerCase().includes('tp_45');
          const qty217Calc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00010')) : "0";
          const qty104Calc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00110')) : "0";
          const qtyCornerCalc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AAFT00210')) : "0";
          const screwQtyCalc = areaImpNum > 0 ? formatQtyImp(areaImpNum * getRate('AASB20710')) : "0";

          if (isBaseZero) {
              if (feBase) {
                  addBomItem(fpBase.partId, feBase.partId, "1", "2", "F", "PF-FP", false);
                  if (Number(screwQtyCalc) > 0) addBomItem(fpBase.partId, 'AASB20710', screwQtyCalc, "2", "F", "Kanban => PF-FP", false);
              }
              if (Number(qty217Calc) > 0) addBomItem(fpBase.partId, `AAFT00010`, qty217Calc, "2", "F", "PF-TP", false);
              if (Number(qty104Calc) > 0) addBomItem(fpBase.partId, `AAFT00110`, qty104Calc, "2", "F", "PF-TP", false);
              if (hasTp45 && Number(qtyCornerCalc) > 0) addBomItem(fpBase.partId, `AAFT00210`, qtyCornerCalc, "2", "F", "PF-TP", false);
              if (fzBase) addBomItem(fpBase.partId, fzBase.partId, "1", "2", "F", "PF-BP (Ext-wall)", false);
          }
          
          const baseId = fpBase.partId.slice(0, -1);
          const baseName = fpBase.partName.replace(/\s+WI\s*$/i, '');
          
          const variantsToProcess = isBaseZero 
              ? panelVariants 
              : panelVariants.filter(v => v.code === fpBase.partId.slice(-1).toUpperCase());

          variantsToProcess.forEach((variant) => {
              const vPartId = baseId + variant.code;
              const vPartName = isBaseZero ? (baseName + " " + variant.suffix) : fpBase.partName;
              
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

              if (feBase) {
                  addBomItem(vPartId, feBase.partId, "1", "2", "F", "PF-FP", true);
                  if (Number(screwQtyCalc) > 0) addBomItem(vPartId, 'AASB20710', screwQtyCalc, "2", "F", "Kanban => PF-FP", true);
              }
              
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
                  else if (variant.code === 'M') { thirdCoatCode = 'AATC03200'; thirdCoatRate = 0.380; } 
                  else if (variant.code === 'N') { thirdCoatCode = 'AATC02340'; thirdCoatRate = getRate('AATC02340'); }

                  if (thirdCoatCode && thirdCoatRate > 0) {
                      const qtyThird = formatQtyImp(areaImpNum * thirdCoatRate);
                      if (Number(qtyThird) > 0) addBomItem(vPartId, thirdCoatCode, qtyThird, "2", "F", "Kanban => PF-TP", true);
                  }
              }
          });
      });

      if (newImItems.length > 0) setImMasterData(prev => [...newImItems, ...prev].sort((a, b) => a.partId.localeCompare(b.partId)));
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
      toast.success(`นำเข้าข้อมูลและสร้างสูตรสำเร็จ!\n- ประมวลผลกลุ่ม Base Panel พบ: ${basePanels.length} กลุ่ม\n- สร้าง IM Master และ BOM อัตโนมัติเรียบร้อยแล้วครับ`, { duration: 5000 });
  };

  const handleGridChange = (index, field, value) => {
    const newData = [...psGridData];
    newData[index] = { ...newData[index], [field]: value };
    setPsGridData(newData);
  };

  const handleAddRow = () => {
    setPsGridData([...psGridData, { ...defaultRow }]);
    setSelectedRowIds(prev => new Set(prev).add(psGridData.length));
  };

  const handleDeleteSelectedRows = () => {
    if (selectedRowIds.size === 0) {
        toast.error("กรุณาเลือกแถวที่ต้องการลบ");
        return;
    }
    toast((t) => (
      <div>
        <p className="font-bold mb-2">คุณต้องการลบข้อมูลที่เลือกจำนวน {selectedRowIds.size} แถว ใช่หรือไม่?</p>
        <div className="flex gap-2 justify-end">
          <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs" onClick={() => {
            const newData = psGridData.filter((_, idx) => !selectedRowIds.has(idx));
            setPsGridData(newData.length > 0 ? newData : [{ ...defaultRow }]);
            setSelectedRowIds(new Set(newData.length > 0 ? [0] : [0]));
            toast.dismiss(t.id);
            toast.success("ลบข้อมูลเรียบร้อย");
          }}>ยืนยัน</button>
          <button className="bg-slate-200 px-3 py-1 rounded text-xs" onClick={() => toast.dismiss(t.id)}>ยกเลิก</button>
        </div>
      </div>
    ));
  };

  const handleSaveData = () => {
    localStorage.setItem('erp_system_data', JSON.stringify({ psGridData, imMasterData, psBomData, psJobs }));
    toast.success("บันทึกข้อมูลสำเร็จ! (ข้อมูลจะยังอยู่แม้จะปิดหรือรีเฟรชหน้าต่าง)");
  };
  const handleClearData = () => {
    toast((t) => (
      <div>
        <p className="font-bold mb-2">คุณต้องการล้างข้อมูลทั้งหมดในระบบใช่หรือไม่?</p>
        <div className="flex gap-2 justify-end">
          <button className="bg-red-500 text-white px-3 py-1 rounded text-xs" onClick={() => {
            setPsGridData([{ ...defaultRow }]); setImMasterData([]); setPsBomData([]); setPsJobs([]);
            setSelectedRowIds(new Set([0]));
            localStorage.removeItem('erp_system_data');
            toast.dismiss(t.id);
            toast.success("ล้างข้อมูลเรียบร้อย");
          }}>ยืนยัน</button>
          <button className="bg-slate-200 px-3 py-1 rounded text-xs" onClick={() => toast.dismiss(t.id)}>ยกเลิก</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.data.length === 0) {
            toast.error("ข้อผิดพลาด: ไฟล์ CSV ไม่มีข้อมูลหรือรูปแบบไม่ถูกต้อง");
            return;
        }
        const newData = [];
        let missingDims = 0;
        
        results.data.forEach((row) => {
            const getVal = (keyNames) => {
                const lowerNames = keyNames.map(k => k.toLowerCase());
                for (let k of Object.keys(row)) {
                    if (lowerNames.includes(k.trim().toLowerCase())) {
                        return row[k];
                    }
                }
                return '';
            };

            const partIdRaw = getVal(['part id', 'part_id', 'partid']) || Object.values(row)[0];
            if (!partIdRaw) return;
            const partId = String(partIdRaw).trim();

            let pName = getVal(['part name', 'part_name']) || '';
            if (partId.startsWith('DDFP') || partId.startsWith('DDFE') || partId.startsWith('DDFZ')) {
                pName = pName ? `${pName}_High Unit` : '_High Unit';
            }

            newData.push({
                partId: partId || '',
                method: getVal(['method']),
                place: getVal(['place']),
                station: getVal(['station']),
                partName: pName,
                drawing: getVal(['drawing']),
                glAccount: getVal(['gl account', 'gl_account']),
                costCenter: getVal(['cost center', 'cost_center']),
                costStructure: getVal(['cost structure', 'cost_structure']),
                orderType: getVal(['order type', 'order_type']),
                partUnit: getVal(['part unit', 'part_unit']),
                purchaseGroup: getVal(['purchase group', 'purchase_group', 'pur. group', 'pur group']),
                valClass: getVal(['val class', 'val_class']),
                thickness: getVal(['thickness']),
                width: getVal(['width']),
                length: getVal(['length']),
                exWall: getVal(['ex wall', 'ex_wall']),
                color: getVal(['color']),
                status: getVal(['status']),
                taperSide: getVal(['taper side', 'taper_side']),
                tp1: getVal(['tp1 upper', 'tp1']),
                tp2: getVal(['tp2 upper r', 'tp2']),
                tp3: getVal(['tp3']),
                tp4: getVal(['tp4 upper l', 'tp4'])
            });

            if (partId && (isBasePanelId(partId) || isBoardId(partId))) {
                const w = getVal(['width']);
                const l = getVal(['length']);
                if (!w || !l || Number(w) <= 0 || Number(l) <= 0) {
                    missingDims++;
                }
            }
        });

        if (newData.length > 0) { 
            if (importMode === 'replace') {
                setPsGridData(newData); 
                setSelectedRowIds(new Set(newData.map((_, i) => i))); 
            } else {
                const isOnlyDefault = psGridData.length === 1 && !psGridData[0].partId;
                const baseData = isOnlyDefault ? [] : psGridData;
                const combined = [...baseData, ...newData];
                setPsGridData(combined);
                
                const newIndices = newData.map((_, i) => baseData.length + i);
                const nextSet = isOnlyDefault ? new Set() : new Set(selectedRowIds);
                newIndices.forEach(idx => nextSet.add(idx));
                setSelectedRowIds(nextSet);
            }
            if (missingDims > 0) {
                toast.error(`นำเข้าสำเร็จ ${newData.length} รายการ\nแต่พบข้อมูลที่ไม่มีขนาด (กว้าง/ยาว) จำนวน ${missingDims} รายการ! กรุณาตรวจสอบข้อมูลอีกครั้ง`, { duration: 6000 });
            } else {
                toast.success(`โหลดข้อมูลสำเร็จ ${newData.length} รายการ`);
            }
        } else {
            toast.error("ไม่พบข้อมูล PART ID ที่ถูกต้องในไฟล์ CSV");
        }
      },
      error: (err) => toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: " + err.message)
    });
    e.target.value = null;
  };

  const filteredGridData = useMemo(() => {
      return psGridData.map((row, idx) => ({ ...row, _origIdx: idx })).filter(row => {
          if (!filterKeyword) return true;
          const kw = filterKeyword.toLowerCase();
          return (row.partId || '').toLowerCase().includes(kw) || (row.partName || '').toLowerCase().includes(kw);
      });
  }, [psGridData, filterKeyword]);

  const handleSelectRow = (idx) => {
      const newSet = new Set(selectedRowIds);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      setSelectedRowIds(newSet);
  };

  const handleSelectAll = (e) => {
      const newSet = new Set(selectedRowIds);
      if (e.target.checked) filteredGridData.forEach(row => newSet.add(row._origIdx));
      else filteredGridData.forEach(row => newSet.delete(row._origIdx));
      setSelectedRowIds(newSet);
  };

  const fzRow = psGridData.find(r => isBoardId(r.partId)) || {};
  const wVal = Number(fzRow.width) || 0;
  const lVal = Number(fzRow.length) || 0;
  const areaNum = (wVal * lVal) / 1000000;
  const fzArea = areaNum.toFixed(3); 
  const formatQty = (num) => {
    let rounded = Math.round(num * 1000) / 1000;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3);
  };
  const getFormulaRate = (code) => {
      const found = formulaData.find(f => f.code === code);
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
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            
            {/* Group 1: Manage Rows */}
            <div className="flex items-stretch rounded-lg shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-200 w-full sm:w-auto bg-white">
              <button onClick={handleAddRow} className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-2.5 text-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none"><Plus className="w-4 h-4 mr-1.5" /> Add Row</button>
              <button onClick={handleDeleteSelectedRows} className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 px-4 py-2.5 text-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none"><Trash2 className="w-4 h-4 mr-1.5" /> ลบแถว</button>
            </div>

            {/* Group 2: Import Actions */}
            <div className="flex items-stretch rounded-lg shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-200 w-full sm:w-auto bg-white">
              <div className="relative flex">
                <select value={importMode} onChange={(e) => setImportMode(e.target.value)} title="Replace: ล้างข้อมูลเดิม แล้วแทนที่ด้วยข้อมูลใหม่ทั้งหมด&#10;Append: นำข้อมูลใหม่ ไปต่อท้ายข้อมูลเดิมที่มีอยู่" className="text-slate-600 bg-slate-50 hover:bg-slate-100 pl-3 pr-8 py-2.5 text-sm transition-all font-semibold outline-none cursor-pointer appearance-none">
                    <option value="replace">Mode: Replace</option>
                    <option value="append">Mode: Append</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2.5 text-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none cursor-pointer"><Upload className="w-4 h-4 mr-1.5" /> Import (.csv)</button>
            </div>

            {/* Group 3: System Actions */}
            <div className="flex items-stretch rounded-lg shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-200 w-full sm:w-auto bg-white">
              <button onClick={handleSaveData} className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 text-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none"><Save className="w-4 h-4 mr-1.5" /> บันทึกข้อมูล</button>
              <button onClick={handleClearData} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 text-sm transition-all font-semibold flex items-center justify-center flex-1 sm:flex-none"><Trash2 className="w-4 h-4 mr-1.5" /> ล้างข้อมูล</button>
            </div>
          </div>
        </div>

      <div className="bg-white border-b border-slate-200 px-5 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center w-full sm:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                  type="text" 
                  placeholder="กรองข้อมูลด้วย Part ID หรือ Part Name..." 
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-80 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
          </div>
          <div className="flex gap-2">
              <button onClick={handleRunAuto} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                  <Play className="w-4 h-4" fill="currentColor" /> ยืนยันและรัน Item / PS Auto
              </button>
              <button 
                  onClick={() => {
                      if(window.confirm('คุณต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?')) {
                          setPsGridData([defaultRow]);
                          setSelectedRowIds(new Set([0]));
                          setImMasterData([]);
                          setPsBomData([]);
                          setPsJobs([]);
                          toast.success('ล้างข้อมูลเรียบร้อยแล้ว');
                      }
                  }} 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm"
              >
                  <Trash2 className="w-4 h-4" /> ล้างข้อมูล
              </button>
          </div>
      </div>

        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-2 py-2.5 border-r border-slate-200 text-center w-10 bg-slate-200/50">
                <input type="checkbox" className="w-4 h-4 cursor-pointer align-middle" checked={filteredGridData.length > 0 && filteredGridData.every(r => selectedRowIds.has(r._origIdx))} onChange={handleSelectAll} title="เลือกทั้งหมด" />
              </th>
              {gridColumns.map(col => (<th key={col.field} className={`px-3 py-2.5 border-r border-slate-200 ${col.width}`}>{col.label}</th>))}
            </tr>
            </thead>
            <tbody>
            {filteredGridData.map((row) => (
              <tr key={row._origIdx} className="border-b border-slate-200 bg-yellow-50/70 hover:bg-yellow-100 transition-colors">
                <td className="p-0 border-r border-slate-200 text-center align-middle">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer mt-2.5" checked={selectedRowIds.has(row._origIdx)} onChange={() => handleSelectRow(row._origIdx)} />
                </td>
                  {gridColumns.map(col => (
                    <td key={col.field} className="p-0 border-r border-slate-200">
                      <input type="text" value={row[col.field] || ''} onChange={(e) => handleGridChange(row._origIdx, col.field, e.target.value)} className="w-full h-full px-3 py-2.5 bg-transparent outline-none text-slate-800" placeholder={`-`} />
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}