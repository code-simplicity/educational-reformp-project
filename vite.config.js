import vue from '@vitejs/plugin-vue'
import {
  defineConfig
} from 'vite'
import {
  resolve
} from "path";
import { visualizer } from 'rollup-plugin-visualizer';

const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};
const alias = {
  "@": pathResolve("src"),
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias,
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
  plugins: [
    vue(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/variable.scss";' // 添加公共样式
      }
    }
  }
})