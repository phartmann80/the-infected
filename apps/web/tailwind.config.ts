import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { infected: { black: '#030405', ember: '#ff4a1c', blood: '#7f1111', fog: '#9ca3af' } }, boxShadow: { ember: '0 0 80px rgba(255, 74, 28, 0.25)' } } }, plugins: [] };
export default config;
