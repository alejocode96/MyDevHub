import { useState, useEffect, useRef, useCallback } from "react";

const SLIDE_MS = 650;
const DWELL_MS = 1200;
const FADE_MS = 350;
const MOVE_DUR = 500;
const ARM_LEN = 240;
const DOT_LEN = 42;
const DOT_DUR = 3200;
const DOT_START = ARM_LEN + DOT_LEN;
const DOT_END = -(ARM_LEN + DOT_LEN);
const DOT_GAP = ARM_LEN * 2 + DOT_LEN * 2 + 10;

const POSITIONS = [
    { x: "-1.5rem", y: "0rem" },
    { x: "5rem", y: "0rem" },
    { x: "10rem", y: "0rem" },
    { x: "13rem", y: "3rem" },
    { x: "13rem", y: "10rem" },
    { x: "13rem", y: "13rem" },
];
const POS_OPACITY = [0.55, 0.75, 0.75, 0.75, 0.75, 0.75];
const OFF = { x: "16rem", y: "17rem" };

const V_FULL = "M49 192V96.266a8 8 0 0 0-2.285-5.599L3.285 46.333A8 8 0 0 1 1 40.734V-28M49 93l45.715-46.667A8 8 0 0 0 97 40.734V-23";
const V_LEFT_ARM = "M1 -28V40.734L3.285 46.333A8 8 0 0 0 5.285 48.932L49 93V192";
const V_RIGHT_ARM = "M97 -23V40.734L94.715 46.667A8 8 0 0 1 92.715 49.266L49 93V192";

// ─────────────────────────────────────────────────────────────────────────────
// POOLS DE ÍCONOS — cada lado tiene su propio conjunto, sin solapamiento.
// Slots 0-7 izquierdo → íconos reales 0-3 (ciclando)
// Slots 0-7 derecho   → íconos reales 4-7 (ciclando)
// Con 8 slots y 4 íconos únicos por lado, la rotación nunca repite key.
// ─────────────────────────────────────────────────────────────────────────────
const LEFT_ICON_MAP = [0, 1, 2, 3, 0, 1, 2, 3]; // slot → ícono real (izq)
const RIGHT_ICON_MAP = [4, 5, 6, 7, 4, 5, 6, 7]; // slot → ícono real (der)

function getTheme(dark) {
    return dark ? {
        // Padre zinc-800 (#27272a) — burbujas un paso más claras, card un paso más clara
        iconBg: "#3f3f46",               // zinc-700 — un paso más claro que el padre
        iconFrom: "rgba(255,255,255,0.06)",
        ring1: "rgba(255,255,255,0.10)",
        ringAccent: "rgba(255,255,255,0.06)",
        connStroke: "rgba(255,255,255,0.12)",
        cardBg: "#52525b",               // zinc-600 — dos pasos más claro que el padre
        cardShadow: "rgba(255,255,255,0.05) 0px 1px 1px inset, rgba(0,0,0,0.35) 0px 4px 16px, rgba(0,0,0,0.20) 0px 1px 3px, rgba(82,82,91,0.80) 0px 0px 0px 2px",
        glowColor: "rgba(255,255,255,0.08)",
        fill: "#d4d4d8",                 // zinc-300 — íconos SVG claros sobre burbuja zinc-700
        eyeBase: "#e4e4e7",              // zinc-200 — "IA" visible sobre card zinc-600
    } : {
        // Padre gray-100 (#f4f4f5) — burbujas un paso más oscuras, card dos pasos más oscura
        iconBg: "#d4d4d8",               // zinc-300 — un paso más oscuro que el padre
        iconFrom: "rgba(255,255,255,0.50)",
        ring1: "rgba(0,0,0,0.08)",
        ringAccent: "rgba(0,0,0,0.04)",
        connStroke: "rgba(0,0,0,0.12)",
        cardBg: "#a1a1aa",               // zinc-400 — dos pasos más oscuro que el padre
        cardShadow: "rgba(0,0,0,0.08) 0px 1px 1px inset, rgba(0,0,0,0.15) 0px 4px 16px, rgba(0,0,0,0.10) 0px 1px 3px, rgba(161,161,170,0.70) 0px 0px 0px 2px",
        glowColor: "rgba(0,0,0,0.06)",
        fill: "#52525b",                 // zinc-600 — íconos SVG oscuros sobre burbuja zinc-300
        eyeBase: "#dadadc",              // zinc-900 — "IA" muy visible sobre card zinc-400
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI_ICONS — 8 SVGs reales de proveedores/herramientas de IA
// Índices: 0=OpenAI  1=Claude  2=Gemini  3=Cursor
//          4=Windsurf  5=Copilot  6=Supermaven  7=Banana
// ─────────────────────────────────────────────────────────────────────────────
const AI_ICONS = [
    // 0 — OpenAI
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 260"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <path fill="currentColor" d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
        </svg>
    ),
    // 1 — Claude
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 257"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
        </svg>
    ),
    // 2 — Gemini
    (_c) => (
        <svg viewBox="0 0 296 298" xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <mask id="gm-a" width="296" height="298" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="#3186FF" d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
            </mask>
            <g mask="url(#gm-a)">
                <ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159" />
                <ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5" />
                <path fill="#FA4340" d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z" />
                <path fill="#14BB69" d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z" />
            </g>
        </svg>
    ),
    // 3 — Cursor
    (_c) => (
        <svg viewBox="0 0 121 122" xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <mask id="cur-b" width="121" height="122" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="url(#cur-a)" fillRule="evenodd" d="M36.069 0c19.92 0 36.068 16.155 36.068 36.084v13.713h12.004c19.92 0 36.069 16.156 36.069 36.084 0 19.928-16.149 36.083-36.069 36.083H0v-85.88C0 16.155 16.148 0 36.069 0Z" clipRule="evenodd" />
            </mask>
            <g mask="url(#cur-b)">
                <ellipse cx="52.738" cy="65.101" fill="#4B73FF" rx="81.373" ry="81.192" />
                <ellipse cx="61.673" cy="20.547" fill="#FF66F4" rx="104.216" ry="81.192" />
                <ellipse cx="78.666" cy="5.268" fill="#FF0105" rx="81.373" ry="71.304" />
                <ellipse cx="63.121" cy="20.527" fill="#FE7B02" rx="48.937" ry="48.829" />
            </g>
            <defs>
                <linearGradient id="cur-a" x1="40.453" x2="76.933" y1="21.433" y2="121.971" gradientUnits="userSpaceOnUse">
                    <stop offset=".025" stopColor="#FF8E63" />
                    <stop offset=".56" stopColor="#FF7EB0" />
                    <stop offset=".95" stopColor="#4B73FF" />
                </linearGradient>
            </defs>
        </svg>
    ),
    // 4 — Windsurf
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <rect width="1024" height="1024" rx="200" fill="#1a1a2e" />
            <path d="M395.479 633.828L735.91 381.105C752.599 368.715 776.454 373.548 784.406 392.792C826.26 494.285 807.561 616.253 724.288 699.996C641.016 783.739 525.151 802.104 419.247 760.277L303.556 814.143C469.49 928.202 670.987 899.995 796.901 773.282C896.776 672.843 927.708 535.937 898.785 412.476L899.047 412.739C857.105 231.37 909.358 158.874 1016.4 10.6326C1018.93 7.11771 1021.47 3.60279 1024 0L883.144 141.651V141.212L395.392 633.916" fill="white" />
            <path d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668C403.431 226.097 526.549 195.254 634.026 240.596L749.454 186.994C728.657 171.88 702.007 155.623 671.424 144.2C533.19 86.9942 367.693 115.465 255.323 228.382C147.234 337.081 113.244 504.215 171.613 646.833C215.216 753.423 143.739 828.818 71.7385 904.916C46.2237 931.893 20.6216 958.87 0 987.429L325.139 695.339" fill="white" />
        </svg>
    ),
    // 5 — Microsoft Copilot
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 4 43.998 40"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <path fill="url(#cop-a)" d="M34.142 7.325A4.63 4.63 0 0 0 29.7 4h-1.35a4.63 4.63 0 0 0-4.554 3.794L21.48 20.407l.575-1.965a4.63 4.63 0 0 1 4.444-3.33h7.853l3.294 1.282 3.175-1.283h-.926a4.63 4.63 0 0 1-4.443-3.325l-1.31-4.461z" />
            <path fill="url(#cop-b)" d="M14.33 40.656A4.63 4.63 0 0 0 18.779 44h2.87a4.63 4.63 0 0 0 4.629-4.51l.312-12.163-.654 2.233a4.63 4.63 0 0 1-4.443 3.329h-7.919l-2.823-1.532-3.057 1.532h.912a4.63 4.63 0 0 1 4.447 3.344l1.279 4.423z" />
            <path fill="url(#cop-c)" d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 0 0 4.456-3.358 2078.617 2078.617 0 0 1 4.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4z" />
            <path fill="url(#cop-d)" d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 0 0 4.456-3.358 2078.617 2078.617 0 0 1 4.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4z" />
            <path fill="url(#cop-e)" d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 0 0-4.455 3.358 2084.036 2084.036 0 0 1-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566z" />
            <path fill="url(#cop-f)" d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 0 0-4.455 3.358 2084.036 2084.036 0 0 1-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566z" />
            <defs>
                <radialGradient id="cop-a" cx="0" cy="0" r="1" gradientTransform="matrix(-10.96051 -13.38922 12.59013 -10.30637 38.005 20.514)" gradientUnits="userSpaceOnUse">
                    <stop offset=".096" stopColor="#00AEFF" /><stop offset=".773" stopColor="#2253CE" /><stop offset="1" stopColor="#0736C4" />
                </radialGradient>
                <radialGradient id="cop-b" cx="0" cy="0" r="1" gradientTransform="rotate(51.84 -28.201 27.85) scale(15.9912 15.5119)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFB657" /><stop offset=".634" stopColor="#FF5F3D" /><stop offset=".923" stopColor="#C02B3C" />
                </radialGradient>
                <radialGradient id="cop-e" cx="0" cy="0" r="1" gradientTransform="rotate(109.274 16.301 20.802) scale(38.3873 45.9867)" gradientUnits="userSpaceOnUse">
                    <stop offset=".066" stopColor="#8C48FF" /><stop offset=".5" stopColor="#F2598A" /><stop offset=".896" stopColor="#FFB152" />
                </radialGradient>
                <linearGradient id="cop-c" x1="12.5" x2="14.788" y1="7.5" y2="33.975" gradientUnits="userSpaceOnUse">
                    <stop offset=".156" stopColor="#0D91E1" /><stop offset=".487" stopColor="#52B471" /><stop offset=".652" stopColor="#98BD42" /><stop offset=".937" stopColor="#FFC800" />
                </linearGradient>
                <linearGradient id="cop-d" x1="14.5" x2="15.75" y1="4" y2="32.885" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3DCBFF" /><stop offset=".247" stopColor="#0588F7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cop-f" x1="42.586" x2="42.569" y1="13.346" y2="21.215" gradientUnits="userSpaceOnUse">
                    <stop offset=".058" stopColor="#F8ADFA" /><stop offset=".708" stopColor="#A86EDD" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    ),
    // 6 — Supermaven
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 233"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <path d="M186.18182 0h46.54545v46.54545h-46.54545z" />
            <path fill="#F7D046" d="M209.45454 0h46.54545v46.54545h-46.54545z" />
            <path d="M0 0h46.54545v46.54545H0zM0 46.54545h46.54545V93.0909H0zM0 93.09091h46.54545v46.54545H0zM0 139.63636h46.54545v46.54545H0zM0 186.18182h46.54545v46.54545H0z" />
            <path fill="#F7D046" d="M23.27273 0h46.54545v46.54545H23.27273z" />
            <path fill="#F2A73B" d="M209.45454 46.54545h46.54545V93.0909h-46.54545zM23.27273 46.54545h46.54545V93.0909H23.27273z" />
            <path d="M139.63636 46.54545h46.54545V93.0909h-46.54545z" />
            <path fill="#F2A73B" d="M162.90909 46.54545h46.54545V93.0909h-46.54545zM69.81818 46.54545h46.54545V93.0909H69.81818z" />
            <path fill="#EE792F" d="M116.36364 93.09091h46.54545v46.54545h-46.54545zM162.90909 93.09091h46.54545v46.54545h-46.54545zM69.81818 93.09091h46.54545v46.54545H69.81818z" />
            <path d="M93.09091 139.63636h46.54545v46.54545H93.09091z" />
            <path fill="#EB5829" d="M116.36364 139.63636h46.54545v46.54545h-46.54545z" />
            <path fill="#EE792F" d="M209.45454 93.09091h46.54545v46.54545h-46.54545zM23.27273 93.09091h46.54545v46.54545H23.27273z" />
            <path d="M186.18182 139.63636h46.54545v46.54545h-46.54545z" />
            <path fill="#EB5829" d="M209.45454 139.63636h46.54545v46.54545h-46.54545z" />
            <path d="M186.18182 186.18182h46.54545v46.54545h-46.54545z" />
            <path fill="#EB5829" d="M23.27273 139.63636h46.54545v46.54545H23.27273z" />
            <path fill="#EA3326" d="M209.45454 186.18182h46.54545v46.54545h-46.54545zM23.27273 186.18182h46.54545v46.54545H23.27273z" />
        </svg>
    ),
    // 7 — Banana
    (_c) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            style={{ width: "1.3rem", height: "1.3rem", flexShrink: 0 }}>
            <path d="M1.5 19.824c0-.548.444-.992.991-.992h.744a.991.991 0 010 1.983H2.49a.991.991 0 01-.991-.991z" fill="#F3AD61" />
            <path d="M14.837 13.5h7.076c.522 0 .784-.657.413-1.044l-1.634-1.704a3.183 3.183 0 00-4.636 0l-1.633 1.704c-.37.385-.107 1.044.414 1.044zM3.587 13.5h7.076c.521 0 .784-.659.414-1.044l-1.635-1.704a3.183 3.183 0 00-4.636 0l-1.633 1.704c-.37.385-.107 1.044.414 1.044z" fill="#F9C23C" />
            <path d="M12.525 1.521c3.69-.53 5.97 8.923 4.309 12.744-1.662 3.82-5.248 4.657-9.053 6.152a3.49 3.49 0 01-1.279.244c-1.443 0-2.227 1.187-2.774-.282-.707-1.9.22-4.031 2.069-4.757 2.014-.79 3.084-2.308 3.89-4.364.82-2.096.877-2.956.873-5.241-.003-1.827-.123-4.195 1.965-4.496z" fill="#FEEFC2" />
            <path d="M16.834 14.264l-7.095-3.257c-.815 1.873-2.29 3.308-4.156 4.043-2.16.848-3.605 3.171-2.422 5.54 2.364 4.727 13.673-.05 13.673-6.325z" fill="#FCD53F" />
            <path clipRule="evenodd" d="M13.68 12.362c.296.094.46.41.365.707-1.486 4.65-5.818 6.798-9.689 6.997a.562.562 0 11-.057-1.124c3.553-.182 7.372-2.138 8.674-6.216a.562.562 0 01.707-.364z" fill="#F9C23C" fillRule="evenodd" />
            <path d="M17.43 19.85l-7.648-8.835h6.753c1.595.08 2.846 1.433 2.846 3.073v5.664c0 .997-.898 1.302-1.95.098z" fill="#FFF478" />
        </svg>
    ),
];

function VConnector({ leftActive, rightActive, leftKey, rightKey, connStroke, dark }) {
    const lDot1 = useRef(null), lDot2 = useRef(null);
    const rDot1 = useRef(null), rDot2 = useRef(null);
    const lTm = useRef(null), rTm = useRef(null);
    const dotColor = dark ? "#93c5fd" : "#2563eb";

    function animateDot(d1, d2, tm) {
        clearTimeout(tm.current);
        if (!d1 || !d2) return;
        [d1, d2].forEach(d => {
            d.style.transition = "none";
            d.style.strokeDashoffset = `${DOT_START}`;
            d.style.opacity = "0";
        });
        void d1.getBoundingClientRect();
        d1.style.opacity = "1";
        d2.style.opacity = "0.35";
        const tr = `stroke-dashoffset ${DOT_DUR}ms cubic-bezier(0.4,0,0.6,1)`;
        d1.style.transition = tr;
        d2.style.transition = tr;
        d1.style.strokeDashoffset = `${DOT_END}`;
        d2.style.strokeDashoffset = `${DOT_END}`;
        tm.current = setTimeout(() => {
            if (d1) {
                d1.style.transition = "none";
                d2.style.transition = "none";
                d1.style.opacity = "0";
                d2.style.opacity = "0";
            }
        }, DOT_DUR);
    }

    function resetDot(d1, d2, tm) {
        clearTimeout(tm.current);
        [d1, d2].forEach(d => {
            if (d) {
                d.style.transition = "none";
                d.style.opacity = "0";
                d.style.strokeDashoffset = `${DOT_START}`;
            }
        });
    }

    useEffect(() => {
        if (leftActive) animateDot(lDot1.current, lDot2.current, lTm);
        else resetDot(lDot1.current, lDot2.current, lTm);
        return () => clearTimeout(lTm.current);
    }, [leftActive, leftKey]);

    useEffect(() => {
        if (rightActive) animateDot(rDot1.current, rDot2.current, rTm);
        else resetDot(rDot1.current, rDot2.current, rTm);
        return () => clearTimeout(rTm.current);
    }, [rightActive, rightKey]);

    const DA = `${DOT_LEN} ${DOT_GAP}`;
    const glId = `aig-gl-${dark ? "d" : "l"}`;

    return (
        <svg viewBox="0 0 98 192" fill="none" aria-hidden="true"
            style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}>
            <defs>
                <linearGradient id={glId} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor={dotColor} stopOpacity="0.85" />
                    <stop offset="0.5" stopColor={dotColor} stopOpacity="1" />
                    <stop offset="1" stopColor={dotColor} stopOpacity="1" />
                </linearGradient>
            </defs>
            <path stroke={connStroke} strokeWidth="1.5" d={V_FULL} />
            <path ref={lDot1} d={V_LEFT_ARM} stroke={`url(#${glId})`} strokeWidth="1.5"
                strokeLinecap="round" strokeDasharray={DA} strokeDashoffset={DOT_START} style={{ opacity: 0 }} />
            <path ref={lDot2} d={V_LEFT_ARM} stroke={dotColor} strokeWidth="5"
                strokeLinecap="round" strokeDasharray={DA} strokeDashoffset={DOT_START} style={{ opacity: 0, filter: "blur(4px)" }} />
            <path ref={rDot1} d={V_RIGHT_ARM} stroke={`url(#${glId})`} strokeWidth="1.5"
                strokeLinecap="round" strokeDasharray={DA} strokeDashoffset={DOT_START} style={{ opacity: 0 }} />
            <path ref={rDot2} d={V_RIGHT_ARM} stroke={dotColor} strokeWidth="5"
                strokeLinecap="round" strokeDasharray={DA} strokeDashoffset={DOT_START} style={{ opacity: 0, filter: "blur(4px)" }} />
        </svg>
    );
}

function BgShape({ uid }) {
    return (
        <svg viewBox="0 0 109 216" fill="none" aria-hidden="true"
            style={{
                position: "absolute", right: "1.125rem", top: "1.125rem",
                height: "13.5rem", width: "6.8125rem", overflow: "visible",
            }}>
            <g filter={`url(#${uid})`}>
                <path fill="#fff" fillOpacity=".02"
                    d="M104.715 48.667L61.353 4.402A8 8 0 0 0 55.638 2H-100a8 8 0 0 0-8 8V206a8 8 0 0 0 8 8H99a8 8 0 0 0 8-8V54.266c0-2.094-.82-4.103-2.285-5.599Z" />
                <path stroke="#fff" strokeOpacity=".05"
                    d="M60.996 4.752L104.358 49.017A7.5 7.5 0 0 1 106.5 54.265V206a7.5 7.5 0 0 1-7.5 7.5H-100a7.5 7.5 0 0 1-7.5-7.5V10a7.5 7.5 0 0 1 7.5-7.5H55.638A7.5 7.5 0 0 1 60.996 4.752Z" />
            </g>
            <defs>
                <filter id={uid} width="219" height="216" x="-110" y="0"
                    colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feFlood floodOpacity="0" result="bg" />
                    <feColorMatrix in="SourceAlpha" result="ha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset /><feGaussianBlur stdDeviation="1" />
                    <feComposite in2="ha" operator="out" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend in2="bg" result="sh" />
                    <feBlend in="SourceGraphic" in2="sh" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

function Bubble({ iconFn, t, tx, ty, opacity, transition }) {
    return (
        <div style={{
            position: "absolute", left: 0, top: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "2.5rem", height: "2.5rem", borderRadius: "9999px",
            backgroundColor: t.iconBg,
            backgroundImage: `linear-gradient(to bottom, ${t.iconFrom}, transparent 67%)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            transform: `translate(${tx}, ${ty})`,
            opacity,
            transition,
            willChange: "transform, opacity",
            color: t.fill,
        }}>
            <span style={{
                position: "absolute", inset: 0, borderRadius: "9999px",
                boxShadow: `inset 0 0 0 1px ${t.ring1}`,
                maskImage: "linear-gradient(to right,white,transparent)",
                WebkitMaskImage: "linear-gradient(to right,white,transparent)",
            }} />
            <span style={{
                position: "absolute", inset: 0, borderRadius: "9999px",
                boxShadow: `inset 0 0 0 1px ${t.ringAccent}`,
                maskImage: "linear-gradient(to left,white,transparent)",
                WebkitMaskImage: "linear-gradient(to left,white,transparent)",
            }} />
            {iconFn(t.fill)}
        </div>
    );
}

function CentralIcon({ t, iaOpacity }) {
    return (
        <div style={{
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "4rem", height: "4rem",
            overflow: "hidden", borderRadius: "0.375rem",
            backgroundColor: t.cardBg,
            backgroundImage: "linear-gradient(to bottom right, rgba(255,255,255,0.07), transparent 64%)",
            boxShadow: t.cardShadow,
        }}>
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `radial-gradient(111.72% 100% at 50% 0%, ${t.glowColor}, transparent 54%)`,
                opacity: 1 - iaOpacity,
                transition: "opacity 0.4s ease",
            }} />
            <span style={{
                position: "relative", zIndex: 1,
                fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                fontWeight: "700",
                fontSize: "1.25rem",
                letterSpacing: "0.12em",
                color: t.eyeBase,
                userSelect: "none",
                lineHeight: 1,
                opacity: iaOpacity,
                transition: "opacity 0.35s ease",
                pointerEvents: "none",
            }}>
                IA
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IconCluster — usa slotIdx como key (siempre único) e iconMap para
// resolver el ícono real. Así no hay keys duplicados aunque el pool
// de íconos tenga menos entradas que slots visibles.
// ─────────────────────────────────────────────────────────────────────────────
function IconCluster({ t, step, side, iconOrderRef, initialOrder, iconMap }) {
    // iconOrder contiene SLOTS (0-7), no índices de ícono
    const [iconOrder, setIconOrder] = useState(() => initialOrder || [0, 1, 2, 3, 4, 5]);
    const prevStepRef = useRef(step);
    const [wrapPhase, setWrapPhase] = useState("idle");
    const tmRef = useRef(null);

    useEffect(() => {
        if (iconOrderRef) iconOrderRef.current = iconOrder;
    });

    useEffect(() => {
        if (step === prevStepRef.current) return;
        prevStepRef.current = step;
        setWrapPhase("exit");
        tmRef.current = setTimeout(() => {
            setIconOrder(prev => {
                // Rotación: el último slot pasa al frente
                const next = [prev[5], prev[0], prev[1], prev[2], prev[3], prev[4]];
                if (iconOrderRef) iconOrderRef.current = next;
                return next;
            });
            setWrapPhase("enter");
            tmRef.current = setTimeout(() => setWrapPhase("idle"), 200);
        }, MOVE_DUR + 10);
        return () => clearTimeout(tmRef.current);
    }, [step]);

    const TR = `transform ${MOVE_DUR}ms cubic-bezier(0.42,0,0.18,1), opacity ${Math.round(MOVE_DUR * 0.7)}ms ease`;
    const TR_FADE = "opacity 180ms ease";
    const TR_NONE = "none";

    return (
        <>
            {iconOrder.map((slotIdx, ci) => {
                let tx, ty, opacity, transition;
                if (wrapPhase === "exit") {
                    if (ci < 5) { tx = POSITIONS[ci + 1].x; ty = POSITIONS[ci + 1].y; opacity = POS_OPACITY[ci + 1]; transition = TR; }
                    else { tx = OFF.x; ty = OFF.y; opacity = 0; transition = TR; }
                } else if (wrapPhase === "enter") {
                    if (ci === 0) { tx = POSITIONS[0].x; ty = POSITIONS[0].y; opacity = POS_OPACITY[0]; transition = TR_FADE; }
                    else { tx = POSITIONS[ci].x; ty = POSITIONS[ci].y; opacity = POS_OPACITY[ci]; transition = TR_NONE; }
                } else {
                    tx = POSITIONS[ci].x; ty = POSITIONS[ci].y; opacity = POS_OPACITY[ci]; transition = TR_NONE;
                }

                // key por SLOT → siempre único dentro del cluster
                // ícono real resuelto via iconMap → sin solapamiento entre lados
                return (
                    <Bubble
                        key={`${side}-slot${slotIdx}`}
                        iconFn={AI_ICONS[iconMap[slotIdx]]}
                        t={t} tx={tx} ty={ty} opacity={opacity} transition={transition}
                    />
                );
            })}
        </>
    );
}

function FlyingBubble({ t, iconFn, startX, startY, endX, endY, phase }) {
    const BUBBLE_SIZE = "2.5rem";
    let currentX = startX, currentY = startY, opacity = 0, transition = "none";

    if (phase === "at-start") {
        currentX = startX; currentY = startY; opacity = POS_OPACITY[3]; transition = "none";
    } else if (phase === "flying") {
        currentX = endX; currentY = endY; opacity = 0.9;
        transition = `left ${SLIDE_MS}ms cubic-bezier(0.42,0,0.18,1), top ${SLIDE_MS}ms cubic-bezier(0.42,0,0.18,1), opacity 300ms ease`;
    } else if (phase === "at-end") {
        currentX = endX; currentY = endY; opacity = 0.9; transition = "none";
    } else if (phase === "fading") {
        currentX = endX; currentY = endY; opacity = 0;
        transition = `opacity ${FADE_MS}ms ease`;
    } else {
        return null;
    }

    return (
        <div style={{
            position: "absolute",
            left: currentX,
            top: currentY,
            width: BUBBLE_SIZE, height: BUBBLE_SIZE,
            borderRadius: "9999px",
            backgroundColor: t.iconBg,
            backgroundImage: `linear-gradient(to bottom, ${t.iconFrom}, transparent 67%)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity, transition,
            willChange: "left, top, opacity",
            zIndex: 100,
            pointerEvents: "none",
            color: t.fill,
        }}>
            <span style={{
                position: "absolute", inset: 0, borderRadius: "9999px",
                boxShadow: `inset 0 0 0 1px ${t.ring1}`,
                maskImage: "linear-gradient(to right,white,transparent)",
                WebkitMaskImage: "linear-gradient(to right,white,transparent)",
            }} />
            <span style={{
                position: "absolute", inset: 0, borderRadius: "9999px",
                boxShadow: `inset 0 0 0 1px ${t.ringAccent}`,
                maskImage: "linear-gradient(to left,white,transparent)",
                WebkitMaskImage: "linear-gradient(to left,white,transparent)",
            }} />
            {iconFn(t.fill)}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function AIGenerativaBento({ dark: darkProp }) {

    const [dark, setDark] = useState(() => {
        if (darkProp !== undefined) return darkProp;
        return document.documentElement.classList.contains("dark");
    });

    useEffect(() => {
        if (darkProp !== undefined) { setDark(darkProp); return; }
        const observer = new MutationObserver(() => {
            setDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, [darkProp]);

    const t = getTheme(dark);

    const containerRef = useRef(null);
    const leftClusterRef = useRef(null);
    const rightClusterRef = useRef(null);
    const centralCardRef = useRef(null);

    // Refs de slots activos por lado — slots 0-7, únicos por cluster
    // Izquierdo usa slots [0-7] → resuelve íconos 0-3 via LEFT_ICON_MAP
    // Derecho   usa slots [0-7] → resuelve íconos 4-7 via RIGHT_ICON_MAP
    const leftIconOrderRef = useRef([0, 1, 2, 3, 4, 5]);
    const rightIconOrderRef = useRef([0, 1, 2, 3, 4, 5]);

    const [active, setActive] = useState(false);
    const [leftStep, setLeftStep] = useState(0);
    const [rightStep, setRightStep] = useState(0);
    const [leftDot, setLeftDot] = useState(false);
    const [rightDot, setRightDot] = useState(false);
    const [dotKey, setDotKey] = useState(0);
    const [iaOpacity, setIaOpacity] = useState(1);

    const [rightFly, setRightFly] = useState({
        phase: "hidden", startX: 0, startY: 0, endX: 0, endY: 0, iconFn: AI_ICONS[0],
    });
    const [leftFly, setLeftFly] = useState({
        phase: "hidden", startX: 0, startY: 0, endX: 0, endY: 0, iconFn: AI_ICONS[0],
    });

    const cycleTimers = useRef([]);
    const timerRef = useRef(null);
    const activeRef = useRef(false);
    activeRef.current = active;

    const clearCycleTimers = useCallback(() => {
        cycleTimers.current.forEach(clearTimeout);
        cycleTimers.current = [];
    }, []);

    const addTimer = useCallback((fn, ms) => {
        const id = setTimeout(fn, ms);
        cycleTimers.current.push(id);
        return id;
    }, []);

    const computePositions = useCallback(() => {
        const container = containerRef.current;
        const leftEl = leftClusterRef.current;
        const rightEl = rightClusterRef.current;
        const cardEl = centralCardRef.current;
        if (!container || !leftEl || !rightEl || !cardEl) return null;

        const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const cRect = container.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const BUBBLE = 2.5 * fs;

        const cardCX = cardRect.left - cRect.left + cardRect.width / 2;
        const cardCY = cardRect.top - cRect.top + cardRect.height / 2;
        const endX = cardCX - BUBBLE / 2;
        const endY = cardCY - BUBBLE / 2;

        const rRect = rightEl.getBoundingClientRect();
        const rClusterW = 15.5 * fs;
        const rLocalX = 13 * fs;
        const rLocalY = 3 * fs;
        const rVisualOffsetX = rClusterW - rLocalX - BUBBLE;
        const rStartX = (rRect.left - cRect.left) + rVisualOffsetX;
        const rStartY = (rRect.top - cRect.top) + rLocalY;

        const lRect = leftEl.getBoundingClientRect();
        const lStartX = (lRect.left - cRect.left) + 13 * fs;
        const lStartY = (lRect.top - cRect.top) + 3 * fs;

        return {
            right: { startX: rStartX, startY: rStartY, endX, endY },
            left: { startX: lStartX, startY: lStartY, endX, endY },
        };
    }, []);

    const runCycle = useCallback(() => {
        if (!activeRef.current) return;
        const pos = computePositions();
        if (!pos) return;

        let t0 = 0;

        // ── ETAPA DERECHA ─────────────────────────────────────────────────────
        // slot activo [3] → ícono real via RIGHT_ICON_MAP
        const rSlot = rightIconOrderRef.current[3];
        const rIconFn = AI_ICONS[RIGHT_ICON_MAP[rSlot]];
        setRightFly({ phase: "at-start", startX: pos.right.startX, startY: pos.right.startY, endX: pos.right.endX, endY: pos.right.endY, iconFn: rIconFn });
        addTimer(() => {
            if (!activeRef.current) return;
            setRightStep(s => s + 1);
            setRightDot(true);
            setDotKey(k => k + 1);
            setTimeout(() => setRightDot(false), DOT_DUR + 200);
        }, 0);
        t0 += 32;
        addTimer(() => { if (!activeRef.current) return; setRightFly(p => ({ ...p, phase: "flying" })); }, t0);
        t0 += SLIDE_MS;
        addTimer(() => { if (!activeRef.current) return; setRightFly(p => ({ ...p, phase: "at-end" })); }, t0);
        t0 += DWELL_MS;
        addTimer(() => { if (!activeRef.current) return; setRightFly(p => ({ ...p, phase: "fading" })); }, t0);
        t0 += FADE_MS;
        addTimer(() => { if (!activeRef.current) return; setRightFly(p => ({ ...p, phase: "hidden" })); }, t0);

        // ── ETAPA IZQUIERDA ───────────────────────────────────────────────────
        t0 += 100;
        addTimer(() => {
            if (!activeRef.current) return;
            const pos2 = computePositions();
            if (!pos2) return;
            // slot activo [3] → ícono real via LEFT_ICON_MAP
            const lSlot = leftIconOrderRef.current[3];
            const lIconFn = AI_ICONS[LEFT_ICON_MAP[lSlot]];
            setLeftFly({ phase: "at-start", startX: pos2.left.startX, startY: pos2.left.startY, endX: pos2.left.endX, endY: pos2.left.endY, iconFn: lIconFn });
            setLeftStep(s => s + 1);
            setLeftDot(true);
            setDotKey(k => k + 2);
            setTimeout(() => setLeftDot(false), DOT_DUR + 200);
            addTimer(() => { if (!activeRef.current) return; setLeftFly(p => ({ ...p, phase: "flying" })); }, 32);
            addTimer(() => { if (!activeRef.current) return; setLeftFly(p => ({ ...p, phase: "at-end" })); }, 32 + SLIDE_MS);
            addTimer(() => { if (!activeRef.current) return; setLeftFly(p => ({ ...p, phase: "fading" })); }, 32 + SLIDE_MS + DWELL_MS);
            addTimer(() => {
                if (!activeRef.current) return;
                setLeftFly(p => ({ ...p, phase: "hidden" }));
                addTimer(() => { if (activeRef.current) runCycle(); }, 200);
            }, 32 + SLIDE_MS + DWELL_MS + FADE_MS);
        }, t0);
    }, [computePositions, addTimer]);

    const stopAll = useCallback(() => {
        clearCycleTimers();
        setRightFly(p => ({ ...p, phase: "hidden" }));
        setLeftFly(p => ({ ...p, phase: "hidden" }));
        setIaOpacity(1);
    }, [clearCycleTimers]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onEnter = () => { setActive(true); activeRef.current = true; setIaOpacity(0); addTimer(runCycle, 50); };
        const onLeave = () => { setActive(false); activeRef.current = false; clearTimeout(timerRef.current); stopAll(); };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            clearTimeout(timerRef.current);
            stopAll();
        };
    }, [runCycle, stopAll, addTimer]);

    return (
        <div
            ref={containerRef}
            style={{
                pointerEvents: "auto",
                position: "relative",
                userSelect: "none",
                minHeight: "10.25rem",
                cursor: "default",
                overflow: "hidden",
                maskImage: "linear-gradient(to bottom, white 55%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, white 55%, transparent)",
            }}
        >
            {/* ── Clúster izquierdo ── slots [0-7] → íconos 0-3 via LEFT_ICON_MAP */}
            <div
                ref={leftClusterRef}
                style={{ position: "absolute", right: "50%", top: "1.5rem", marginRight: "calc(76/16*1rem)", zIndex: 10 }}
            >
                <div style={{ position: "relative", height: "15.5rem", width: "15.5rem" }}>
                    <BgShape uid="aig-bg-l" />
                    <div style={{ opacity: 0.75 }}>
                        <IconCluster
                            t={t} step={leftStep} side="left"
                            iconOrderRef={leftIconOrderRef}
                            initialOrder={[0, 1, 2, 3, 4, 5]}
                            iconMap={LEFT_ICON_MAP}
                        />
                    </div>
                </div>
            </div>

            {/* ── Clúster derecho (invertido) ── slots [0-7] → íconos 4-7 via RIGHT_ICON_MAP */}
            <div
                ref={rightClusterRef}
                style={{ position: "absolute", left: "50%", top: "1.5rem", marginLeft: "calc(76/16*1rem)", transform: "scaleX(-1)", zIndex: 10 }}
            >
                <div style={{ position: "relative", height: "15.5rem", width: "15.5rem" }}>
                    <BgShape uid="aig-bg-r" />
                    <div style={{ opacity: 0.75 }}>
                        <IconCluster
                            t={t} step={rightStep} side="right"
                            iconOrderRef={rightIconOrderRef}
                            initialOrder={[0, 1, 2, 3, 4, 5]}
                            iconMap={RIGHT_ICON_MAP}
                        />
                    </div>
                </div>
            </div>

            {/* ── Conector V + card central ─────────────────────────────────── */}
            <div style={{
                position: "absolute", left: "50%", top: 0,
                marginLeft: "calc(-98/2/16*1rem)",
                aspectRatio: "98/192",
                width: "calc(98/16*1rem)",
                paddingTop: "calc(60/16*1rem)",
                zIndex: 20,
            }}>
                <VConnector
                    leftActive={leftDot} rightActive={rightDot}
                    leftKey={dotKey} rightKey={dotKey + 1}
                    connStroke={t.connStroke}
                    dark={dark}
                />
                <div
                    ref={centralCardRef}
                    style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <CentralIcon t={t} iaOpacity={iaOpacity} />
                </div>
            </div>

            {/* ── Burbujas volantes ──────────────────────────────────────────── */}
            {rightFly.phase !== "hidden" && (
                <FlyingBubble
                    t={t} iconFn={rightFly.iconFn}
                    startX={rightFly.startX} startY={rightFly.startY}
                    endX={rightFly.endX} endY={rightFly.endY}
                    phase={rightFly.phase}
                />
            )}
            {leftFly.phase !== "hidden" && (
                <FlyingBubble
                    t={t} iconFn={leftFly.iconFn}
                    startX={leftFly.startX} startY={leftFly.startY}
                    endX={leftFly.endX} endY={leftFly.endY}
                    phase={leftFly.phase}
                />
            )}
        </div>
    );
}