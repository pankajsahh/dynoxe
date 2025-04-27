import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  esbuild: {
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  plugins: [react({
    // enable JSX in .js files
    babel: {
      plugins: ['@babel/plugin-transform-react-jsx'],
    },
    include: '**/*.js', // treat all .js files as potential JSX
  }),
    createHtmlPlugin({
      entry: 'src/index.js',
      template: 'index.html',
      })
      
    ]
})
