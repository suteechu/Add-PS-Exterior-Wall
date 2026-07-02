import React, { useState } from 'react';
import './App.css';

function App() {
  // สร้าง State สำหรับเก็บสถานะของสวิตช์ Auto ทั้ง 2 ตัว
  const [isItemAuto, setIsItemAuto] = useState(false);
  const [isPSAuto, setIsPSAuto] = useState(false);

  // ฟังก์ชันเมื่อกดปุ่ม Create PS
  const handleCreatePS = () => {
    alert("ดำเนินการ: กำลังสร้าง PS (IM Mode)...");
    console.log(">> Execute: Create PS in IM Mode");
    console.log(`>> Current Status -> Item Auto: ${isItemAuto}, PS Auto: ${isPSAuto}`);
  };

  // ฟังก์ชันจัดการเมื่อเปิด/ปิด Item Auto
  const handleItemAutoChange = (e) => {
    const checked = e.target.checked;
    setIsItemAuto(checked);
    if (checked) {
      setIsPSAuto(false); // ถ้าเปิด Item Auto ให้บังคับปิด PS Auto
    }
  };

  // ฟังก์ชันจัดการเมื่อเปิด/ปิด PS Auto
  const handlePSAutoChange = (e) => {
    const checked = e.target.checked;
    setIsPSAuto(checked);
    if (checked) {
      setIsItemAuto(false); // ถ้าเปิด PS Auto ให้บังคับปิด Item Auto
    }
  };

  return (
    <div className="app-container">
      <div className="control-bar">
        {/* ส่วนปุ่มทำงานหลัก */}
        <div className="action-group">
          <button onClick={handleCreatePS} className="btn primary-btn">
            + Create PS (IM Mode)
          </button>
        </div>

        {/* ส่วนเงื่อนไขระบบ Auto */}
        <div className="condition-group">
          <label className="toggle-switch">
            <input type="checkbox" checked={isItemAuto} onChange={handleItemAutoChange} />
            <span className="slider"></span>
            <span className="label-text">Item Auto</span>
          </label>

          <label className="toggle-switch">
            <input type="checkbox" checked={isPSAuto} onChange={handlePSAutoChange} />
            <span className="slider"></span>
            <span className="label-text">PS Auto</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;