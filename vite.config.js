import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, 'src') }
    ]
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/scss/_variables.scss" as *;
          @use "@/assets/scss/_media.scss" as *;
        `
      }
    }
  }
})
