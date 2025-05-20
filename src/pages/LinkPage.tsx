import React, { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

export default function ChocolateAdPage() {
  // Estados principais
  const [unlocked, setUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(13); // Total de 13 seções (1 inicial + 10 níveis + 1 link + 1 footer)
  const [tabActive, setTabActive] = useState(true);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [direction, setDirection] = useState(null); // 'up' ou 'down'
  const [isNavigating, setIsNavigating] = useState(false);

  // Estado para controlar quanto tempo o usuário permaneceu em cada seção
  const SECTION_TIMER = 3; // 3 segundos por seção
  const [sectionTimers, setSectionTimers] = useState(
    Array(totalSections).fill(SECTION_TIMER)
  );
  const [sectionCompleted, setSectionCompleted] = useState(
    Array(totalSections).fill(false)
  );

  // Primeiro snap (apresentação) e último snap (footer) já começam completos
  useEffect(() => {
    const initialCompleted = [...sectionCompleted];
    initialCompleted[0] = true;
    initialCompleted[totalSections - 1] = true;
    setSectionCompleted(initialCompleted);
  }, []);

  const [currentSectionTime, setCurrentSectionTime] = useState(SECTION_TIMER);

  const [metrics, setMetrics] = useState({
    viewedSections: 0,
    timeSpent: 0,
    startTime: Date.now(),
  });

  // Referências
  const pageRef = useRef(null);
  const sectionRefs = useRef([]);
  const confettiRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const adLoadedRef = useRef(Array(totalSections).fill(false));

  // Destino final (normalmente viria de um parâmetro de URL)
  const destinationUrl = "https://destino.exemplo.com";

  // Frases para as etapas - reduzidas para ficarem mais diretas
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

  // Cores para os níveis (para gamificação visual)
  const levelColors = [
    "#cd7f32", // Bronze/cobre
    "#cd7f32",
    "#d4af37", // Dourado
    "#d4af37",
    "#7ab8cc", // Azul claro
    "#7ab8cc",
    "#9ee493", // Verde claro
    "#9ee493",
    "#a67db8", // Roxo
    "#a67db8",
    "#ff9a76", // Laranja/Pêssego
    "#ff9a76",
  ];

  // Define corretamente o número total de níveis - exatamente 10 níveis
  const totalLevels = 10;

  // Variantes de animação
  const pageVariants = {
    initial: (direction) => ({
      y: direction === "up" ? "-100vh" : "100vh",
      opacity: 0,
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    },
    exit: (direction) => ({
      y: direction === "up" ? "100vh" : "-100vh",
      opacity: 0,
      transition: { type: "tween", duration: 0.3, ease: "easeIn" },
    }),
  };

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

  // Função para acionar o carregamento de um anúncio específico
  const loadAd = (index) => {
    if (adLoadedRef.current[index]) return; // Não carrega novamente se já foi carregado

    if (window.native_request && window.setupAd && window.zoneNativeSett) {
      try {
        const containerId = `awn-z9952262-${index + 1}`;
        const container = document.getElementById(containerId);

        if (container) {
          // Marcar anúncio como carregado
          const newAdLoaded = [...adLoadedRef.current];
          newAdLoaded[index] = true;
          adLoadedRef.current = newAdLoaded;

          // Criar nova solicitação de anúncio
          const newZone = new window.native_request(
            "//" + window.zoneNativeSett.baseUrl + "?nwpsv=1&",
            window.zoneNativeSett.r[0]
          );

          newZone.build();
          newZone.jsonp("callback", function (e) {
            window.setupAd(containerId, e);
          });

          console.log(`Ad request sent for container ${containerId}`);
        }
      } catch (error) {
        console.error(`Error loading ad in section ${index}:`, error);
      }
    } else {
      console.log("Ad scripts not loaded yet, retrying in 500ms");
      setTimeout(() => loadAd(index), 500);
    }
  };

  // Efeito para acionar o carregamento de anúncios quando a seção muda
  useEffect(() => {
    // Carregar anúncio para a seção atual
    setTimeout(() => {
      loadAd(currentSection);
    }, 300);
  }, [currentSection]);

  // Configura o temporizador para cada seção
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

  // Configura o comportamento de toque
  useEffect(() => {
    // Evita comportamentos de scroll padrão
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  // Verifica se todas as condições para desbloquear o link foram atendidas
  useEffect(() => {
    // Verifica se o usuário chegou na penúltima seção e completou todas as seções anteriores
    if (currentSection === totalSections - 2) {
      // Verifica se todas as seções intermediárias (1 até totalSections-3) estão completas
      const allPreviousSectionsCompleted = sectionCompleted
        .slice(1, totalSections - 2)
        .every(Boolean);

      if (allPreviousSectionsCompleted && !unlocked) {
        setUnlocked(true);
        setShowConfetti(true);

        // Dispara o confetti
        if (confettiRef.current) {
          // Configuração do confetti
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 100,
          };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Confetti em várias cores relacionadas ao chocolate
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
          }, 250);

          // Esconde o confetti após a duração determinada
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

  // Calcula a porcentagem geral de progresso
  const calculateProgress = () => {
    // Contamos apenas as seções intermediárias (1 até totalSections-3) para o progresso
    const completedSections = sectionCompleted
      .slice(1, totalSections - 2)
      .filter(Boolean).length;
    return Math.floor((completedSections / totalLevels) * 100);
  };

  // Retorna a cor do nível atual para gamificação
  const getCurrentLevelColor = () => {
    return levelColors[Math.min(currentSection, levelColors.length - 1)];
  };

  // Funções para navegação entre seções com animação
  const navigateTo = (targetIndex) => {
    // Evita navegação durante animação
    if (isNavigating) return;

    // Verifica se podemos navegar para a próxima seção
    const canNavigate =
      // Permitir navegar para trás sempre
      targetIndex < currentSection ||
      // Permitir navegar para frente apenas se a seção atual estiver completa
      sectionCompleted[currentSection] ||
      // Exceções para primeira e última seção
      currentSection === 0 ||
      currentSection === totalSections - 1 ||
      // Exceção para a seção de link desbloqueada
      (unlocked && currentSection === totalSections - 2);

    if (!canNavigate) return;

    // Define a direção da animação
    setDirection(targetIndex > currentSection ? "down" : "up");

    // Inicia a animação
    setIsNavigating(true);

    // Atualiza a seção atual após um pequeno delay para a animação
    setTimeout(() => {
      setCurrentSection(targetIndex);
      setIsNavigating(false);

      // Atualiza métricas
      setMetrics((prev) => ({
        ...prev,
        viewedSections: Math.max(prev.viewedSections, targetIndex + 1),
      }));
    }, 150); // Delay menor para animação mais rápida
  };

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      navigateTo(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      navigateTo(currentSection - 1);
    }
  };

  // Manipuladores de eventos para gestos de toque
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    // Impede comportamento padrão para evitar scroll nativo
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientY);

    const distance = touchStart - touchEnd;

    // Detecta a direção do swipe (mínimo de 70px para considerar um swipe)
    if (Math.abs(distance) > 70) {
      if (distance > 0) {
        // Swipe para cima - próxima seção
        nextSection();
      } else {
        // Swipe para baixo - seção anterior
        prevSection();
      }
    }
  };

  // Gerenciador de roda do mouse
  const handleWheel = (e) => {
    // Pequeno debounce para evitar ativações múltiplas
    if (pageRef.current && !pageRef.current.wheelTimeout) {
      pageRef.current.wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling para baixo
          nextSection();
        } else {
          // Scrolling para cima
          prevSection();
        }
        pageRef.current.wheelTimeout = null;
      }, 50);
    }
  };

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 bg-[#2c1810] text-[#e1d6b9] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <style jsx global>{`
        body {
          overflow: hidden;
          touch-action: none;
          overscroll-behavior: none;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
        }

        .subtle-pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes completedPulse {
          0%,
          100% {
            box-shadow: 0 0 8px 0 rgba(74, 222, 128, 0.3);
          }
          50% {
            box-shadow: 0 0 15px 2px rgba(74, 222, 128, 0.5);
          }
        }

        .completed-pulse {
          animation: completedPulse 2s ease-in-out infinite;
        }

        @keyframes progressComplete {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .progress-complete {
          animation: progressComplete 0.5s ease-out;
        }

        /* Estilos personalizados para containers de anúncios */
        .ad-container {
          min-height: 250px;
          margin: 1rem auto;
          width: 100%;
          max-width: 320px;
        }
      `}</style>

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

      {/* Todos os containers de anúncios - sempre presentes no DOM */}
      <div
        className="fixed opacity-0"
        style={{ pointerEvents: "none", zIndex: -1 }}
      >
        {Array.from({ length: totalSections }).map((_, index) => (
          <div
            key={`hidden-ad-${index + 1}`}
            id={`awn-z9952262-${index + 1}`}
            className="ad-container"
          ></div>
        ))}
      </div>

      {/* Indicadores de navegação (pontos) */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center space-y-1">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
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

      {/* Container principal com AnimatePresence para transições */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSection}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full w-full flex items-center justify-center relative"
        >
          {/* SEÇÃO INICIAL */}
          {currentSection === 0 && (
            <div className="h-full w-full flex flex-col items-center justify-center p-4 section">
              <div className="max-w-md mx-auto text-center">
                {/* Barra de progresso incorporada ao design */}
                <motion.div
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
                </motion.div>

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

                {/* Container de anúncio visível */}
                <div className="ad-container" style={{ visibility: "visible" }}>
                  <div id={`awn-z9952262-1`}></div>
                </div>

                {/* Botão centralizado com animação */}
                <motion.div
                  className="flex justify-center w-full mt-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.button
                    onClick={nextSection}
                    className="mt-4 flex items-center justify-center p-3 rounded-full border border-[#cd7f32]/30 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 cursor-pointer transition-all"
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                      y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    }}
                  >
                    <ChevronDown size={24} className="text-[#cd7f32]" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          )}

          {/* SEÇÕES DE NÍVEL (GERADAS DINAMICAMENTE) */}
          {currentSection >= 1 && currentSection <= totalSections - 3 && (
            <div className="h-dvh w-full flex flex-col items-center justify-center p-4 section">
              <div className="w-full max-w-xs mx-auto flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${
                        sectionCompleted[currentSection]
                          ? "bg-green-400/20 completed-pulse"
                          : "bg-[#cd7f32]/20"
                      }`}
                  >
                    <Award
                      size={14}
                      className={
                        sectionCompleted[currentSection]
                          ? "text-green-400"
                          : "text-[#cd7f32]"
                      }
                    />
                  </div>
                  <span className="text-xs">
                    Nível {currentSection}/{totalLevels}
                  </span>
                </div>

                <div
                  className={`flex items-center bg-[#3b1e0e] px-3 py-1 rounded-full 
                    ${
                      sectionCompleted[currentSection]
                        ? "border border-green-400/30"
                        : ""
                    }`}
                >
                  {sectionCompleted[currentSection] ? (
                    <>
                      <Check size={14} className="text-green-400 mr-1" />
                      <span className="text-xs text-green-400">Completo</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} className="text-[#cd7f32] mr-1" />
                      <span className="text-xs font-mono">
                        {currentSectionTime}s
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Número de nível - elemento de gamificação */}
              <motion.div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4
                  ${
                    sectionCompleted[currentSection]
                      ? "border-2 border-green-400 completed-pulse"
                      : "border-2 subtle-pulse"
                  }`}
                style={{
                  backgroundColor: sectionCompleted[currentSection]
                    ? "#00800020"
                    : `${getCurrentLevelColor()}20`,
                  borderColor: sectionCompleted[currentSection]
                    ? "#4ade80"
                    : getCurrentLevelColor(),
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className={`text-base font-bold ${
                    sectionCompleted[currentSection] ? "text-green-400" : ""
                  }`}
                >
                  {currentSection}
                </span>
              </motion.div>

              <div className="max-w-lg mx-auto w-full text-center">
                <motion.p
                  className="text-center text-[#e1d6b9]/80 italic mb-4 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {stepPhrases[currentSection % stepPhrases.length]}
                </motion.p>

                {/* Container de anúncio para a seção atual */}
                <motion.div
                  className="my-4 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div
                    className="ad-container"
                    style={{ visibility: "visible" }}
                  >
                    <div id={`awn-z9952262-${currentSection + 1}`}></div>
                  </div>
                </motion.div>

                {/* Barra de progresso para a seção atual */}
                <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-300 ease-out 
                      ${
                        sectionCompleted[currentSection] ? "bg-green-400" : ""
                      }`}
                    initial={{
                      width: sectionCompleted[currentSection] ? "100%" : "0%",
                    }}
                    animate={{
                      width: sectionCompleted[currentSection]
                        ? "100%"
                        : `${
                            100 - (currentSectionTime / SECTION_TIMER) * 100
                          }%`,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      backgroundColor: sectionCompleted[currentSection]
                        ? "#4ade80"
                        : getCurrentLevelColor(),
                    }}
                  />
                </div>

                <div className="flex justify-center gap-3 w-full">
                  {/* Botão para voltar */}
                  <motion.button
                    onClick={prevSection}
                    className="mt-4 flex items-center justify-center p-3 rounded-full border border-[#e1d6b9]/20 bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 cursor-pointer transition-all"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <ChevronUp size={20} className="text-[#e1d6b9]/70" />
                  </motion.button>

                  {/* Botão para avançar */}
                  <motion.button
                    onClick={nextSection}
                    disabled={!sectionCompleted[currentSection]}
                    className={`mt-4 flex items-center justify-center p-3 rounded-full border transition-all ${
                      sectionCompleted[currentSection]
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
                        sectionCompleted[currentSection]
                          ? "text-[#cd7f32]"
                          : "text-[#e1d6b9]/30"
                      }
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO FINAL COM O LINK */}
          {currentSection === totalSections - 2 && (
            <div className="h-dvh w-full flex flex-col items-center justify-center p-4 section">
              <div className="max-w-md mx-auto text-center">
                {/* Barra de progresso */}
                <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      unlocked ? "progress-complete" : ""
                    }`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: unlocked ? "100%" : "0%",
                      backgroundColor: unlocked
                        ? "#4ade80"
                        : getCurrentLevelColor(),
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <motion.div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                    unlocked
                      ? "border-4 border-green-500/40 completed-pulse"
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
                    <Gift size={32} className="text-green-400" />
                  ) : (
                    <Lock size={32} className="text-[#cd7f32]" />
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

                {/* Container de anúncio para a seção de link */}
                <motion.div
                  className="my-4 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div
                    className="ad-container"
                    style={{ visibility: "visible" }}
                  >
                    <div id={`awn-z9952262-${totalSections - 1}`}></div>
                  </div>
                </motion.div>

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
                      Complete todas as etapas anteriores para desbloquear seu
                      link.
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
                        <div className="flex-1">Passar por todas as etapas</div>
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
                    onClick={prevSection}
                    className="flex items-center justify-center bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 p-2 rounded-full border border-[#e1d6b9]/20 transition-all cursor-pointer"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <ChevronUp size={16} className="text-[#e1d6b9]" />
                  </motion.button>

                  {/* Seta para o rodapé */}
                  <motion.button
                    onClick={nextSection}
                    className="flex items-center justify-center bg-[#cd7f32]/10 hover:bg-[#cd7f32]/20 p-2 rounded-full border border-[#cd7f32]/20 transition-all cursor-pointer"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <ChevronDown size={16} className="text-[#cd7f32]" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* RODAPÉ */}
          {currentSection === totalSections - 1 && (
            <div className="h-dvh w-full flex flex-col items-center justify-center p-4 section bg-[#21130a]">
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

                {/* Container de anúncio para o rodapé */}
                <motion.div
                  className="my-4 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div
                    className="ad-container"
                    style={{ visibility: "visible" }}
                  >
                    <div id={`awn-z9952262-${totalSections}`}></div>
                  </div>
                </motion.div>

                {/* Estatísticas simplificadas */}
                <motion.div
                  className="bg-[#3b1e0e] rounded-lg p-4 mb-4 border border-[#cd7f32]/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h3 className="text-[#cd7f32] text-lg mb-2">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {metrics.timeSpent}
                      </div>
                      <div className="text-xs text-[#e1d6b9]/60">Segundos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {metrics.viewedSections}
                      </div>
                      <div className="text-xs text-[#e1d6b9]/60">Etapas</div>
                    </div>
                  </div>
                </motion.div>

                {/* Links do footer - simplificados */}
                <motion.div
                  className="flex justify-center gap-4 text-xs text-[#e1d6b9]/60"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <a href="#" className="hover:text-[#cd7f32]">
                    Termos
                  </a>
                  <span>|</span>
                  <a href="#" className="hover:text-[#cd7f32]">
                    Privacidade
                  </a>
                  <span>|</span>
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

                {/* Botão para voltar */}
                {unlocked && (
                  <motion.button
                    onClick={() => navigateTo(totalSections - 2)}
                    className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 rounded-full text-[#e1d6b9] text-xs font-medium transition-all"
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
                  onClick={prevSection}
                  className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#e1d6b9]/10 hover:bg-[#e1d6b9]/20 rounded-full text-[#e1d6b9] text-xs font-medium transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <ChevronUp size={14} className="text-[#e1d6b9]" />
                  <span>Voltar</span>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
