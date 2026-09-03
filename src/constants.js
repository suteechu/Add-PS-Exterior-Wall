// ==========================================
// 📂 src/constants.js
// ==========================================

export const initialPsJobsData = [];
export const initialImMasterData = [];
export const initialPsBomData = [];

export const panelVariants = [
  { code: "A", suffix: "WIC" }, { code: "B", suffix: "GIC" }, { code: "C", suffix: "GBC" },
  { code: "D", suffix: "BIC" }, { code: "E", suffix: "BBC" }, { code: "F", suffix: "EIC" },
  { code: "G", suffix: "SIC" }, { code: "Q", suffix: "WBC" }, { code: "H", suffix: "SB" },
  { code: "J", suffix: "GW" },  { code: "K", suffix: "MB" },  { code: "L", suffix: "EG" },
  { code: "M", suffix: "AG" },  { code: "N", suffix: "PU-W" }
];

export const defaultRow = {
  partId: '', method: '', place: '', station: '', partName: '', drawing: '', glAccount: '',
  costCenter: '', costStructure: '', orderType: '', partUnit: '', purchaseGroup: '',
  valClass: '', thickness: '', width: '', length: '', exWall: '', color: '', status: '',
  taperSide: '', tp1: '', tp2: '', tp3: '', tp4: ''
};

export const gridColumns = [
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

export const formulaMasterData = [
    // Frame & Structure
    { code: 'AAFE70020', group: 'Frame', label: 'Frame', rate: 1.5, station: 'PF-FP', name: 'Exterior Pipe size 32*14*1.0 L 3.187 m' },
    { code: 'AASB20710', group: 'Structure', label: 'Screw', rate: 50 / ((3221 * 891) / 1000000), station: 'Kanban => PF-FP', name: 'Drilling screw silver zinc coated Fix Board', gl: '716335', cc: '1631-11201', cs: 'Ew Panel + Stud + Ex-Roof + SB', status: 'Use', method: '2', place: 'F', unit: 'PC' },
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
    { code: 'AATC02130', group: 'AATC', label: 'AATC02130', rate: 1.05, station: 'Kanban => PF-TP', name: 'PATTERN COATING' },
    { code: 'AATC02140', group: 'AATC', label: 'AATC02140', rate: 0.11, station: 'Kanban => PF-TP', name: 'SEALER #3' },
    { code: 'AATC02150', group: 'AATC', label: 'AATC02150', rate: 0.38, station: 'Kanban => PF-TP', name: 'TOP COAT S-BEIGE' },
    { code: 'AATC02160', group: 'AATC', label: 'AATC02160', rate: 0.38, station: 'Kanban => PF-TP', name: 'TOP COAT G-WHITE' },
    { code: 'AATC02170', group: 'AATC', label: 'AATC02170', rate: 0.38, station: 'Kanban => PF-TP', name: 'TOP COAT M-BROWN' },
    { code: 'AATC02180', group: 'AATC', label: 'AATC02180', rate: 0.38, station: 'Kanban => PF-TP', name: 'TOP COAT E-GREY' },
    { code: 'AATC02340', group: 'AATC', label: 'AATC02340', rate: 0.57, station: 'Kanban => PF-TP', name: 'TOP COAT PU-WHITE' }
];
