export const copyToClipboard = async (text, removeHeader = false) => {
  let textToCopy = text;

  // หากระบุ removeHeader เป็น true จะทำการตัดข้อความบรรทัดแรกสุด (หัวข้อ) ออก
  if (removeHeader && typeof text === 'string') {
    textToCopy = text.substring(text.indexOf('\n') + 1);
  }

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Failed to copy', err);
      alert("ไม่สามารถคัดลอกข้อมูลได้");
    }
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
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
  }
};

export const isBasePanelId = (partId) => partId && /^(AA|BB|CC|DD)FP/.test(partId);
export const isFrameId = (partId) => partId && /^(AA|BB|CC|DD)FE/.test(partId);
export const isBoardId = (partId) => partId && /^(AA|BB|CC|DD)FZ/.test(partId);