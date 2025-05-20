import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Share2,
  Award,
  Gift,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactFullpage from "@fullpage/react-fullpage";
import { useMediaQuery } from "react-responsive";

export default function ChocolateAdPage() {
  // Estados principais
  const [unlocked, setUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections] = useState(13);
  const [tabActive, setTabActive] = useState(true);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [, setShowConfetti] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Estado para controlar quanto tempo o usuário permaneceu em cada seção
  const SECTION_TIMER = 3; // 3 segundos por seção
  const [sectionCompleted, setSectionCompleted] = useState(
    Array(totalSections).fill(false)
  );
  const [currentSectionTime, setCurrentSectionTime] = useState(SECTION_TIMER);

  const [metrics, setMetrics] = useState({
    viewedSections: 0,
    timeSpent: 0,
    startTime: Date.now(),
  });

  // Referências
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const fullpageApiRef = useRef<any>(null);
  const confettiRef = useRef<typeof window.confetti>(null);
  const timerIntervalRef = useRef<number | undefined>(undefined);

  // Destino final (normalmente viria de um parâmetro de URL)
  const destinationUrl = "https://destino.exemplo.com";

  // Frases para as etapas
  const stepPhrases = [
    "Continue rolando para revelar seu link...",
    "Aguarde alguns segundos...",
    "Você está progredindo bem...",
    "Continue avançando...",
    "Estamos processando seu acesso...",
    "Validando sua jornada...",
    "Continue descendo...",
    "Apenas mais algumas etapas...",
    "Você está indo muito bem...",
    "Quase lá...",
  ];

  // Cores para os níveis
  const levelColors = [
    "#cd7f32",
    "#cd7f32",
    "#d4af37",
    "#d4af37",
    "#7ab8cc",
    "#7ab8cc",
    "#9ee493",
    "#9ee493",
    "#a67db8",
    "#a67db8",
    "#ff9a76",
    "#ff9a76",
  ];

  const totalLevels = 10;

  // Primeiro snap (apresentação) e último snap (footer) já começam completos
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initialCompleted = [...sectionCompleted];
    initialCompleted[0] = true;
    initialCompleted[totalSections - 1] = true;
    setSectionCompleted(initialCompleted);
  }, []);

  // Carrega a biblioteca de confetti
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    script.async = true;
    script.onload = () => {
      confettiRef.current = window.confetti;
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Detecta se a aba está ativa ou em background
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Efeito para recarregar os anúncios quando necessário
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const reloadBannerAds = () => {
      // Tenta reinvocar o script do Banner
      if (window.invoke_1123eee015220ba1dacddd14ea04a988) {
        try {
          window.invoke_1123eee015220ba1dacddd14ea04a988();
        } catch (e) {
          console.log("Erro ao recarregar Banner Ads:", e);
        }
      }
    };

    // Recarrega anúncios quando a seção muda
    setTimeout(() => {
      reloadBannerAds();
    }, 0);
  }, [currentSection]);

  // Configura o temporizador para cada seção
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Se a seção atual já foi completada ou é a seção de link já desbloqueada, não precisamos do timer
    if (
      sectionCompleted[currentSection] ||
      (unlocked && currentSection === totalSections - 2)
    ) {
      return;
    }

    // Não aplicamos timer ao primeiro snap e ao último snap (footer)
    if (currentSection === 0 || currentSection === totalSections - 1) {
      return;
    }

    // Não aplicamos timer à página de link (penúltima)
    if (currentSection === totalSections - 2) {
      return;
    }

    // Inicializa o temporizador para a seção atual
    setCurrentSectionTime(SECTION_TIMER);

    // Configura um intervalo para decrementar o temporizador
    if (tabActive) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentSectionTime((prev) => {
          if (prev <= 1) {
            // Timer concluído
            clearInterval(timerIntervalRef.current);

            // Marca a seção como completada
            const newCompletedSections = [...sectionCompleted];
            newCompletedSections[currentSection] = true;
            setSectionCompleted(newCompletedSections);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentSection, tabActive, sectionCompleted, unlocked]);

  // Atualiza o tempo gasto na página
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (tabActive) {
        setMetrics((prev) => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - prev.startTime) / 1000),
        }));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [tabActive]);

  // Verifica se todas as condições para desbloquear o link foram atendidas
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentSection === totalSections - 2) {
      const allPreviousSectionsCompleted = sectionCompleted
        .slice(1, totalSections - 2)
        .every(Boolean);

      if (allPreviousSectionsCompleted && !unlocked) {
        setUnlocked(true);
        setShowConfetti(true);

        // Dispara o confetti
        if (confettiRef.current) {
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 100,
          };

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            if (confettiRef.current) {
              confettiRef.current({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ["#8b5a2b", "#cd7f32", "#d4af37"],
              });
              confettiRef.current({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ["#a67db8", "#7ab8cc", "#8b5a2b"],
              });
            }
          }, 250);

          setTimeout(() => {
            setShowConfetti(false);
          }, duration + 500);
        }
      }
    }
  }, [currentSection, sectionCompleted, unlocked]);

  // Copia o link para a área de transferência
  const handleCopyLink = () => {
    navigator.clipboard.writeText(destinationUrl).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    });
  };

  // Compartilha o link
  const handleShareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Link do CHC.LAT",
          text: "Veja este link que encontrei!",
          url: destinationUrl,
        })
        .catch((error) => console.log("Erro ao compartilhar", error));
    } else {
      handleCopyLink();
    }
  };

  // Navegação entre seções (usando a API do fullpage.js)
  const navigateTo = (index: number) => {
    if (fullpageApiRef.current) {
      fullpageApiRef.current.moveTo(index + 1);
    }
  };

  // Função para renderizar os containers de anúncios de banner com capacidade responsiva
  const renderBannerAdContainer = (index: number, singleBannerOnly = false) => {
    return (
      <div
        id={`banner-container-${index}`}
        className="my-6 flex flex-col md:flex-row justify-center gap-4"
      >
        {/* Banner principal */}
        <div
          className="w-[300px] h-[250px] mx-auto"
          ref={(el) => {
            if (el && !el.hasChildNodes()) {
              // Script para opções
              const optionsScript = document.createElement("script");
              optionsScript.type = "text/javascript";
              optionsScript.innerHTML = `
              atOptions = { 
                'key' : '1123eee015220ba1dacddd14ea04a988', 
                'format' : 'iframe', 
                'height' : 250, 
                'width' : 300, 
                'params' : {} 
              };
            `;
              el.appendChild(optionsScript);

              // Script principal
              const mainScript = document.createElement("script");
              mainScript.type = "text/javascript";
              mainScript.src =
                "//www.highperformanceformat.com/1123eee015220ba1dacddd14ea04a988/invoke.js";
              el.appendChild(mainScript);
            }
          }}
        />

        {/* Só mostra adicionais se NÃO for singleBannerOnly (no mobile nas telas limitadas) */}
        {!singleBannerOnly && (
          <>
            <div
              className="md:block w-[300px] h-[250px] mx-auto"
              ref={(el) => {
                if (el && !el.hasChildNodes()) {
                  // Script para opções
                  const optionsScript = document.createElement("script");
                  optionsScript.type = "text/javascript";
                  optionsScript.innerHTML = `
                  atOptions = { 
                    'key' : '1123eee015220ba1dacddd14ea04a988', 
                    'format' : 'iframe', 
                    'height' : 250, 
                    'width' : 300, 
                    'params' : {} 
                  };
                `;
                  el.appendChild(optionsScript);

                  // Script principal
                  const mainScript = document.createElement("script");
                  mainScript.type = "text/javascript";
                  mainScript.src =
                    "//www.highperformanceformat.com/1123eee015220ba1dacddd14ea04a988/invoke.js";
                  el.appendChild(mainScript);
                }
              }}
            />
            <div
              className="hidden lg:block w-[300px] h-[250px] mx-auto"
              ref={(el) => {
                if (el && !el.hasChildNodes()) {
                  // Script para opções
                  const optionsScript = document.createElement("script");
                  optionsScript.type = "text/javascript";
                  optionsScript.innerHTML = `
                  atOptions = { 
                    'key' : '1123eee015220ba1dacddd14ea04a988', 
                    'format' : 'iframe', 
                    'height' : 250, 
                    'width' : 300, 
                    'params' : {} 
                  };
                `;
                  el.appendChild(optionsScript);

                  // Script principal
                  const mainScript = document.createElement("script");
                  mainScript.type = "text/javascript";
                  mainScript.src =
                    "//www.highperformanceformat.com/1123eee015220ba1dacddd14ea04a988/invoke.js";
                  el.appendChild(mainScript);
                }
              }}
            />
          </>
        )}
      </div>
    );
  };

  const renderSmallBannerAd = (index = "small-banner") => (
    <div id={`banner-container-${index}`} className="my-2 flex justify-center">
      <div
        className="w-[320px] h-[50px] mx-auto"
        ref={(el) => {
          if (el && !el.hasChildNodes()) {
            // Script para opções
            const optionsScript = document.createElement("script");
            optionsScript.type = "text/javascript";
            optionsScript.innerHTML = `
            atOptions = {
              'key' : '732cb0029d49dc889b19b61d2ccc0786',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `;
            el.appendChild(optionsScript);

            // Script principal
            const mainScript = document.createElement("script");
            mainScript.type = "text/javascript";
            mainScript.src =
              "//www.highperformanceformat.com/732cb0029d49dc889b19b61d2ccc0786/invoke.js";
            el.appendChild(mainScript);
          }
        }}
      />
    </div>
  );

  // Componente para FullPage.js
  return (
    <div className="bg-[#2c1810] text-[#e1d6b9]">
      {/* Notificação de link copiado */}
      {showCopiedNotification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#8b5a2b] text-white px-4 py-2 rounded-full shadow-lg z-50"
        >
          Link copiado!
        </motion.div>
      )}

      {/* Indicadores de navegação (pontos) */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center space-y-1">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            type="button"
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            onClick={() => navigateTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              currentSection === index
                ? "bg-[#cd7f32] w-3 h-3"
                : sectionCompleted[index]
                ? "bg-[#e1d6b9]/50 hover:bg-[#e1d6b9]/70"
                : "bg-[#e1d6b9]/20"
            }`}
            disabled={
              !sectionCompleted[index] &&
              index !== currentSection &&
              index > currentSection
            }
            aria-label={`Ir para seção ${index + 1}`}
          />
        ))}
      </div>

      <ReactFullpage
        licenseKey={"YOUR_KEY_HERE"} // Substituir pela sua licença ou usar versão gratuita
        scrollingSpeed={700}
        onLeave={(origin, destination, _direction) => {
          const canNavigate =
            destination.index < origin.index ||
            sectionCompleted[origin.index] ||
            origin.index === 0 ||
            origin.index === totalSections - 1 ||
            (unlocked && origin.index === totalSections - 2);

          if (!canNavigate) {
            return false;
          }

          setCurrentSection(destination.index);
          setMetrics((prev) => ({
            ...prev,
            viewedSections: Math.max(
              prev.viewedSections,
              destination.index + 1
            ),
          }));
        }}
        render={({ fullpageApi }) => {
          // Armazena a referência da API para uso em outros lugares
          if (fullpageApi && !fullpageApiRef.current) {
            fullpageApiRef.current = fullpageApi;
          }

          return (
            <ReactFullpage.Wrapper>
              {/* SEÇÃO INICIAL */}
              <div className="section bg-[#2c1810]">
                <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
                  <div className="max-w-sm md:max-w-5xl text-center w-full">
                    {/* Barra de progresso */}
                    {/* <motion.div
                      className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                    >
                      <motion.div
                        className={`h-full rounded-full ${
                          calculateProgress() === 100
                            ? "progress-complete bg-green-400"
                            : ""
                        }`}
                        initial={{ width: `${calculateProgress()}%` }}
                        animate={{
                          width: `${calculateProgress()}%`,
                          backgroundColor:
                            calculateProgress() === 100
                              ? "#4ade80"
                              : getCurrentLevelColor(),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div> */}

                    <motion.div
                      className="inline-flex items-center justify-center mb-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="https://i.ibb.co/KpF7CjKN/Chat-GPT-Image-10-de-mai-de-2025-00-22-43.png"
                        alt="Chocolate bar"
                        className="h-16 w-16 mr-2"
                      />
                      <span className="text-2xl font-bold ml-2">chc.lat</span>
                    </motion.div>

                    <motion.h1
                      className="mt-4 text-xl font-light text-center text-[#e1d6b9]/80"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      Continue rolando para acessar seu link
                    </motion.h1>

                    <motion.p
                      className="mt-2 text-sm text-[#e1d6b9]/60"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      Aguarde alguns segundos em cada etapa
                    </motion.p>

                    {/* Container para banners em formato responsivo */}
                    {renderBannerAdContainer(0, isMobile)}

                    {/* Botão centralizado com animação */}
                    <motion.div
                      className="flex justify-center w-full mt-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <motion.button
                        onClick={() => fullpageApi.moveSectionDown()}
                        className="flex items-center justify-center p-3 rounded-full border border-[#cd7f32]/30 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 cursor-pointer transition-all"
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                          y: {
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <ChevronDown size={24} className="text-[#cd7f32]" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* SEÇÕES DE NÍVEL (GERADAS DINAMICAMENTE) */}
              {Array.from({ length: totalLevels }).map((_, index) => {
                const sectionIndex = index + 1;
                return (
                  <div
                    key={`level-${sectionIndex}`}
                    className="section bg-[#2c1810]"
                  >
                    <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
                      <div className="w-full max-w-xs mx-auto flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center 
                              ${
                                sectionCompleted[sectionIndex]
                                  ? "bg-green-400/20"
                                  : "bg-[#cd7f32]/20"
                              }`}
                          >
                            <Award
                              size={14}
                              className={
                                sectionCompleted[sectionIndex]
                                  ? "text-green-400"
                                  : "text-[#cd7f32]"
                              }
                            />
                          </div>
                          <span className="text-xs">
                            Nível {sectionIndex}/{totalLevels}
                          </span>
                        </div>

                        <div
                          className={`flex items-center bg-[#3b1e0e] px-3 py-1 rounded-full 
                            ${
                              sectionCompleted[sectionIndex]
                                ? "border border-green-400/30"
                                : ""
                            }`}
                        >
                          {sectionCompleted[sectionIndex] ? (
                            <>
                              <Check
                                size={14}
                                className="text-green-400 mr-1"
                              />
                              <span className="text-xs text-green-400">
                                Completo
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock
                                size={14}
                                className="text-[#cd7f32] mr-1"
                              />
                              <span className="text-xs font-mono">
                                {currentSection === sectionIndex
                                  ? currentSectionTime
                                  : SECTION_TIMER}
                                s
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Número de nível */}
                      {/* <motion.div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4
                          ${
                            sectionCompleted[sectionIndex]
                              ? "border-2 border-green-400"
                              : "border-2"
                          }`}
                        style={{
                          backgroundColor: sectionCompleted[sectionIndex]
                            ? "#00800020"
                            : `${levelColors[sectionIndex]}20`,
                          borderColor: sectionCompleted[sectionIndex]
                            ? "#4ade80"
                            : levelColors[sectionIndex],
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span
                          className={`text-base font-bold ${
                            sectionCompleted[sectionIndex]
                              ? "text-green-400"
                              : ""
                          }`}
                        >
                          {sectionIndex}
                        </span>
                      </motion.div> */}

                      <div className="max-w-lg mx-auto w-full text-center">
                        {/* Banner ad para cada nível */}
                        {renderBannerAdContainer(sectionIndex, false)}

                        {/* Banner ad stepPhrases */}
                        <motion.p
                          className="text-center text-[#e1d6b9]/80 italic mb-4 text-lg"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          {stepPhrases[sectionIndex % stepPhrases.length]}
                        </motion.p>

                        {/* Barra de progresso para a seção atual */}
                        <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full transition-all duration-300 ease-out 
                              ${
                                sectionCompleted[sectionIndex]
                                  ? "bg-green-400"
                                  : ""
                              }`}
                            initial={{
                              width: sectionCompleted[sectionIndex]
                                ? "100%"
                                : "0%",
                            }}
                            animate={{
                              width: sectionCompleted[sectionIndex]
                                ? "100%"
                                : currentSection === sectionIndex
                                ? `${
                                    100 -
                                    (currentSectionTime / SECTION_TIMER) * 100
                                  }%`
                                : "0%",
                            }}
                            transition={{ duration: 0.5 }}
                            style={{
                              backgroundColor: sectionCompleted[sectionIndex]
                                ? "#4ade80"
                                : levelColors[sectionIndex],
                            }}
                          />
                        </div>

                        <div className="flex justify-center gap-3 w-full">
                          {/* Botão para voltar */}
                          <motion.button
                            onClick={() => fullpageApi.moveSectionUp()}
                            className="mt-4 flex items-center justify-center p-3 rounded-full border border-[#e1d6b9]/20 bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 cursor-pointer transition-all"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <ChevronUp
                              size={20}
                              className="text-[#e1d6b9]/70"
                            />
                          </motion.button>

                          {/* Botão para avançar */}
                          <motion.button
                            onClick={() =>
                              sectionCompleted[sectionIndex] &&
                              fullpageApi.moveSectionDown()
                            }
                            disabled={!sectionCompleted[sectionIndex]}
                            className={`mt-4 flex items-center justify-center p-3 rounded-full border transition-all ${
                              sectionCompleted[sectionIndex]
                                ? "bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 border-[#cd7f32]/30 cursor-pointer"
                                : "bg-[#3b1e0e]/50 border-[#3b1e0e]/30 cursor-not-allowed"
                            }`}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          >
                            <ChevronDown
                              size={20}
                              className={
                                sectionCompleted[sectionIndex]
                                  ? "text-[#cd7f32]"
                                  : "text-[#e1d6b9]/30"
                              }
                            />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SEÇÃO FINAL COM O LINK */}
              <div className="section bg-[#2c1810]">
                <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
                  <div className="max-w-md mx-auto text-center">
                    <motion.div
                      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                        unlocked
                          ? "border-4 border-green-500/40"
                          : "border-4 border-[#cd7f32]/40"
                      }`}
                      style={{
                        backgroundColor: unlocked ? "#00800020" : "#cd7f3220",
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {unlocked ? (
                        <Gift size={24} className="text-green-400" />
                      ) : (
                        <Lock size={24} className="text-[#cd7f32]" />
                      )}
                    </motion.div>

                    <motion.h2
                      className="text-2xl font-medium mb-6"
                      style={{ color: unlocked ? "#4ade80" : "#cd7f32" }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {unlocked ? "Link Desbloqueado!" : "Quase lá..."}
                    </motion.h2>

                    {/* Container para anúncios */}
                    {renderBannerAdContainer(totalLevels + 1, isMobile)}

                    {unlocked ? (
                      <motion.div
                        className="space-y-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <p className="text-[#e1d6b9]/80 mb-6">
                          Obrigado pela sua paciência! Seu link está pronto para
                          acesso.
                        </p>
                        <motion.a
                          href={destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#cd7f32] rounded-full text-white font-medium transition-all hover:bg-[#8b5a2b] text-lg shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Acessar link <ExternalLink size={20} />
                        </motion.a>
                        <div className="flex justify-center gap-4 mt-6">
                          <motion.button
                            onClick={handleCopyLink}
                            className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-full text-[#e1d6b9] text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.15)]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Copy size={16} className="mr-1" /> Copiar
                          </motion.button>
                          <motion.button
                            onClick={handleShareLink}
                            className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-full text-[#e1d6b9] text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.15)]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 size={16} className="mr-1" /> Compartilhar
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <p className="text-[#e1d6b9]/80 mb-6">
                          Complete todas as etapas anteriores para desbloquear
                          seu link.
                        </p>
                        <div className="flex flex-col gap-3 text-sm mb-6 max-w-xs mx-auto">
                          <div
                            className={`flex items-center ${
                              sectionCompleted
                                .slice(1, totalSections - 2)
                                .every(Boolean)
                                ? "text-green-400"
                                : "text-[#e1d6b9]/60"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                                sectionCompleted
                                  .slice(1, totalSections - 2)
                                  .every(Boolean)
                                  ? "bg-green-400/20 text-green-400"
                                  : "bg-[#e1d6b9]/10"
                              }`}
                            >
                              {sectionCompleted
                                .slice(1, totalSections - 2)
                                .every(Boolean)
                                ? "✓"
                                : "1"}
                            </div>
                            <div className="flex-1">
                              Passar por todas as etapas
                            </div>
                          </div>
                          <div
                            className={`flex items-center ${
                              currentSection >= totalSections - 2
                                ? "text-green-400"
                                : "text-[#e1d6b9]/60"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                                currentSection >= totalSections - 2
                                  ? "bg-green-400/20 text-green-400"
                                  : "bg-[#e1d6b9]/10"
                              }`}
                            >
                              {currentSection >= totalSections - 2 ? "✓" : "2"}
                            </div>
                            <div className="flex-1">Chegar à etapa final</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[#e1d6b9]/50 font-medium cursor-not-allowed"
                          style={{
                            backgroundColor: "#3b1e0e",
                            borderColor: "#8b5a2b30",
                            borderWidth: "1px",
                          }}
                        >
                          <Lock size={16} /> Link bloqueado
                        </button>
                      </motion.div>
                    )}

                    {/* Botões de navegação */}
                    <div className="mt-8 flex justify-center gap-3">
                      {/* Botão para voltar */}
                      <motion.button
                        onClick={() => fullpageApi.moveSectionUp()}
                        className="flex items-center justify-center bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 p-2 rounded-full border border-[#e1d6b9]/20 transition-all cursor-pointer"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <ChevronUp size={24} className="text-[#e1d6b9]" />
                      </motion.button>

                      {/* Seta para o rodapé */}
                      <motion.button
                        onClick={() => fullpageApi.moveSectionDown()}
                        className="flex items-center justify-center bg-[#cd7f32]/10 hover:bg-[#cd7f32]/20 p-2 rounded-full border border-[#cd7f32]/20 transition-all cursor-pointer"
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <ChevronDown size={24} className="text-[#cd7f32]" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RODAPÉ */}
              <div className="section bg-[#21130a]">
                <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
                  <div className="max-w-md mx-auto text-center">
                    <motion.div
                      className="mb-4"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="inline-flex items-center justify-center">
                        <img
                          src="https://i.ibb.co/KpF7CjKN/Chat-GPT-Image-10-de-mai-de-2025-00-22-43.png"
                          alt="Chocolate bar"
                          className="h-10 w-10 mr-2"
                        />
                        <span className="text-xl font-bold ml-2">chc.lat</span>
                      </div>
                      <p className="mt-2 text-sm text-[#e1d6b9]/60">
                        Encurtador com monetização
                      </p>
                    </motion.div>

                    {/* Container para anúncios */}
                    {renderBannerAdContainer(totalLevels + 2, isMobile)}

                    {/* Estatísticas simplificadas */}
                    <motion.div
                      className="bg-[#3b1e0e] rounded-lg p-4 mb-4 border border-[#cd7f32]/20"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <h3 className="text-[#cd7f32] text-lg mb-2">
                        Estatísticas
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.timeSpent}
                          </div>
                          <div className="text-xs text-[#e1d6b9]/60">
                            Segundos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.viewedSections}
                          </div>
                          <div className="text-xs text-[#e1d6b9]/60">
                            Etapas
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Links do footer */}
                    <motion.div
                      className="flex justify-center gap-4 text-xs text-[#e1d6b9]/60"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
                      <a href="#" className="hover:text-[#cd7f32]">
                        Termos
                      </a>
                      <span>|</span>
                      {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
                      <a href="#" className="hover:text-[#cd7f32]">
                        Privacidade
                      </a>
                      <span>|</span>
                      {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
                      <a href="#" className="hover:text-[#cd7f32]">
                        Contato
                      </a>
                    </motion.div>

                    <motion.p
                      className="mt-4 text-xs text-[#e1d6b9]/40"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      © 2025 CHC.LAT
                    </motion.p>

                    <div className="flex gap-x-2 items-center justify-center mt-4">
                      {/* Botão para voltar */}
                      {unlocked && (
                        <motion.button
                          onClick={() => navigateTo(totalSections - 2)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 rounded-full text-[#e1d6b9] text-xs font-medium transition-all"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Voltar ao link</span>
                          <ChevronUp size={14} />
                        </motion.button>
                      )}
                      {/* Botão para voltar à seção anterior */}
                      <motion.button
                        onClick={() => fullpageApi.moveSectionUp()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 rounded-full text-[#e1d6b9] text-xs font-medium transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <ChevronUp size={14} className="text-[#e1d6b9]" />
                        <span>Voltar</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
        credits={{
          enabled: undefined,
          label: undefined,
          position: undefined,
        }}
      />
    </div>
  );
}
