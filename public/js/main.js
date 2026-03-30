window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#030813",
                "primary-container": "#1A202C",
                surface: "#F7FAFC",
                "academic-slate": "#2D3748",
                "outline-variant": "rgba(198, 198, 204, 0.15)",
            },
            fontFamily: {
                serif: ["Noto Serif", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            boxShadow: {
                'editorial': '0 40px 60px -15px rgba(3, 8, 19, 0.08)',
                'editorial-hover': '0 50px 70px -20px rgba(3, 8, 19, 0.12)',
            },
            transitionTimingFunction: {
                'lux': 'cubic-bezier(0.16, 1, 0.3, 1)',
            }
        },
    },
};