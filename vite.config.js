// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      three: 'three',
    },
  },


  server: {
    
  },


  plugins: [
    
  ],

 
  build: {

    rollupOptions: {
      output: {
        assetFileNames: 'model.glb',
        assetFileNames2: "sculpture.glb",
        entryFileNames: 'style.css',
        main: 'main.js',
      },
    },
  },
});
