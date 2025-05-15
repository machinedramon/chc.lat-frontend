import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePopunderOnScroll,
  useInterstitialOnScroll,
  useAdcashNative,
  useAdSlot,
  resetScriptStates,
  DIRECT_LINK_URL,
  initializeAllAds,
} from "../utils/monetagScripts";

// Tipos
interface Message {
  text: string;
  icon: string;
}

// Definindo tipo para Timeout já que NodeJS.Timeout não está disponível
type Timeout = ReturnType<typeof setTimeout>;

// Componente de slot de anúncio - Adcash Native apenas no primeiro slot
const AdSlot: React.FC<{ index: number }> = ({ index }) => {
  const slotRef = useRef<HTMLDivElement>(null!);

  // Apenas o primeiro slot (índice 0) usa Adcash Native
  if (index === 0) {
    useAdcashNative(slotRef, index);
  } else {
    // Os demais slots usam anúncios do Monetag
    useAdSlot(slotRef, index);
  }

  // Mensagem baseada no tipo de anúncio
  const loadingMessage =
    index === 0 ? "Anúncio Native" : "Carregando anúncio...";

  return (
    <div
      id={`ad-slot-${index}`}
      ref={slotRef}
      className="w-full h-80 rounded-3xl bg-[#3b1e0e]/30 backdrop-blur-md border border-white/5 shadow-lg overflow-visible relative"
      data-index={index}
      style={{
        minHeight: "320px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-center h-full text-[#8b7256]">
        {loadingMessage}
      </div>
    </div>
  );
};

// Componente de mensagem
const MessageCard: React.FC<{ message: Message; index: number }> = ({
  message,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true, amount: 0.5 }}
      className="py-6 px-4 mx-auto max-w-3xl"
    >
      <div className="bg-[#3b1e0e]/30 backdrop-blur-md border border-white/5 rounded-3xl shadow-lg overflow-hidden relative p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="text-center relative z-10">
          <i
            className={`fas ${message.icon} text-3xl text-[#e1d6b9]/50 absolute top-5 left-5 transform scale-150 opacity-20`}
          />
          <div className="text-xl font-semibold mb-2 leading-relaxed relative z-10 text-[#e1d6b9]">
            {message.text}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente do temporizador
const Timer: React.FC<{
  timeLeft: number;
  timerComplete: boolean;
  requirementsMet: boolean;
}> = ({ timeLeft, timerComplete, requirementsMet }) => {
  return (
    <motion.div
      className="fixed left-1/2 bottom-6 transform -translate-x-1/2 bg-[#3b1e0e]/30 backdrop-blur-md border border-white/5 px-6 py-2 rounded-[24px] font-semibold z-50 transition-all duration-300 flex items-center justify-center min-w-48 shadow-lg text-[#e1d6b9]"
      animate={
        timerComplete
          ? { y: -5, backgroundColor: "rgba(156, 166, 119, 0.3)" }
          : {}
      }
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[24px]" />
      <i
        className={`${
          timerComplete ? "fas fa-check-circle" : "fas fa-clock"
        } mr-2`}
      />
      {timerComplete
        ? "Temporizador completo!"
        : !requirementsMet && timeLeft <= 3
        ? "Aguarde ações para liberar"
        : `Aguarde ${timeLeft} segundos`}
    </motion.div>
  );
};

// Componente principal
const LinkPage: React.FC = () => {
  // Configurações
  const TIMER_DURATION = 30; // segundos
  const SECTIONS_COUNT = 15; // Número de seções de conteúdo
  const MIN_IMPRESSIONS_REQUIRED = 2; // Impressões mínimas para liberar o botão final
  const MIN_CLICKS_REQUIRED = 1; // Cliques mínimos para liberar o botão final

  // Usando a URL correta do Direct Link do Monetag
  const FINAL_URL = DIRECT_LINK_URL;

  // Estados
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);
  const [scrollComplete, setScrollComplete] = useState<boolean>(false);
  const [bannerImpressions, setBannerImpressions] = useState<number>(0);
  const [interstitialImpressions, setInterstitialImpressions] =
    useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [showFinalPageModal, setShowFinalPageModal] = useState<boolean>(false);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Refs
  const timerIntervalRef = useRef<Timeout | null>(null);
  const inactivityIntervalRef = useRef<Timeout | null>(null);
  const inactivityCheckCountRef = useRef<number>(0);
  const lastActivityTimeRef = useRef<number>(Date.now());

  // Mensagens a serem exibidas
  const messages: Message[] = [
    {
      text: "Vai rolando aí… o link não morde. Só demora um pouquinho.",
      icon: "fa-arrow-down",
    },
    {
      text: "Fica firme, campeão. Isso aqui ajuda quem te mandou o link.",
      icon: "fa-trophy",
    },
    { text: "Link bom vem com uns segundos de paciência.", icon: "fa-clock" },
    {
      text: "Esse scroll aqui paga uma marmita pra quem criou o link.",
      icon: "fa-utensils",
    },
    {
      text: "Mais fácil que esperar sua ex responder.",
      icon: "fa-comment-slash",
    },
    {
      text: "Ajuda não é só no pix. Scroll também vale.",
      icon: "fa-money-bill-wave",
    },
    {
      text: "Se tá reclamando de scroll, imagina de boleto.",
      icon: "fa-file-invoice",
    },
    {
      text: "Quase lá... Menos tempo que fila de banco.",
      icon: "fa-university",
    },
    {
      text: "A gente odeia esperar, mas é por uma boa causa.",
      icon: "fa-heart",
    },
    {
      text: "Sua paciência tá sendo convertida em café pro dev.",
      icon: "fa-coffee",
    },
    {
      text: "Não é o fim do mundo, é só um scroll e um timer.",
      icon: "fa-globe",
    },
    {
      text: "Todo mundo ganha aqui: você com o link, nós com os ads.",
      icon: "fa-handshake",
    },
    {
      text: "Calma, tá quase... Menos ansiedade que no delivery.",
      icon: "fa-hamburger",
    },
    {
      text: "Relaxa e aproveita a jornada. Ou só role logo até o fim.",
      icon: "fa-road",
    },
    {
      text: "O algoritmo tá te testando. Não deixe ele ganhar.",
      icon: "fa-robot",
    },
  ];

  // Hooks para scripts de anúncios do Monetag
  usePopunderOnScroll();
  useInterstitialOnScroll();

  // Registrar atividade do usuário
  const registerActivity = () => {
    lastActivityTimeRef.current = Date.now();
    inactivityCheckCountRef.current = 0;
  };

  // Verificar se os requisitos foram atendidos
  const requirementsMet =
    bannerImpressions >= MIN_IMPRESSIONS_REQUIRED &&
    interstitialImpressions > 0 &&
    totalClicks >= MIN_CLICKS_REQUIRED;

  // Iniciar o temporizador
  const startTimer = () => {
    if (timerStarted) return;

    setTimerStarted(true);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // Não contar se não tiver impressões suficientes
        if (
          (bannerImpressions === 0 ||
            interstitialImpressions === 0 ||
            totalClicks === 0) &&
          prevTime <= 3
        ) {
          return prevTime;
        }

        if (prevTime <= 1) {
          // Timer completado
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setTimerComplete(true);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    // Configurar verificador de inatividade
    inactivityIntervalRef.current = setInterval(() => {
      const INACTIVITY_TIMEOUT = 15000; // 15 segundos sem atividade
      const inactiveTime = Date.now() - lastActivityTimeRef.current;

      if (inactiveTime > INACTIVITY_TIMEOUT && !timerComplete) {
        inactivityCheckCountRef.current += 1;
        if (inactivityCheckCountRef.current >= 3) {
          // Após 3 verificações de inatividade, mostrar captcha
          setShowCaptcha(true);

          if (inactivityIntervalRef.current) {
            clearInterval(inactivityIntervalRef.current);
          }
        }
      }
    }, 15000);
  };

  // Atualizar informações de rolagem e barra de progresso
  const handleScroll = () => {
    registerActivity();

    const scrollPosition = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxPossibleScroll = scrollHeight - clientHeight;

    // Atualizar barra de progresso
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      const percentage = (scrollPosition / maxPossibleScroll) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Verificar se rolou até o final
    if (maxPossibleScroll - scrollPosition < 200) {
      setScrollComplete(true);
    }
  };

  // Copiar link para a área de transferência
  const copyLink = () => {
    try {
      navigator.clipboard.writeText(FINAL_URL);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar o link:", err);
    }
  };

  // Mostrar a página final
  const handleFinalButtonClick = () => {
    setShowFinalPageModal(true);
  };

  // Aumentar impressões de banners
  const handleAdImpression = () => {
    setBannerImpressions((prev) => prev + 1);

    // Iniciar o timer se ainda não começou
    if (!timerStarted) {
      startTimer();
    }
  };

  // Aumentar contagem de cliques
  const handleAdClick = () => {
    setTotalClicks((prev) => prev + 1);
  };

  // Lidar com clique no captcha
  const handleCaptchaButtonClick = () => {
    setTotalClicks((prev) => prev + 1);
    setShowCaptcha(false);
  };

  // Inicializar scripts ao carregar a página
  useEffect(() => {
    resetScriptStates(); // Limpar estados anteriores dos scripts

    // Inicializar scripts de anúncios
    initializeAllAds();

    // Atualização manual para contabilizar impressões
    setBannerImpressions(2); // Definir pelo menos 2 impressões para atender ao requisito mínimo

    // Configurar detecção de interstitials
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of Array.from(mutation.addedNodes)) {
            if (
              node.nodeName === "SCRIPT" &&
              (node as HTMLElement).id?.includes("monetag-interstitial")
            ) {
              setInterstitialImpressions((prev) => prev + 1);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true });

    // Eventos de atividade
    const activityEvents = ["mousemove", "click", "keypress", "touchstart"];
    for (const event of activityEvents) {
      window.addEventListener(event, registerActivity);
    }

    // Evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Atualização inicial
    handleScroll();

    // Cleanup
    return () => {
      for (const event of activityEvents) {
        window.removeEventListener(event, registerActivity);
      }
      window.removeEventListener("scroll", handleScroll);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (inactivityIntervalRef.current) {
        clearInterval(inactivityIntervalRef.current);
      }

      observer.disconnect();
    };
  }, []);

  // Efeito para verificar quando o timer termina
  useEffect(() => {
    if (timerComplete && !requirementsMet) {
      // Se o timer acabou mas os requisitos não foram atendidos
      setShowCaptcha(true);
    }
  }, [timerComplete, requirementsMet]);

  // Marcar as seções como vistas quando roladas para o viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting && element.dataset.type === "ad") {
            handleAdImpression();
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-type="ad"]').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="font-sans text-[#e1d6b9] bg-[#3b1e0e] overflow-x-hidden min-h-[100dvh]">
      {/* Background blur effects */}
      <div className="fixed top-[15%] left-[20%] h-[300px] w-[300px] rounded-full bg-[#5a3520] opacity-20 blur-[80px]" />
      <div className="fixed bottom-[20%] right-[15%] h-[250px] w-[250px] rounded-full bg-[#6b4530] opacity-15 blur-[60px]" />
      <div className="fixed top-[60%] left-[30%] h-[200px] w-[200px] rounded-full bg-[#7d5642] opacity-10 blur-[70px]" />
      <div className="fixed bottom-[40%] left-[10%] h-[150px] w-[150px] rounded-full bg-[#704730] opacity-15 blur-[50px]" />
      <div className="fixed top-[30%] right-[10%] h-[180px] w-[180px] rounded-full bg-[#805030] opacity-10 blur-[60px]" />

      {/* Container principal */}
      <div className="relative min-h-[100dvh] pb-44">
        {/* Barra de progresso */}
        <div className="fixed top-0 left-0 w-full h-1 bg-[#5a3520] z-50">
          <div
            id="progressBar"
            className="h-full w-0 bg-gradient-to-r from-[#7d4527] via-[#8b5a2b] to-[#6b3c1f] transition-all duration-300"
          />
        </div>

        {/* Cabeçalho */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 bg-[#3b1e0e]/30 backdrop-blur-md border-b border-white/5 rounded-b-[24px] mb-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-b-[24px]" />
          <div className="container mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.img
                src="https://em-content.zobj.net/source/google/350/chocolate-bar_1f36b.png"
                alt="chc.lat"
                className="h-10 w-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
              />
              <motion.h1
                className="font-display font-bold text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                chc.lat
              </motion.h1>
            </div>
            <motion.p
              className="text-lg max-w-3xl mx-auto leading-relaxed text-[#e1d6b9]/90 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Você deve estar vendo anúncios enquanto rola... relaxa, é só
              continuar descendo a página. Além de chegar no link, você está
              ajudando quem compartilhou este conteúdo.
            </motion.p>

            <motion.div
              className="flex justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="text-[#e1d6b9]/80 inline-block p-2"
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  },
                }}
              >
                <i className="fas fa-chevron-down text-xl" />
                <p className="mt-1 text-sm font-medium">Continue rolando</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Área de conteúdo dinâmico - Mensagens e slots de anúncios */}
        <div className="container mx-auto py-8 px-4">
          {Array.from({ length: SECTIONS_COUNT }).map((_, index) => (
            <React.Fragment
              key={`section-${messages[index % messages.length].text}-${index}`}
            >
              <MessageCard
                message={messages[index % messages.length]}
                index={index}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="py-4 px-4 mx-auto max-w-3xl"
                data-type="ad"
                onClick={handleAdClick}
              >
                <AdSlot index={index} />
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Mensagem final e botão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="container mx-auto mt-12 mb-24 px-4"
        >
          <div className="mx-auto max-w-3xl bg-[#3b1e0e]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[24px]" />
            <div className="relative z-10">
              <p className="text-xl mb-6 text-[#e1d6b9]/90">
                Valeu por ter ficado até aqui. O link tá liberado quando o timer
                zerar!
              </p>

              {timerComplete && scrollComplete && requirementsMet ? (
                <motion.button
                  onClick={handleFinalButtonClick}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#7d4527] via-[#8b5a2b] to-[#6b3c1f] text-[#e1d6b9] border-0 rounded-[24px] text-xl font-semibold cursor-pointer shadow-lg hover:opacity-90 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: [
                      "0 0 0 0 rgba(139, 90, 43, 0.5)",
                      "0 0 0 15px rgba(139, 90, 43, 0)",
                      "0 0 0 0 rgba(139, 90, 43, 0.5)",
                    ],
                    transition: {
                      boxShadow: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      },
                    },
                  }}
                >
                  <i className="fas fa-link mr-2" /> ACESSAR MEU LINK AGORA
                </motion.button>
              ) : (
                <div className="inline-flex items-center px-8 py-3 bg-[#8b7256]/30 text-[#e1d6b9]/70 rounded-[24px] text-xl font-semibold backdrop-blur-md">
                  <i className="fas fa-hourglass-half mr-2" />
                  <span id="disabledButtonText">
                    {!timerComplete
                      ? "Aguarde o temporizador"
                      : !scrollComplete
                      ? "Role até o fim da página"
                      : "Interaja com a página para continuar"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timer flutuante */}
      <Timer
        timeLeft={timeLeft}
        timerComplete={timerComplete}
        requirementsMet={requirementsMet}
      />

      {/* Overlay de Captcha (para inatividade extrema) */}
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#3b1e0e]/70 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] max-w-md w-full text-center relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[32px]" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 text-[#e1d6b9]">
                  Verificação de Segurança
                </h3>
                <p className="mb-6 text-[#e1d6b9]/80">
                  Clique no botão abaixo para provar que você não é um robô e
                  continuar.
                </p>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-[#7d4527] via-[#8b5a2b] to-[#6b3c1f] text-[#e1d6b9] rounded-[24px] font-semibold hover:opacity-90 transition-colors"
                  onClick={handleCaptchaButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Não sou um robô
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Página final */}
      <AnimatePresence>
        {showFinalPageModal && (
          <motion.div
            className="fixed inset-0 flex-col justify-center items-center backdrop-blur-xl p-5 z-50 bg-[#3b1e0e]/80 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#3b1e0e]/30 backdrop-blur-xl border border-white/10 rounded-[38px] p-8 sm:p-12 max-w-2xl w-full text-center relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[38px]" />
              <div className="relative z-10">
                <motion.div
                  className="text-4xl text-[#e1d6b9] mb-5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                >
                  <i className="fas fa-link" />
                </motion.div>
                <motion.h1
                  className="font-display font-bold text-3xl mb-8 text-[#e1d6b9]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Seu link está pronto!
                </motion.h1>

                <motion.div
                  id="finalLink"
                  className="py-5 px-5 bg-[#3b1e0e]/50 border border-white/5 rounded-[24px] mb-8 text-lg break-all relative shadow-inner backdrop-blur-md transition-all duration-300 hover:bg-[#3b1e0e]/70 text-[#e1d6b9]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {FINAL_URL}
                </motion.div>

                <motion.div
                  className="flex flex-wrap gap-4 justify-center mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className={`flex items-center justify-center px-6 py-3 ${
                      linkCopied
                        ? "bg-[#9ca677]/50"
                        : "bg-gradient-to-r from-[#7d4527] via-[#8b5a2b] to-[#6b3c1f]"
                    } text-[#e1d6b9] rounded-[24px] font-semibold cursor-pointer transition-all duration-300 hover:opacity-90`}
                    onClick={copyLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i
                      className={`${
                        linkCopied ? "fas fa-check" : "fas fa-copy"
                      } mr-2`}
                    />
                    {linkCopied ? "Copiado!" : "Copiar Link"}
                  </motion.button>

                  {/* Botão com Direct Link do Monetag */}
                  <motion.a
                    className="flex items-center justify-center px-6 py-3 bg-[#8b7256]/20 text-[#e1d6b9] rounded-[24px] font-semibold cursor-pointer border border-white/5 transition-all duration-300 hover:bg-[#8b7256]/30"
                    href={DIRECT_LINK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-external-link-alt mr-2" /> Abrir em
                    Nova Aba
                  </motion.a>
                </motion.div>

                <motion.p
                  className="text-[#e1d6b9]/80 mb-8 text-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Valeu por ter ficado até aqui. Sua presença fez diferença.
                  Tamo junto!
                </motion.p>

                <motion.div
                  className="mt-4 text-sm text-[#8b7256]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  © 2025 chc.lat
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkPage;
