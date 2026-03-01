"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const BG_IMG = "/image/shot-ostrich-fern-s-blossomed-plants.jpg";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setTimeout(() => setReduced(mq.matches), 0);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function SiteChrome({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [bgPos, setBgPos] = useState(0);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setBgPos(y * 0.4);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100">
      <div
        className="fixed inset-0 z-0 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm pointer-events-none"
        aria-hidden="true"
      />

      <header className="fixed top-0 left-0 w-full z-30 bg-zinc-700/20 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/image/BIO-A.png"
              alt="Logo BioAmbiente"
              width={160}
              height={40}
              priority
              className="h-10 w-auto object-contain drop-shadow"
            />
          </Link>

          <nav className="hidden md:flex gap-8 text-base font-medium">
            <Link href="/" className="hover:text-green-700 transition-colors">
              Início
            </Link>
            <Link
              href="/sobre"
              className="hover:text-green-700 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/solucoes"
              className="hover:text-green-700 transition-colors"
            >
              Soluções
            </Link>
            <Link
              href="/projetos"
              className="hover:text-green-700 transition-colors"
            >
              Projetos
            </Link>
            <Link
              href="/contato"
              className="hover:text-green-700 transition-colors"
            >
              Contato
            </Link>
          </nav>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 w-full h-full"
        style={{
          backgroundImage: `url(${BG_IMG})`,
          backgroundAttachment: prefersReducedMotion
            ? "scroll"
            : isMobile
              ? "scroll"
              : "fixed",
          backgroundPosition: isMobile ? "center top" : `center ${-bgPos}px`,
          backgroundRepeat: isMobile ? "repeat-y" : "no-repeat",
          backgroundSize: "cover",
          transition: prefersReducedMotion
            ? undefined
            : "background-position 0s",
        }}
      />

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 py-8 px-4 bg-zinc-900 text-zinc-100 text-center text-sm mt-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold">Bio-A</span> &copy;{" "}
            {new Date().getFullYear()}
            <br />
            Design biofílico e curadoria premium
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-green-400 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-4 text-zinc-400 text-xs">
          Otimizado para visualização em todos os dispositivos.
        </div>
      </footer>
    </div>
  );
}
