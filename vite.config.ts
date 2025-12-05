import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables (like API_KEY) from the environment
  // The third argument '' loads all variables, not just those starting with VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This allows 'process.env.API_KEY' to work in the browser code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});