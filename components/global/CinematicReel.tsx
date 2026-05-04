"use client";

export default function CinematicReel({ thumbnails = [] }: { thumbnails?: string[] }) {
  // Hexagonal radial layout angles (60° apart)
  const angles = [0, 60, 120, 180, 240, 300];
  const radius = 240; // Distance of cutouts from center
  const cutoutSize = 75; // Size of the cutouts

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1000 1000"
        className="w-[90%] h-[90%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Logo Clip */}
          <clipPath id="logoCircle">
            <circle cx="500" cy="500" r="40" />
          </clipPath>

          {/* Cutout Clips for Thumbnails */}
          {angles.map((angle, i) => {
            const x = 500 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 500 + radius * Math.sin((angle * Math.PI) / 180);
            return (
              <clipPath key={`clip-${i}`} id={`clip-hole-${i}`}>
                <circle cx={x} cy={y} r={cutoutSize} />
              </clipPath>
            );
          })}
        </defs>

        {/* Invisible path for text alignment */}
        <path
          id="circumferencePath"
          d="M 500, 500 m -430, 0 a 430,430 0 1,1 860,0 a 430,430 0 1,1 -860,0"
        />

        {/* Circular Text "OUR WORK" - Split into characters for staggered animation */}
        <text
          id="reelText"
          className="font-display font-black uppercase text-[64px] tracking-[1em] opacity-80"
        >
          <textPath href="#circumferencePath" startOffset="25%" textAnchor="middle">
            {/* Split "OUR WORK" into individual tspans for GSAP targeting */}
            {"OUR WORK".split("").map((char, i) => (
              <tspan 
                key={i} 
                className="reel-char"
                fill={i < 4 ? "#0084FF" : "#FF4D00"}
              >
                {char === " " ? "\u00A0" : char}
              </tspan>
            ))}
          </textPath>
        </text>

        {/* Outer Concentric Ring - Very low opacity */}
        <circle
          cx="500"
          cy="500"
          r="480"
          stroke="#000"
          strokeWidth="1"
          strokeOpacity="0.05"
        />

        {/* Dotted Orbit Ring */}
        <circle
          cx="500"
          cy="500"
          r="440"
          stroke="#000"
          strokeWidth="2"
          strokeOpacity="0.08"
          strokeDasharray="4 12"
        />

        {/* Main Reel Disc */}
        <circle
          cx="500"
          cy="500"
          r="380"
          fill="#E0F2FE"
          stroke="#BAE6FD"
          strokeWidth="2"
          className="reel-disc-main"
        />

        {/* Radial Cutouts - Hexagonal Layout with Thumbnails */}
        {angles.map((angle, i) => {
          const x = 500 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 500 + radius * Math.sin((angle * Math.PI) / 180);
          const thumb = thumbnails[i] || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop";

          return (
            <g key={angle}>
              {/* Main Cutout Hole */}
              <circle
                cx={x}
                cy={y}
                r={cutoutSize}
                fill="#F0F9FF"
                stroke="#BAE6FD"
                strokeWidth="2"
                className="reel-cutout"
              />

              {/* Thumbnail Image */}
              <image
                href={thumb}
                x={x - cutoutSize}
                y={y - cutoutSize}
                width={cutoutSize * 2}
                height={cutoutSize * 2}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-hole-${i})`}
                className="reel-thumb opacity-70 grayscale"
              />

              {/* Depth Overlay (Glass Effect) */}
              <circle
                cx={x}
                cy={y}
                r={cutoutSize}
                fill="white"
                fillOpacity="0.1"
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Center Hub */}
        <g>
          {/* Subtle Red Radial Glow */}
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx="500"
            cy="500"
            r="160"
            fill="url(#hubGlow)"
          />

          {/* Central Hub Plate */}
          <circle
            cx="500"
            cy="500"
            r="45"
            fill="#F5F5F5"
            stroke="#E5E5E5"
            strokeWidth="2"
          />

          {/* Logo Integration with Circular Clipping */}
          <image
            href="/logo-v2.png"
            x="460"
            y="460"
            width="80"
            height="80"
            clipPath="url(#logoCircle)"
            className="opacity-90"
          />

          {/* Horizontal "READY TO PLAY" Text */}
          <g>
            <text
              x="500"
              y="580"
              fill="#0a0a0a"
              textAnchor="middle"
              className="font-mono text-[14px] uppercase tracking-[0.4em] opacity-30"
            >
              READY TO PLAY
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
