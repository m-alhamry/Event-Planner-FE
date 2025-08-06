import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Enables new JSX transform by default
  server: {
    host: '0.0.0.0', // Bind to all network interfaces (as per previous advice)
    port: 5173,      // Ensure this matches Render's expected port
    allowedHosts: [
      'event-planner-fe.onrender.com', // Add your Render host
      'localhost',                     // Optional: for local development
    ],
  },
  // Other config options
});
