import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    codeInspectorPlugin({
      bundler: 'vite',
      editor: 'cursor',
      // pathFormat: '{file}:{line}:{column}',
      showSwitch: true,
      showGutter: true,
      // 确保使用正确的 Cursor 命令
      command: 'cursor',
    }),
  ],
  // 这个是resolve是添加的别名
  resolve: {
    alias: [
      {
        find: '@',
        replacement: "/src",
      }
    ]
  }
})