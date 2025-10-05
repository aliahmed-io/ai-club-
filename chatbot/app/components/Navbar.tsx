"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname() ?? "/";

  const linkBase =
    "px-3 py-2 rounded-full text-sm font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const active = "bg-white/90 text-gray-900 shadow border-transparent";
  const inactive = "text-white/80 hover:text-white hover:bg-white/10 border-white/10";

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className="sticky top-0 z-50 w-full backdrop-blur bg-[rgba(12,18,36,0.6)] border-b border-white/10"
    >
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[rgba(167,139,250,0.18)] to-[rgba(110,241,255,0.08)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* moved left by ~1in on md+ screens without adjusting layout or spacing */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 no-underline transform md:-translate-x-[1in]"
            >
              <div className="flex items-center" style={{ lineHeight: 0 }}>
                <Image
                  src="/5 copy.png"
                  alt="Effat AI Club logo"
                  width={200}
                  height={100}
                  quality={80}
                  className="object-contain drop-shadow-2xl translate-y-[1px]"
                  style={{ objectPosition: "center", clipPath: "inset(30% 30% 30% 30%)" }}
                  priority={false}
                />
              </div>

              <span className="hidden sm:inline text-2xl font-bold drop-shadow-md leading-tight transform -translate-x-1">
                Effat AI Club
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={`${linkBase} ${isActive("/") ? active : inactive}`}
              >
                Chatbot
              </Link>

              {/* FIXED: href and isActive now match the image-generation route */}
              <Link
                href="/image-generation"
                aria-current={isActive("/image-generation") ? "page" : undefined}
                className={`${linkBase} ${isActive("/image-generation") ? active : inactive}`}
              >
                Image Generator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
