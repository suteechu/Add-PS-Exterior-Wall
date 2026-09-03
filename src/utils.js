// ==========================================
// 📂 src/utils.js
// ==========================================

import { toast } from 'react-hot-toast';

export const copyToClipboard = (text) => {
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
    console.error("Copy failed", err);
    toast.error("ไม่สามารถคัดลอกข้อมูลได้");
  }
  document.body.removeChild(textArea);
};

export const isBasePanelId = (partId) => partId && (partId.startsWith('AAFP') || partId.startsWith('CCFP') || partId.startsWith('BBFP') || partId.startsWith('DDFP'));
export const isFrameId = (partId) => partId && (partId.startsWith('AAFE') || partId.startsWith('CCFE') || partId.startsWith('BBFE') || partId.startsWith('DDFE'));
export const isBoardId = (partId) => partId && (partId.startsWith('AAFZ') || partId.startsWith('CCFZ') || partId.startsWith('BBFZ') || partId.startsWith('DDFZ'));

export const exportToCsv = (filename, rows) => {
    // Add BOM for Excel UTF-8 support
    const bom = "\uFEFF";
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
