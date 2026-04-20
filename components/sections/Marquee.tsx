"use client";

export default function Marquee() {
  const text = "Content Strategy • Viral Reels • Brand Identity • Growth Hacking • Short Form • Engagement • ";

  return (
    <div className="w-full overflow-hidden py-8 border-y border-foreground/10">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="font-display text-xl md:text-2xl text-foreground/60 tracking-wide">
          {text.repeat(6)}
        </span>
      </div>
    </div>
  );
}
