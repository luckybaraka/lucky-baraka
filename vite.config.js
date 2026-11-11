import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the same build work at a root domain or a sub-path like /portfolio
export default defineConfig({ plugins: [react()], base: './' })
