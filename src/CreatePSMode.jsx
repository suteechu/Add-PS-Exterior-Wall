import React, { useState, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function CreatePSMode() {
  // 1. State สำหรับเก็บข้อมูลทั้งหมดที่ Import เข้ามา
  const [importedData, setImportedData] = useState([]);

  // 2. State สำหรับคำค้นหา (Filter) และการเลือกข้อมูล (Checkbox)
  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const fileInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" หรือ "error"

  // ฟังก์ชันแสดงแจ้งเตือน
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // ฟังก์ชันจัดการเมื่อนำเข้าข้อมูลสำเร็จ
  const handleImportSuccess = (parsedData) => {
    setImportedData(parsedData);
    
    // ตั้งค่า Default ให้เลือกข้อมูลทั้งหมดไว้ก่อนเมื่อนำเข้าสำเร็จ
    setSelectedRowIds(parsedData.map(item => item.id));

    showToast("อัปโหลดไฟล์ CSV สำเร็จ!", "success");
  };

  // กรองข้อมูลตาม Keyword ที่พิมพ์ค้นหา
  const filteredData = useMemo(() => {
    if (!filterKeyword) return importedData;
    return importedData.filter(item => 
      item.partName?.toLowerCase().includes(filterKeyword.toLowerCase())
    );
  }, [importedData, filterKeyword]);

  // จัดการเมื่อคลิก Checkbox ของแต่ละแถว
  const handleSelectRow = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // ฟังก์ชันสำหรับการอัปโหลดไฟล์และอ่านด้วย PapaParse
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // ให้แถวแรกสุดของ CSV เป็น Key ของ Object
      skipEmptyLines: true,
      complete: (results) => {
        // Map ข้อมูลให้เข้ากับ Format (สามารถปรับแก้ชื่อฟิลด์ตามหัวคอลัมน์ของไฟล์คุณได้เลย)
        const mappedData = results.data.map((row, index) => ({
          id: row.id || index + 1, // ถ้า CSV ไม่มี id จะสร้าง index จำลองขึ้นมาให้
          partName: row.partName || row['Part Name'] || Object.values(row)[0] || '',
          description: row.description || row['Description'] || Object.values(row)[1] || '',
        }));
        handleImportSuccess(mappedData);
      },
      error: (err) => showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: " + err.message, "error")
    });
    e.target.value = null; // รีเซ็ตค่า Input เพื่อให้อัปโหลดไฟล์เดิมซ้ำได้
  };

  // 3. ฟังก์ชันสำหรับกดปุ่ม "ยืนยันและรัน Auto"
  const handleConfirmAndRun = () => {
    // คัดกรองเฉพาะข้อมูลที่แสดงอยู่ (ผ่านการ Filter แล้ว) และถูกคลิก Checkbox ด้วย
    const dataToRun = filteredData.filter(item => selectedRowIds.includes(item.id));

    if (dataToRun.length === 0) {
      alert("กรุณาเลือกข้อมูลอย่างน้อย 1 รายการเพื่อดำเนินการ");
      return;
    }

    console.log("กำลังนำข้อมูลไปรัน PS Auto:", dataToRun);
    
    // TODO: เรียกใช้ฟังก์ชัน runItemAuto / runPSAuto ของคุณตรงนี้ โดยส่ง dataToRun ไปทำงานต่อ
    // runItemAuto(dataToRun);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* แสดง Toast Notification (ลอยอยู่มุมขวาบน) */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-[fadeIn_0.3s_ease-in-out] ${toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toastType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create PS (IM Mode)</h2>
      
      {/* Input File (ซ่อนไว้) และปุ่มกด Import */}
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="mb-6 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
      >
        1. Import CSV
      </button>

      {/* แสดงส่วนของตารางหากมีการนำเข้าข้อมูลแล้ว */}
      {importedData.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          
          <div className="mb-4 flex items-center">
            <label className="mr-3 font-semibold text-gray-700">ค้นหาข้อมูล:</label>
            <input 
              type="text" 
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="ค้นหาจาก Part Name..."
              className="border border-gray-300 px-3 py-1.5 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 w-20 text-center font-semibold text-gray-700">เลือก</th>
                  <th className="p-3 font-semibold text-gray-700">Part Name</th>
                  <th className="p-3 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRowIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="w-4 h-4 text-blue-600 cursor-pointer rounded"
                      />
                    </td>
                    <td className="p-3 text-gray-800">{item.partName}</td>
                    <td className="p-3 text-gray-600">{item.description}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ปุ่มกดยืนยัน */}
          <button 
            onClick={handleConfirmAndRun}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
          >
            ยืนยันและรัน Item / PS Auto
          </button>
        </div>
      )}
    </div>
  );
}