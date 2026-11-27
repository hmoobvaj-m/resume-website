export default function HeroIllustration() {
    return (
        <div className="mx-auto w-full max-w-lg select-none" aria-hidden="true">
            <svg
                viewBox="0 0 480 315"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-full"
                focusable="false"
            >
                <defs>
                    <radialGradient id="hero-glow">
                        <stop offset="0%" stopColor="#64748b" stopOpacity=".16" />
                        <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="terminal-fill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#202832" />
                        <stop offset="100%" stopColor="#13191f" />
                    </linearGradient>
                </defs>

                <ellipse cx="245" cy="160" rx="230" ry="150" fill="url(#hero-glow)" />

                <rect x="145" y="30" width="270" height="193" rx="15" fill="#1b222b" stroke="#303946" />
                <path d="M145 65H415" stroke="#303946" />

                {[163, 177, 191].map((x) => (
                    <circle key={x} cx={x} cy="47" r="4" fill="#64748b" opacity=".6" />
                ))}

                <rect x="105" y="63" width="270" height="193" rx="15" fill="#222a34" stroke="#465262" />
                <path d="M105 98H375" stroke="#465262" />

                {[123, 137, 151].map((x) => (
                    <circle key={x} cx={x} cy="80" r="4" fill="#94a3b8" opacity=".7" />
                ))}

                <rect x="65" y="98" width="270" height="193" rx="15" fill="url(#terminal-fill)" stroke="#8492a4" strokeWidth="1.5" />
                <path d="M65 133H335" stroke="#465262" />

                {[83, 97, 111].map((x) => (
                    <circle key={x} cx={x} cy="115" r="4" fill="#a6b1bf" />
                ))}

                <path
                    d="m172 166-30 30 30 30M230 166l30 30-30 30M215 158l-28 76"
                    stroke="#b6c5d7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path d="M155 253H245" stroke="#526071" strokeWidth="3" strokeLinecap="round" />
            </svg>
        </div>
    );
}