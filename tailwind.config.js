/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // <--- บรรทัดนี้สำคัญมาก! ถ้าไม่มี สีจะไม่ขึ้นเลยครับ
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }