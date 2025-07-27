import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 12000,
    allowedHosts: [
      'work-1-vavlhfnslleqocbd.prod-runtime.all-hands.dev',
      'work-2-vavlhfnslleqocbd.prod-runtime.all-hands.dev',
      'localhost'
    ],
    cors: true
  }
});