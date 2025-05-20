import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Lock,
  ExternalLink,
  ChevronDown,
  Copy,
  Share2,
  Award,
  Gift,
  Check,
} from "lucide-react";

export default function ChocolateAdPage() {
  // Estados principais
  const [unlocked, setUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(13); // Ajustado para 13 seções totais
  const [tabActive, setTabActive] = useState(true);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Estado para bloquear scroll
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  // Referências
  const mainContainerRef = useRef(null);
  const sectionsRef = useRef([]);
  const confettiRef = useRef(null);
  const timerIntervalRef = useRef(null);

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

  // Define corretamente o número total de níveis
  // Temos 10 níveis no total (do snap 1 ao 10)
  const totalLevels = 10;

  // Bloquear ou desbloquear scroll com base na seção atual
  useEffect(() => {
    // Se a seção atual está completa ou é a primeira/última seção, permitir scroll
    if (
      sectionCompleted[currentSection] ||
      currentSection === 0 ||
      currentSection === totalSections - 1 ||
      (unlocked && currentSection === totalSections - 2)
    ) {
      setIsScrollLocked(false);
    } else {
      // Caso contrário, bloquear scroll até que o timer seja concluído
      setIsScrollLocked(true);
    }
  }, [currentSection, sectionCompleted, unlocked]);

  // Aplicar bloqueio de scroll quando necessário
  useEffect(() => {
    const container = mainContainerRef.current;

    // Função para impedir scroll
    const preventScroll = (e) => {
      if (isScrollLocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Funções para impedir swipe/touch scroll no mobile
    const preventTouchMove = (e) => {
      if (isScrollLocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (container) {
      if (isScrollLocked) {
        container.style.overflow = "hidden";
        container.addEventListener("wheel", preventScroll, { passive: false });
        container.addEventListener("touchmove", preventTouchMove, {
          passive: false,
        });
      } else {
        container.style.overflow = "auto";
        container.removeEventListener("wheel", preventScroll);
        container.removeEventListener("touchmove", preventTouchMove);
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", preventScroll);
        container.removeEventListener("touchmove", preventTouchMove);
      }
    };
  }, [isScrollLocked]);

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

  // Configura o temporizador para cada seção
  useEffect(() => {
    // Limpa o intervalo existente
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
            // Se o timer chegou a zero, limpa o intervalo e marca a seção como concluída
            clearInterval(timerIntervalRef.current);

            // Atualiza o array de seções completadas
            const newCompletedSections = [...sectionCompleted];
            newCompletedSections[currentSection] = true;
            setSectionCompleted(newCompletedSections);

            // Desbloquear scroll quando o timer termina
            setIsScrollLocked(false);

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

  // Configura o rastreamento de seções
  useEffect(() => {
    if (mainContainerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionIndex = parseInt(entry.target.dataset.index);

              // Atualiza a seção atual
              setCurrentSection(sectionIndex);

              // Incrementa métricas apenas uma vez por seção
              setMetrics((prev) => ({
                ...prev,
                viewedSections: Math.max(prev.viewedSections, sectionIndex + 1),
              }));
            }
          });
        },
        {
          threshold: 0.7, // 70% da seção deve estar visível (aumentado para melhor precisão)
          rootMargin: "-5% 0px", // Margem menor para detecção mais precisa
        }
      );

      // Observa cada seção
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.observe(section);
        }
      });

      return () => {
        sectionsRef.current.forEach((section) => {
          if (section) {
            observer.unobserve(section);
          }
        });
      };
    }
  }, []);

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
  useEffect(() => {
    // Verifica se o usuário chegou na penúltima seção e completou todas as seções anteriores
    if (currentSection === totalSections - 2) {
      // Verifica se todas as seções intermediárias (1 até totalSections-3) estão completas
      const allPreviousSectionsCompleted = sectionCompleted
        .slice(1, totalSections - 2)
        .every(Boolean);

      if (allPreviousSectionsCompleted && !unlocked) {
        setUnlocked(true);
        setIsScrollLocked(false); // Garantir que o scroll está liberado
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
    const totalIntermediateSections = totalLevels; // Usamos o total de níveis definido
    return Math.floor((completedSections / totalIntermediateSections) * 100);
  };

  // Retorna a cor do nível atual para gamificação
  const getCurrentLevelColor = () => {
    return levelColors[Math.min(currentSection, levelColors.length - 1)];
  };

  // Função melhorada para scroll com suporte otimizado para mobile
  const scrollToNextSection = () => {
    // Só permite avançar se o tempo mínimo na seção atual foi cumprido
    if (sectionCompleted[currentSection]) {
      const nextSection = sectionsRef.current[currentSection + 1];
      if (nextSection) {
        // Opção 1: scrollIntoView modificado para funcionamento mais consistente
        setTimeout(() => {
          try {
            nextSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          } catch (err) {
            // Fallback em caso de falha do scrollIntoView
            const topPos = nextSection.offsetTop;
            window.scrollTo({
              top: topPos,
              behavior: "smooth",
            });
          }
        }, 50); // Pequeno atraso para melhorar a confiabilidade no mobile
      }
    }
  };

  return (
    <div
      ref={mainContainerRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#2c1810] text-[#e1d6b9] relative"
      style={{
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarColor: "#8b5a2b #3b1e0e",
      }}
    >
      {/* Estilo global */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #3b1e0e;
        }
        ::-webkit-scrollbar-thumb {
          background: #8b5a2b;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cd7f32;
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
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

        /* Estilos específicos para mobile */
        @media (max-width: 768px) {
          .section {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
          .ad-container {
            margin: 0.75rem 0;
          }
          body {
            touch-action: none; /* Impede comportamentos padrão de toque em mobile */
          }
        }
      `}</style>

      {/* Overlay para bloquear scroll/interação */}
      {isScrollLocked && (
        <div
          className="fixed inset-0 z-30 bg-transparent cursor-not-allowed"
          onClick={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        />
      )}

      {/* Notificação de link copiado */}
      {showCopiedNotification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#8b5a2b] text-white px-4 py-2 rounded-full shadow-lg z-50">
          Link copiado!
        </div>
      )}

      {/* Cabeçalho com logo - primeira "snap section" */}
      <div
        ref={(el) => (sectionsRef.current[0] = el)}
        data-index={0}
        className="h-dvh flex flex-col items-center justify-center p-4 section"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="max-w-md mx-auto text-center">
          {/* Barra de progresso incorporada ao design */}
          <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                calculateProgress() === 100
                  ? "progress-complete bg-green-400"
                  : ""
              }`}
              style={{
                width: `${calculateProgress()}%`,
                backgroundColor:
                  calculateProgress() === 100
                    ? "#4ade80"
                    : getCurrentLevelColor(),
              }}
            ></div>
          </div>

          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="https://i.ibb.co/KpF7CjKN/Chat-GPT-Image-10-de-mai-de-2025-00-22-43.png"
              alt="Chocolate bar"
              className="h-16 w-16 mr-2"
            />
            <span className="text-2xl font-bold ml-2">chc.lat</span>
          </div>

          <h1 className="mt-4 text-xl font-light text-center text-[#e1d6b9]/80">
            Continue rolando para acessar seu link
          </h1>

          <p className="mt-2 text-sm text-[#e1d6b9]/60">
            Aguarde alguns segundos em cada etapa
          </p>

          {/* Botão centralizado com animação de bounce */}
          <div className="flex justify-center w-full mt-10">
            <button
              onClick={scrollToNextSection}
              className="mt-4 animate-bounce flex items-center justify-center p-3 rounded-full border border-[#cd7f32]/30 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 cursor-pointer transition-all"
            >
              <ChevronDown size={24} className="text-[#cd7f32]" />
            </button>
          </div>
        </div>
      </div>

      {/* Gera seções dinamicamente - cada uma com anúncio e frase */}
      {Array.from({ length: totalSections - 3 }).map((_, index) => {
        const sectionIndex = index + 1; // começamos do 1 porque já temos a seção 0
        // IDs CORRIGIDOS - cada seção com ID único de 2 a 11
        const adId = `awn-z9962294-${sectionIndex + 1}`; // +1 porque já usamos o ID 1 no cabeçalho

        return (
          <div
            key={sectionIndex}
            ref={(el) => (sectionsRef.current[sectionIndex] = el)}
            data-index={sectionIndex}
            className="h-dvh flex flex-col items-center justify-center p-4 section relative"
            style={{
              scrollSnapAlign: "start",
              backgroundColor:
                sectionIndex === currentSection
                  ? `${getCurrentLevelColor()}10`
                  : "transparent",
              transition: "background-color 0.5s ease",
            }}
          >
            {/* Temporizador da seção atual e nível incorporados ao design */}
            <div className="w-full max-w-xs mx-auto flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center 
                    ${
                      sectionCompleted[sectionIndex]
                        ? "bg-green-400/20 completed-pulse"
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
            <div
              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4
                ${
                  sectionCompleted[sectionIndex]
                    ? "border-2 border-green-400 completed-pulse"
                    : "border-2 subtle-pulse"
                }`}
              style={{
                backgroundColor: sectionCompleted[sectionIndex]
                  ? "#00800020"
                  : `${getCurrentLevelColor()}20`,
                borderColor: sectionCompleted[sectionIndex]
                  ? "#4ade80"
                  : getCurrentLevelColor(),
              }}
            >
              <span
                className={`text-base font-bold ${
                  sectionCompleted[sectionIndex] ? "text-green-400" : ""
                }`}
              >
                {sectionIndex}
              </span>
            </div>

            <div className="max-w-lg mx-auto w-full text-center">
              <p className="text-center text-[#e1d6b9]/80 italic mb-4 text-lg">
                {stepPhrases[sectionIndex % stepPhrases.length]}
              </p>

              {/* ANÚNCIO EM CADA SEÇÃO COM ID ÚNICO */}
              <div className="my-4 ad-container">
                <div
                  id={adId}
                  className="w-full min-h-[250px] max-w-[320px] mx-auto"
                ></div>
              </div>

              {/* Barra de progresso para a seção atual - sempre visível */}
              <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out 
                    ${
                      sectionCompleted[sectionIndex]
                        ? "bg-green-400 progress-complete"
                        : ""
                    }`}
                  style={{
                    width: sectionCompleted[sectionIndex]
                      ? "100%"
                      : `${100 - (currentSectionTime / SECTION_TIMER) * 100}%`,
                    backgroundColor: sectionCompleted[sectionIndex]
                      ? "#4ade80"
                      : getCurrentLevelColor(),
                  }}
                ></div>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={scrollToNextSection}
                  disabled={!sectionCompleted[sectionIndex]}
                  className={`mt-4 flex items-center justify-center p-3 rounded-full border transition-all ${
                    sectionCompleted[sectionIndex]
                      ? "bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 border-[#cd7f32]/30 cursor-pointer"
                      : "bg-[#3b1e0e]/50 border-[#3b1e0e]/30 cursor-not-allowed"
                  }`}
                >
                  <ChevronDown
                    size={24}
                    className={
                      sectionCompleted[sectionIndex]
                        ? "text-[#cd7f32]"
                        : "text-[#e1d6b9]/30"
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Seção final com o link - penúltima "snap section" */}
      <div
        ref={(el) => (sectionsRef.current[totalSections - 2] = el)}
        data-index={totalSections - 2}
        className="h-dvh flex flex-col items-center justify-center p-4 section"
        style={{
          scrollSnapAlign: "start",
          backgroundColor: unlocked ? "#cd7f3210" : "transparent",
        }}
      >
        <div className="max-w-md mx-auto text-center">
          {/* Barra de progresso sempre completa na página de link */}
          <div className="w-full max-w-xs mx-auto mb-4 bg-[#3b1e0e] rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                unlocked ? "progress-complete" : ""
              }`}
              style={{
                width: unlocked ? "100%" : "0%",
                backgroundColor: unlocked ? "#4ade80" : getCurrentLevelColor(),
              }}
            ></div>
          </div>

          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              unlocked
                ? "border-4 border-green-500/40 completed-pulse"
                : "border-4 border-[#cd7f32]/40"
            }`}
            style={{ backgroundColor: unlocked ? "#00800020" : "#cd7f3220" }}
          >
            {unlocked ? (
              <Gift size={32} className="text-green-400" />
            ) : (
              <Lock size={32} className="text-[#cd7f32]" />
            )}
          </div>

          <h2
            className="text-2xl font-medium mb-6"
            style={{ color: unlocked ? "#4ade80" : "#cd7f32" }}
          >
            {unlocked ? "Link Desbloqueado!" : "Quase lá..."}
          </h2>

          {unlocked ? (
            <div className="space-y-6">
              <p className="text-[#e1d6b9]/80 mb-6">
                Obrigado pela sua paciência! Seu link está pronto para acesso.
              </p>
              <a
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#cd7f32] rounded-full text-white font-medium transition-all hover:bg-[#8b5a2b] text-lg shadow-lg hover:shadow-xl"
              >
                Acessar link <ExternalLink size={20} />
              </a>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-full text-[#e1d6b9] text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.15)]"
                >
                  <Copy size={16} className="mr-1" /> Copiar
                </button>
                <button
                  onClick={handleShareLink}
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-full text-[#e1d6b9] text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.15)]"
                >
                  <Share2 size={16} className="mr-1" /> Compartilhar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[#e1d6b9]/80 mb-6">
                Complete todas as etapas anteriores para desbloquear seu link.
              </p>
              <div className="flex flex-col gap-3 text-sm mb-6 max-w-xs mx-auto">
                <div
                  className={`flex items-center ${
                    sectionCompleted.slice(1, totalSections - 2).every(Boolean)
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
                    {sectionCompleted.slice(1, totalSections - 2).every(Boolean)
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
            </div>
          )}

          {/* Seta para o rodapé */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-xs text-[#e1d6b9]/40 mb-2">Mais informações</p>
            <button
              onClick={() => {
                const footerSection = sectionsRef.current[totalSections - 1];
                if (footerSection) {
                  footerSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="flex items-center justify-center bg-[#cd7f32]/10 hover:bg-[#cd7f32]/20 p-2 rounded-full border border-[#cd7f32]/20 transition-all cursor-pointer"
            >
              <ChevronDown size={16} className="text-[#cd7f32]" />
            </button>
          </div>
        </div>
      </div>

      {/* Rodapé como uma seção snap independente */}
      <div
        ref={(el) => (sectionsRef.current[totalSections - 1] = el)}
        data-index={totalSections - 1}
        className="h-dvh flex flex-col items-center justify-center p-4 section bg-[#21130a]"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="mb-4">
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
          </div>

          {/* Estatísticas simplificadas */}
          <div className="bg-[#3b1e0e] rounded-lg p-4 mb-4 border border-[#cd7f32]/20">
            <h3 className="text-[#cd7f32] text-lg mb-2">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.timeSpent}</div>
                <div className="text-xs text-[#e1d6b9]/60">Segundos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {metrics.viewedSections}
                </div>
                <div className="text-xs text-[#e1d6b9]/60">Etapas</div>
              </div>
            </div>
          </div>

          {/* Links do footer - simplificados */}
          <div className="flex justify-center gap-4 text-xs text-[#e1d6b9]/60">
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
          </div>

          <p className="mt-4 text-xs text-[#e1d6b9]/40">© 2025 CHC.LAT</p>

          {/* Botão para voltar para o topo */}
          {unlocked && (
            <button
              onClick={() => {
                // Ir para a seção de link, melhor que scroll to top
                const linkSection = sectionsRef.current[totalSections - 2];
                if (linkSection) {
                  linkSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#cd7f32]/20 hover:bg-[#cd7f32]/30 rounded-full text-[#e1d6b9] text-xs font-medium transition-all"
            >
              <span>Voltar ao link</span>
              <ChevronDown size={14} className="transform rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
