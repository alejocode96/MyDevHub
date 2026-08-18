import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El sitio se publica en GitHub Pages como "project page" en
// https://alejocode96.github.io/MyDevHub/ — todos los assets deben
// resolverse bajo ese subpath en producción, no en la raíz del dominio.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/MyDevHub/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))