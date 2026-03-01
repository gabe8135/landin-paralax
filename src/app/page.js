"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  // Estados para animação das folhas
  const [leafState, setLeafState] = useState("static"); // static | exit | hidden | enter
  const leafTimeoutRef = useRef(null);
  const leafLastShouldBeVisibleRef = useRef(null);
  const beneficiosRef = useRef(null);
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Controle de animação das folhas: visíveis até Benefícios do Verde aparecer
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leafTimeoutRef.current) {
      clearTimeout(leafTimeoutRef.current);
      leafTimeoutRef.current = null;
    }

    const handleScroll = () => {
      const beneficios = beneficiosRef.current;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      // Pega posição das seções
      const beneficiosTop = beneficios
        ? beneficios.getBoundingClientRect().top + scrollY
        : 0;

      // Regra: visível na Hero e Sobre; ao aparecer Benefícios, as folhas saem e somem.
      const pivot = scrollY + vh * 0.45;
      const shouldBeVisible = pivot < beneficiosTop;

      if (prefersReducedMotion) {
        setLeafState(shouldBeVisible ? "static" : "hidden");
        leafLastShouldBeVisibleRef.current = shouldBeVisible;
        return;
      }

      if (leafLastShouldBeVisibleRef.current === null) {
        setLeafState(shouldBeVisible ? "static" : "hidden");
        leafLastShouldBeVisibleRef.current = shouldBeVisible;
        return;
      }

      if (leafLastShouldBeVisibleRef.current === shouldBeVisible) return;

      // Mudou de zona: anima para sair/entrar uma única vez
      if (leafTimeoutRef.current) {
        clearTimeout(leafTimeoutRef.current);
        leafTimeoutRef.current = null;
      }

      if (shouldBeVisible) {
        setLeafState("enter");
        leafTimeoutRef.current = setTimeout(() => {
          setLeafState("static");
          leafTimeoutRef.current = null;
        }, 1200);
      } else {
        setLeafState("exit");
        leafTimeoutRef.current = setTimeout(() => {
          setLeafState("hidden");
          leafTimeoutRef.current = null;
        }, 1200);
      }

      leafLastShouldBeVisibleRef.current = shouldBeVisible;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (leafTimeoutRef.current) {
        clearTimeout(leafTimeoutRef.current);
        leafTimeoutRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

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
    <>
      {/* Folhas decorativas (somente Home) com animação controlada por seção */}
      <Image
        src="/image/folhas-01.png"
        alt=""
        aria-hidden="true"
        width={1400}
        height={1400}
        className={`pointer-events-none select-none fixed left-1/2 z-0 ${isMobile ? "w-[180vw] max-w-none" : "w-[110vw] sm:w-[86vw] md:w-[680px] lg:w-[920px]"}`}
        style={{
          top: "45vh",
          transform:
            leafState === "exit" || leafState === "hidden"
              ? "translate(-200vw, -50%) rotate(-30deg)"
              : "translate(calc(-100% - 1.5rem), -50%) rotate(-10deg)",
          opacity: leafState === "hidden" || leafState === "exit" ? 0 : 0.95,
          filter: "blur(2px) drop-shadow(0 22px 38px rgba(0,0,0,0.34))",
          transition: "all 1.2s cubic-bezier(.4,0,.2,1)",
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
          transform:
            leafState === "exit" || leafState === "hidden"
              ? "translate(200vw, -50%) rotate(30deg) scaleX(-1)"
              : "translate(calc(100% + 1.5rem), -50%) rotate(10deg) scaleX(-1)",
          opacity: leafState === "hidden" || leafState === "exit" ? 0 : 0.95,
          filter: "blur(2px) drop-shadow(0 22px 38px rgba(0,0,0,0.34))",
          transition: "all 1.2s cubic-bezier(.4,0,.2,1)",
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
              className={`relative z-10 px-7 py-3 rounded-full bg-green-700 text-white font-semibold shadow-lg hover:bg-green-800 transition-all text-lg duration-[1000ms] ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            >
              Conheça Nossa Curadoria
            </a>
          </div>
        </section>

        {/* About Section - enriquecida */}
        <section
          id="sobre"
          className="relative py-20 px-4 scroll-mt-24 md:scroll-mt-28"
        >
          <div className="relative z-10 max-w-5xl mx-auto flex justify-center items-center min-h-[420px] px-2 md:px-8">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="w-full md:w-[900px] h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl shadow-2xl" />
            </div>
            <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 h-full min-h-[320px] px-2 md:px-8">
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
                  <br />
                  <br />
                  <b>Missão:</b> Transformar ambientes em experiências vivas,
                  promovendo bem-estar, produtividade e sofisticação.
                  <br />
                  <b>Valores:</b> Sustentabilidade, excelência, personalização e
                  respeito à natureza.
                  <br />
                  <b>Diferenciais:</b> Curadoria exclusiva, atendimento
                  consultivo, entrega premium e pós-venda atencioso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios do Verde */}
        <section className="relative py-16 px-4" ref={beneficiosRef}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
              Por que investir em ambientes verdes?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-green-800">
                  Bem-estar & Saúde
                </h3>
                <p>
                  Plantas purificam o ar, reduzem o estresse e aumentam a
                  sensação de conforto e relaxamento.
                </p>
              </div>
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-green-800">
                  Produtividade & Foco
                </h3>
                <p>
                  Ambientes biofílicos estimulam a criatividade, concentração e
                  satisfação no trabalho.
                </p>
              </div>
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-green-800">
                  Valorização do Espaço
                </h3>
                <p>
                  O verde agrega sofisticação, valoriza imóveis e transmite uma
                  imagem de sucesso e cuidado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona a Curadoria */}
        <section className="relative py-16 px-4 bg-green-50 dark:bg-zinc-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
              Como funciona nossa curadoria?
            </h2>
            <ol className="space-y-6 text-left md:text-center">
              <li>
                <b>1. Diagnóstico:</b> Entendemos o perfil do ambiente,
                necessidades e preferências do cliente.
              </li>
              <li>
                <b>2. Seleção:</b> Escolhemos espécies e vasos ideais para cada
                espaço, priorizando beleza e praticidade.
              </li>
              <li>
                <b>3. Entrega & Montagem:</b> Realizamos a entrega premium e
                montagem no local, com todo cuidado.
              </li>
              <li>
                <b>4. Pós-venda:</b> Oferecemos suporte e dicas para manutenção
                e longevidade das plantas.
              </li>
            </ol>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="relative py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8">
              O que dizem nossos clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                <span className="text-green-700 text-3xl mb-2">“</span>
                <p className="italic mb-4">
                  O atendimento foi impecável e as plantas transformaram nosso
                  escritório. Recomendo de olhos fechados!
                </p>
                <span className="font-bold text-green-800">
                  — Ana Paula, Advogada
                </span>
              </div>
              <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                <span className="text-green-700 text-3xl mb-2">“</span>
                <p className="italic mb-4">
                  A curadoria personalizada fez toda diferença. O ambiente ficou
                  mais elegante e acolhedor.
                </p>
                <span className="font-bold text-green-800">
                  — Ricardo Lima, Empresário
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-16 px-4 bg-white/60 dark:bg-zinc-900/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-green-800">
                  Vocês atendem residências e empresas?
                </h3>
                <p>
                  Sim! Nossa curadoria é personalizada tanto para ambientes
                  corporativos quanto residenciais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  As plantas já vão montadas?
                </h3>
                <p>
                  Sim, entregamos tudo pronto para uso, com montagem e
                  instruções de cuidados.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Posso escolher as espécies?
                </h3>
                <p>
                  Você pode indicar preferências e restrições, e nossa equipe
                  sugere as melhores opções para seu espaço.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  E se eu não souber cuidar?
                </h3>
                <p>
                  Oferecemos suporte pós-venda e dicas para garantir a saúde e
                  beleza das plantas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
              Pronto para transformar seu ambiente?
            </h2>
            <p className="mb-8 text-zinc-700 dark:text-zinc-200">
              Solicite um orçamento personalizado e descubra como a natureza
              pode elevar o padrão do seu espaço.
            </p>
            <a
              href="#contato"
              className="inline-block px-8 py-4 rounded-full bg-green-700 text-white font-semibold shadow-lg hover:bg-green-800 transition-colors text-lg"
            >
              Solicitar Orçamento
            </a>
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
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "100ms" }}
                required
              />
              {/* Email */}
              <input
                type="email"
                placeholder="E-mail"
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "250ms" }}
                required
              />
              {/* Telefone */}
              <input
                type="tel"
                placeholder="Telefone"
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "400ms" }}
                required
              />
              {/* Área de Interesse */}
              <select
                className={`rounded-xl border border-green-200 px-5 py-3 bg-white/80 backdrop-blur text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow w-full duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
    </>
  );
}
