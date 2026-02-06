/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b'
                },
                gray: {
                    750: '#2d3748',
                    850: '#1a202c',
                    900: '#111827'
                }
            }
        }
    },
    plugins: [],
}
