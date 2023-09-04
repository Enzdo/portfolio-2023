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
    {
      // Ajoutez une règle de traitement spécifique pour les fichiers .glb
      name: 'glb-loader',
      enforce: 'pre', // Exécutez ce plugin avant les autres plugins
      async load(id) {
        if (id.endsWith('.glb')) {
          const content = await Deno.readFile(id); // Remplacez Deno par Node.js si vous utilisez Node.js
          return `export default new Uint8Array(${JSON.stringify([...content])})`;
        }
      },
    },
  ],

 
  build: {

    rollupOptions: {
      cssCodeSplit: true, // Active la génération du fichier CSS
      output: {
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
