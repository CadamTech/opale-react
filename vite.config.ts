import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'OpaleReact',
      formats: ['es', 'cjs'],  // Explicitly define formats
      fileName: (format) => `opale-react.${format}.js`
    },
    // sourcemap: 'inline',
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'React-dom',
          'react/jsx-runtime': 'react/jsx-runtime',
        }
      },

    }
  },
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    dts({
      tsconfigPath: 'tsconfig.app.json'
    })
  ],
})