import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Ensure this matches your expected port
  },
  // Other config options
});
