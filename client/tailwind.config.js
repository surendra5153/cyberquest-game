/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cyber theme colors
                cyber: {
                    dark: '#0a0a0f',
                    darker: '#050508',
                    primary: '#00f5ff',
                    secondary: '#8b5cf6',
                    accent: '#f59e0b',
                    success: '#10b981',
                    danger: '#ef4444',
                    warning: '#f59e0b',
                }
            },
            fontFamily: {
                cyber: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'glitch': 'glitch 0.3s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.6)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glitch': {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
            },
            backgroundImage: {
                'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
                'glow-gradient': 'linear-gradient(135deg, #00f5ff 0%, #8b5cf6 100%)',
            }
        },
    },
    plugins: [],
}
