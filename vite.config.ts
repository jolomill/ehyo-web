import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ehyo-web/', // ★ 重要：這裡要換成你在 GitHub 上建立的 Repository 名稱
})