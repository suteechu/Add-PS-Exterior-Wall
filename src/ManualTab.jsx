import React from 'react';
import { BookOpen, FileSpreadsheet, Calculator, ClipboardCheck, Play, Download } from 'lucide-react';

export default function ManualTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.3s_ease-in-out] mb-6 mt-2 w-full p-8 max-w-5xl mx-auto text-slate-800">
      <div className="border-b border-slate-200 pb-6 mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-blue-800 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          คู่มือการใช้งานระบบ Add PS Exterior Wall
        </h2>
        <p className="text-slate-500 mt-2">ระบบจัดการและคำนวณโครงสร้างข้อมูล BOM อัตโนมัติ (เวอร์ชันอัปเดตล่าสุด)</p>
      </div>

      <div className="space-y-8">
        
        {/* Section 1 */}
        <section className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-5 h-5" /> 1. การนำเข้าข้อมูล (Import CSV)
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
            <li>ไปที่แท็บ <strong>Create PS (IM Mode)</strong></li>
            <li>กดปุ่ม <strong>Import (.csv)</strong> เพื่ออัปโหลดไฟล์ข้อมูลตั้งต้นจาก Excel ที่เซฟเป็น .csv</li>
            <li><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold mr-1">อัปเกรดใหม่</span> ระบบอ่านหัวตารางอัจฉริยะ (Smart Parser) ไม่ว่าจะพิมพ์ <code>Part ID</code>, <code>PART ID</code> หรือเว้นวรรคผิด ระบบก็จะดึงข้อมูลเข้าตารางได้ถูกต้องเสมอ</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2 mb-4">
            <Play className="w-5 h-5" /> 2. การสร้าง BOM อัตโนมัติ (Run Auto)
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
            <li>ตรวจสอบข้อมูลในตารางว่าถูกต้อง และติ๊กเลือกแถวที่ต้องการดำเนินการ (ด้านซ้ายสุด)</li>
            <li>กดปุ่ม <strong>ยืนยันและรัน Item / PS Auto</strong> (ปุ่มสีน้ำเงิน)</li>
            <li><span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold mr-1">อัปเกรดใหม่</span> ไม่จำเป็นต้องอัปโหลดเฉพาะรหัสที่ลงท้ายด้วย <code>0</code> อีกต่อไป หากคุณอัปโหลด Variant มาโดยตรง (เช่น <code>...1700H</code>, <code>...1700J</code>) ระบบก็จะคำนวณและสร้าง BOM เฉพาะ Variant นั้นๆ ให้เลย</li>
            <li>ระบบจะนำค่า กว้าง x ยาว มาคำนวณพื้นที่ และคูณกับสูตรเพื่อสร้างรายการ Tile, Paint, Glue ให้แบบอัตโนมัติ</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5" /> 3. การจัดการสูตรคำนวณ (Formula Master Data)
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
            <li>ไปที่แท็บ <strong>เช็คสูตรต่างๆ</strong></li>
            <li>กดปุ่ม <strong>แก้ไขข้อมูล</strong> เพื่อเปลี่ยนค่า Rate (ต่อ 1 ตร.ม.) ของแต่ละวัตถุดิบ</li>
            <li>เมื่อแก้เสร็จแล้วกด <strong>บันทึก</strong></li>
            <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold mr-1">อัปเกรดใหม่</span> ค่าสูตรใหม่ที่คุณตั้งไว้ จะถูกนำไปใช้ในการคำนวณ <code>Run Auto</code> และใน <code>เครื่องมือคำนวณค่า</code> ทันที โดยไม่ต้องรีเฟรชหน้าจอ</li>
            <li>คอลัมน์ Rate จะแสดงผลตัวเลข 2 ตำแหน่งเป็นอย่างน้อยเสมอ เพื่อความเป็นระเบียบ (เช่น <code>1.50</code>)</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
          <h3 className="text-xl font-bold text-orange-800 flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5" /> 4. เครื่องมือคำนวณค่า (Calculator)
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
            <li>สามารถกดเปิด <strong>เครื่องมือคำนวณค่า</strong> ได้จากไอคอนเครื่องคิดเลขที่มุมขวาบนของหน้าจอ</li>
            <li>ใช้สำหรับจำลองการคำนวณ BOM อย่างรวดเร็ว เพียงแค่กรอกขนาด กว้าง x ยาว หรือพื้นที่ (ตร.ม.)</li>
            <li>กดปุ่ม <strong>Copy Table</strong> เพื่อคัดลอกผลลัพธ์</li>
            <li><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold mr-1">อัปเกรดใหม่</span> ข้อมูลที่คัดลอก จะมีเฉพาะ "ข้อมูลล้วนๆ (Data Rows)" โดยตัดหัวตารางออกให้เรียบร้อย สามารถนำไป Paste ลงใน Excel ได้ต่อกันพอดีเป๊ะ</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Download className="w-5 h-5" /> 5. การดูผลลัพธ์และนำไปใช้งาน (Export / Copy)
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
            <li>เมื่อรัน Auto เสร็จแล้ว ผลลัพธ์จะถูกส่งไปที่แท็บ <strong>Item Auto</strong> (สำหรับ IM) และ <strong>PS Auto</strong> (สำหรับ PS)</li>
            <li>ในหน้า PS Auto หากต้องการเพิ่มรายการ BOM ด้วยมือเพิ่มเติม สามารถกรอก Parent/Child แล้วกด <strong>+ Add Row</strong> ได้เลย</li>
            <li>ทั้ง 2 หน้าจะมีปุ่ม <strong>Copy</strong> และ <strong>Export CSV</strong> ให้ใช้งาน</li>
            <li><span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-bold mr-1">อัปเกรดใหม่</span> การแจ้งเตือน (Alert) ทุกอย่างถูกเปลี่ยนเป็น Pop-up สวยงามมุมขวาบน ทำให้ไม่ขัดจังหวะการทำงาน</li>
          </ul>
        </section>

      </div>

      <div className="mt-10 text-center border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-500 font-medium">
          ระบบได้รับการออกแบบและพัฒนาให้มีความยืดหยุ่นสูง เพื่อลดข้อผิดพลาดจากการนำเข้าข้อมูล และเพิ่มความรวดเร็วในการทำงาน
        </p>
      </div>
    </div>
  );
}
