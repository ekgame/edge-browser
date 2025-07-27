import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    monacoEditorPlugin.default({}),
  ],
  build: {
    outDir: 'dist_web',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  base: '/edge/'
});