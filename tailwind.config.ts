import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--primary-500)",
                    50: "var(--primary-50)",
                    100: "var(--primary-100)",
                    200: "var(--primary-200)",
                    300: "var(--primary-300)",
                    400: "var(--primary-400)",
                    500: "var(--primary-500)",
                    600: "var(--primary-600)",
                    700: "var(--primary-700)",
                    800: "var(--primary-800)",
                    900: "var(--primary-900)"
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'pulse-slow': 'pulse 4s ease-in-out infinite',
//         'rotate-slow': 'rotate 20s linear infinite',
//         'float': 'float 15s ease-in-out infinite',
//         'dash': 'dash 8s linear infinite',
//         'wave': 'wave 8s ease-in-out infinite',
//         'moveParticle': 'moveParticle 10s linear infinite',
//       },
//       keyframes: {
//         pulse: {
//           '0%, 100%': { opacity: '0.3' },
//           '50%': { opacity: '0.7' },
//         },
//         rotate: {
//           '0%': { transform: 'rotate(0deg)' },
//           '100%': { transform: 'rotate(360deg)' },
//         },
//         float: {
//           '0%, 100%': { transform: 'translateY(0) translateX(0)' },
//           '25%': { transform: 'translateY(-20px) translateX(10px)' },
//           '50%': { transform: 'translateY(0) translateX(20px)' },
//           '75%': { transform: 'translateY(20px) translateX(10px)' },
//         },
//         dash: {
//           '100%': { strokeDashoffset: '1000' },
//         },
//         wave: {
//           '0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
//           '50%': { transform: 'scaleY(1.05) scaleX(1.05)' },
//         },
//         moveParticle: {
//           '0%': { transform: 'translate(0, 0)', opacity: '0' },
//           '10%': { opacity: '0.5' },
//           '90%': { opacity: '0.5' },
//           '100%': { transform: 'translate(var(--tx), var(--ty))', opacity: '0' },
//         },
//       },
//     },
//   },
//   plugins: [],
// }

export default config;
