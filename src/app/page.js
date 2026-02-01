"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BG_IMG = "/image/shot-ostrich-fern-s-blossomed-plants.jpg";
const LEAF_IMG = "/image/folhas.jpg.png";
const PRODUCTS = [
  {
    name: "Orquídea Phalaenopsis Premium",
    desc: "A clássica recepção de autoridade. Elegância perene para salas de reunião.",
    img: "/plants/1.jpg",
    price: "R$ 249,00",
  },
  {
    name: "Ficus Lyrata Extra-G G",
    desc: "Uma escultura viva. Ideal para preencher espaços com imponência e modernidade.",
    img: "/plants/2.jpg",
    price: "R$ 399,00",
  },
  {
    name: "Vaso de Polietileno com Acabamento em Quartzo",
    desc: "Durabilidade blindada e estética mineral. O suporte à altura do seu patrimônio.",
    img: "/plants/3.jpg",
    price: "R$ 189,00",
  },
  {
    name: "Zamioculca (Resiliência Verde)",
    desc: "Perfeita para ambientes internos com pouca luz, mantendo o brilho e o vigor sem esforço.",
    img: "/plants/4.jpg",
    price: "R$ 129,00",
  },
  {
    name: "Arranjo de Boas-Vindas 'Classic Green'",
    desc: "Mix de folhagens nobres em vaso cerâmico artesanal para mesas de centro e aparadores.",
    img: "/plants/5.jpg",
    price: "R$ 159,00",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setTimeout(() => setReduced(mq.matches), 0); // Evita setState síncrono
      const handler = () => setReduced(mq.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);
  return reduced;
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  // Animação About com Intersection Observer
  const [aboutTextVisible, setAboutTextVisible] = useState(false);
  const [aboutImgVisible, setAboutImgVisible] = useState(false);
  const aboutTextRef = useRef(null);
  const aboutImgRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observerText = new window.IntersectionObserver(
      ([entry]) => setAboutTextVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    const observerImg = new window.IntersectionObserver(
      ([entry]) => setAboutImgVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    const textEl = aboutTextRef.current;
    const imgEl = aboutImgRef.current;
    if (textEl) observerText.observe(textEl);
    if (imgEl) observerImg.observe(imgEl);
    return () => {
      if (textEl) observerText.unobserve(textEl);
      if (imgEl) observerImg.unobserve(imgEl);
      observerText.disconnect();
      observerImg.disconnect();
    };
  }, []);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [bgPos, setBgPos] = useState(0);
  const [leafT, setLeafT] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // Parallax global: move o fundo em todas as seções (exceto header/footer)
  useEffect(() => {
    if (prefersReducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setBgPos(y * 0.4); // ajuste a velocidade conforme necessário
        // Folhas desaparecem gradativamente até a seção Showcase (~2.5x a altura da viewport)
        const distance = window.innerHeight * 2.5;
        setLeafT(Math.min(1, y / distance));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion, isMobile]);

  // Hero e Contact animados com Intersection Observer
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion) {
      setTimeout(() => setHeroVisible(true), 0);
      return;
    }
    if (typeof window === "undefined") return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    const heroEl = heroRef.current;
    if (heroEl) observer.observe(heroEl);
    return () => {
      if (heroEl) observer.unobserve(heroEl);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Contact animation
  const [contactVisible, setContactVisible] = useState(false);
  const contactRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    const contactEl = contactRef.current;
    if (contactEl) observer.observe(contactEl);
    return () => {
      if (contactEl) observer.unobserve(contactEl);
      observer.disconnect();
    };
  }, []);

  // Showcase scroll reveal com Intersection Observer
  const [revealed, setRevealed] = useState(Array(PRODUCTS.length).fill(false));
  const showcaseRefs = useRef([]);
  useEffect(() => {
    if (prefersReducedMotion) {
      setTimeout(() => setRevealed(Array(PRODUCTS.length).fill(true)), 0);
      return;
    }
    if (typeof window === "undefined") return;
    const observers = [];
    const elements = showcaseRefs.current.slice();
    elements.forEach((ref, i) => {
      if (!ref) return;
      const obs = new window.IntersectionObserver(
        ([entry]) => {
          setRevealed((r) => {
            const copy = [...r];
            copy[i] = entry.isIntersecting;
            return copy;
          });
        },
        { threshold: 0.3 },
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => {
      observers.forEach((obs, i) => {
        const el = elements[i];
        if (el) obs.unobserve(el);
        obs.disconnect();
      });
    };
  }, [prefersReducedMotion]);

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100">
      {/* Overlay global de vidro/blur para toda a página */}
      <div
        className="fixed inset-0 z-0 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm pointer-events-none"
        aria-hidden="true"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-zinc-700/20 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/image/BIO-A.png"
              alt="Logo BioAmbiente"
              width={160}
              height={40}
              priority
              className="h-10 w-auto object-contain drop-shadow"
            />
          </div>
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a
              href="#inicio"
              className="hover:text-green-700 transition-colors"
            >
              Início
            </a>
            <a
              href="#curadoria"
              className="hover:text-green-700 transition-colors"
            >
              Curadoria
            </a>
            <a href="#sobre" className="hover:text-green-700 transition-colors">
              Sobre Nós
            </a>
            <a
              href="#contato"
              className="hover:text-green-700 transition-colors"
            >
              Contato
            </a>
          </nav>
          {/* Botão removido conforme solicitado */}
        </div>
      </header>

      {/* Fundo Parallax Global */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 w-full h-full"
        style={{
          backgroundImage: `url(${BG_IMG})`,
          backgroundAttachment: prefersReducedMotion
            ? "scroll"
            : typeof window !== "undefined" && window.innerWidth < 768
              ? "scroll"
              : "fixed",
          backgroundPosition:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "center top"
              : `center ${-bgPos}px`,
          backgroundRepeat:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "repeat-y"
              : "no-repeat",
          backgroundSize: "cover",
          transition: prefersReducedMotion
            ? undefined
            : "background-position 0s",
        }}
      />

      {/* Folhas decorativas que se movem e desaparecem gradativamente com o scroll */}
      <Image
        src="/image/folhas-01.png"
        alt=""
        aria-hidden="true"
        width={1400}
        height={1400}
        className={`pointer-events-none select-none fixed left-1/2 z-0 ${isMobile ? "w-[180vw] max-w-none" : "w-[110vw] sm:w-[86vw] md:w-[680px] lg:w-[920px]"}`}
        style={{
          top: "45vh",
          transform: prefersReducedMotion
            ? "translate(calc(-100% - 1.5rem), -50%)"
            : `translate(calc(-100% - 1.5rem + ${-leafT * (isMobile ? 320 : 800)}px), -50%) rotate(${-10 - leafT * 18}deg)`,
          opacity: prefersReducedMotion
            ? 0.95
            : Math.max(0, 0.95 - leafT * 1.1),
          filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.38))",
          transition: prefersReducedMotion ? "opacity 0.3s" : "none",
        }}
      />
      <Image
        src="/image/folhas-02.png"
        alt=""
        aria-hidden="true"
        width={1400}
        height={1400}
        className={`pointer-events-none select-none fixed right-1/2 z-0 ${isMobile ? "w-[180vw] max-w-none" : "w-[110vw] sm:w-[86vw] md:w-[680px] lg:w-[920px]"}`}
        style={{
          top: "45vh",
          transform: prefersReducedMotion
            ? "translate(calc(100% + 1.5rem), -50%) scaleX(-1)"
            : `translate(calc(100% + 1.5rem + ${leafT * (isMobile ? 320 : 800)}px), -50%) rotate(${10 + leafT * 18}deg) scaleX(-1)`,
          opacity: prefersReducedMotion
            ? 0.95
            : Math.max(0, 0.95 - leafT * 1.1),
          filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.38))",
          transition: prefersReducedMotion ? "opacity 0.3s" : "none",
        }}
      />

      {/* Conteúdo principal (Hero, About, Showcase, Contact) */}
      <main className="pt-0">
        {/* Hero Section */}
        <section
          id="inicio"
          className="relative flex items-center justify-center min-h-[90vh] md:pt-16 overflow-hidden"
        >
          <div
            ref={heroRef}
            className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6"
          >
            <h1
              className={`relative z-10 text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg mb-4 transition-all duration-[1600ms] ease-out ${heroVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"}`}
            >
              A sofisticação da natureza integrada ao seu ambiente de alto
              padrão.
            </h1>
            <p
              className={`relative z-10 text-lg md:text-xl text-zinc-100/90 mb-8 transition-all duration-[1200ms] delay-200 ease-out ${heroVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"}`}
            >
              Mais do que plantas, entregamos elementos de design que comunicam
              autoridade, bem-estar e sofisticação para residências e
              escritórios jurídicos.
            </p>
            <a
              href="#curadoria"
              className={`relative z-10 px-7 py-3 rounded-full bg-green-700 text-white font-semibold shadow-lg hover:bg-green-800 transition-colors text-lg transition-all duration-[1000ms] ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            >
              Conheça Nossa Curadoria
            </a>
          </div>
        </section>

        {/* About Section */}
        <section
          id="sobre"
          className="relative py-20 px-4 scroll-mt-24 md:scroll-mt-28"
        >
          {/* Glass effect cobrindo toda a seção about */}
          {/* Removido blur individual da seção */}
          <div className="relative z-10 max-w-5xl mx-auto flex justify-center items-center min-h-[420px] px-2 md:px-8">
            {/* Card glassmorphism atrás de tudo */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="w-full md:w-[900px] h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl shadow-2xl" />
            </div>
            <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 h-full min-h-[320px] px-2 md:px-8">
              {/* Imagem "fora" do card em desktop */}
              <div className="relative w-full flex justify-center md:justify-start md:w-auto">
                <div
                  className={`transition-all duration-700 flex-shrink-0 z-20 ${aboutImgVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"} md:absolute md:-left-40 md:top-1/2 md:-translate-y-1/2 md:translate-x-0`}
                  style={{
                    width: "320px",
                    maxWidth: "90vw",
                    pointerEvents: "auto",
                  }}
                  ref={aboutImgRef}
                >
                  <Image
                    src="/plants/about.jpg"
                    alt="Plantas em ambiente sofisticado"
                    width={420}
                    height={420}
                    className="rounded-3xl object-cover w-full h-auto aspect-square md:w-[420px] md:h-[420px] shadow-2xl"
                    style={{
                      objectPosition: "center",
                      width: "100%",
                      maxWidth: "420px",
                      aspectRatio: "1/1",
                    }}
                  />
                </div>
              </div>
              {/* Espaço "placeholder" para alinhar o texto ao lado da imagem em desktop */}
              <div
                className="hidden md:block"
                style={{ width: "180px", flexShrink: 0 }}
              />
              <div
                className={`transition-all duration-700 flex flex-col justify-center items-center md:items-start w-full md:w-1/2 max-w-[420px] px-2 md:px-0 z-10 ${aboutTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                ref={aboutTextRef}
                style={{
                  minHeight: "220px",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-green-700 text-center md:text-left w-full">
                  Excelência em cada detalhe botânico.
                </h2>
                <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-200 text-center md:text-left mb-3 w-full">
                  Entendemos que o seu espaço é o reflexo do seu sucesso. Por
                  isso, não apenas vendemos plantas; oferecemos uma consultoria
                  em design biofílico. Nossa missão é harmonizar o meio ambiente
                  com a arquitetura moderna, garantindo que cada vaso e cada
                  espécie contribua para uma atmosfera de sobriedade e vigor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section id="curadoria" className="relative py-20 px-4">
          <div className="relative z-10 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
              Melhoria do Ambiente
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {PRODUCTS.map((prod, i) => (
                <div
                  key={prod.name}
                  ref={(el) => (showcaseRefs.current[i] = el)}
                  className={`group relative rounded-3xl overflow-hidden shadow-xl flex flex-col items-center justify-end min-h-[370px] cursor-pointer transition-all duration-[1200ms] ease-out ${revealed[i] ? "opacity-100 scale-105" : "opacity-0 scale-95"}`}
                  style={{ transitionDelay: `${i * 220}ms` }}
                  tabIndex={0}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={prod.img}
                      alt={prod.name}
                      fill
                      className="object-cover w-full h-full scale-110 group-hover:scale-100 group-active:scale-95 transition-transform duration-500"
                      style={{ filter: "brightness(0.85) blur(0px)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/30 to-transparent group-hover:from-green-800/80 group-hover:via-green-700/30 group-hover:to-transparent transition-all duration-500" />
                  </div>
                  <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-green-200 transition-colors duration-300 text-center">
                      {prod.name}
                    </h3>
                    <p className="text-zinc-100/90 text-base mb-4 text-center group-hover:text-green-100 transition-colors duration-300">
                      {prod.desc}
                    </p>
                    <div className="mt-auto text-lg font-bold text-green-300 bg-zinc-900/80 rounded-full px-6 py-2 shadow-lg group-hover:bg-green-800/80 group-hover:text-green-100 transition-all duration-300">
                      {prod.price}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 z-20 opacity-0 group-active:opacity-100 transition-opacity duration-300 bg-green-700/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-lg font-bold animate-pulse">
                      Selecionado!
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="relative py-20 px-4">
          <div
            ref={contactRef}
            className={`relative z-10 max-w-xl mx-auto rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md flex flex-col items-center transition-all duration-[1200ms] ease-out ${contactVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 text-center">
              Consultoria Personalizada
            </h2>
            <p className="mb-8 text-zinc-700 dark:text-zinc-200 text-center max-w-lg pb-2 sm:pb-0">
              Deixe seus dados para que um de nossos especialistas entre em
              contato e planeje a renovação botânica do seu espaço.
            </p>
            <form className="w-full flex flex-col gap-3 sm:gap-5 items-center">
              {/* Nome */}
              <input
                type="text"
                placeholder="Nome"
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full transition-all duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "100ms" }}
                required
              />
              {/* Email */}
              <input
                type="email"
                placeholder="E-mail"
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full transition-all duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "250ms" }}
                required
              />
              {/* Telefone */}
              <input
                type="tel"
                placeholder="Telefone"
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full transition-all duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "400ms" }}
                required
              />
              {/* Área de Interesse */}
              <select
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full transition-all duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "550ms" }}
                required
              >
                <option value="">Área de Interesse</option>
                <option value="residencial">Residencial</option>
                <option value="corporativo">Corporativo</option>
              </select>
              <button
                type="submit"
                className="mt-2 px-6 py-3 rounded-full bg-green-700/90 text-white font-semibold shadow-lg hover:bg-green-800 transition-colors text-lg w-full sm:px-8"
              >
                <span className="block sm:hidden">Solicitar</span>
                <span className="hidden sm:block">
                  Solicitar Atendimento Exclusivo
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 bg-zinc-900 text-zinc-100 text-center text-sm mt-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold">BioAmbiente</span> &copy;{" "}
            {new Date().getFullYear()}
            <br />
            CNPJ 00.000.000/0001-00 | Av. das Plantas, 123 - São Paulo, SP
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
