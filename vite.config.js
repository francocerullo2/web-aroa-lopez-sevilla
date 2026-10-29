import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Un único CSS enlazado en el HTML: las páginas prerenderizadas
    // se ven con estilos desde el primer momento, aunque su JS se
    // cargue por separado.
    cssCodeSplit: false,
  },
})
