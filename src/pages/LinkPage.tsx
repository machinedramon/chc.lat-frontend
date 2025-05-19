import React, { useState, useEffect, useRef } from "react";
import {
  ArrowDown,
  Clock,
  Lock,
  Unlock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export default function ChocolateAdPage() {
  // Estado para o temporizador
  const [countdown, setCountdown] = useState(30);
  const [unlocked, setUnlocked] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  // Referência para o container principal para detectar scroll
  const mainContainerRef = useRef(null);

  // Mensagens provocativas
  const provocativeMessages = [
    "Você achou mesmo que ia sair daqui sem dar nada em troca? Segura a ansiedade, guerreiro...",
    "Scrolla mais um pouco, preguiçoso! Estamos só começando.",
    "Quase lá... ou não. Ainda falta bastante, na verdade.",
    "Opa, olha esse anúncio aqui! Você vai fingir que não viu?",
    "Continue rolando, o tesouro está no fim do arco-íris... Ou não.",
    "Sabe o que é mais rápido que esse temporizador? Clicar num anúncio!",
    "Parabéns pela persistência! Ou seria teimosia?",
    "Você é do tipo que lê os termos e condições também? Impressionante.",
    "Relaxa, é só mais alguns segundos... ou minutos... quem sabe?",
    "Tanta pressa para onde? O conteúdo bom está todo aqui!",
  ];

  // Verificar scroll e atualizar percentual
  useEffect(() => {
    const handleScroll = () => {
      if (mainContainerRef.current) {
        const container = mainContainerRef.current;
        const scrollPosition = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const percentage = Math.min(
          Math.floor((scrollPosition / scrollHeight) * 100),
          100
        );
        setScrollPercentage(percentage);

        // Atualizar mensagem com base no scroll
        const messageIndex = Math.min(
          Math.floor(percentage / 10),
          provocativeMessages.length - 1
        );
        setCurrentMessage(messageIndex);
      }
    };

    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Temporizador de countdown
  useEffect(() => {
    if (countdown > 0 && !unlocked) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && scrollPercentage >= 80) {
      setUnlocked(true);
    }
  }, [countdown, scrollPercentage]);

  return (
    <div
      ref={mainContainerRef}
      className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#3b1e0e] to-[#5a3520] text-[#e1d6b9]"
    >
      {/* Temporizador fixo */}
      <div className="sticky top-0 z-50 w-full bg-[rgba(59,30,14,0.8)] backdrop-blur-md shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/KpF7CjKN/Chat-GPT-Image-10-de-mai-de-2025-00-22-43.png"
            alt="Chocolate bar"
            className="h-10 w-10 mr-2"
          />
          <span className="text-xl font-bold">chc.lat</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(224,219,216,0.1)] border border-[rgba(255,255,255,0.05)]">
          {unlocked ? (
            <>
              <Unlock size={18} className="text-green-400" />
              <span className="text-green-400 font-medium">Desbloqueado!</span>
            </>
          ) : (
            <>
              <Clock size={18} className="text-[#e1d6b9]" />
              <span className="font-mono text-lg">{countdown}s</span>
              <Lock size={18} className="text-[#e1d6b9]" />
            </>
          )}
        </div>
      </div>

      {/* Background light effects */}
      <div className="fixed top-[15%] left-[20%] h-[300px] w-[300px] rounded-full bg-[#5a3520] opacity-20 blur-lg" />
      <div className="fixed bottom-[20%] right-[15%] h-[250px] w-[250px] rounded-full bg-[#6b4530] opacity-15 blur-lg" />
      <div className="fixed top-[60%] left-[30%] h-[200px] w-[200px] rounded-full bg-[#7d5642] opacity-10 blur-lg" />

      {/* Indicador de scroll e mensagem provocativa */}
      <div className="sticky top-20 z-40 mx-auto max-w-3xl px-4 py-3">
        <div className="w-full rounded-lg bg-[rgba(59,30,14,0.6)] backdrop-blur-sm shadow-md p-4 border border-[rgba(255,255,255,0.05)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#e1d6b9]">Progresso:</span>
            <span className="text-sm font-semibold">{scrollPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-[rgba(224,219,216,0.1)] rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#8b5a2b] to-[#cd7f32] rounded-full transition-all duration-300"
              style={{ width: `${scrollPercentage}%` }}
            ></div>
          </div>
          <p className="mt-3 text-center italic text-[#e1d6b9]">
            "{provocativeMessages[currentMessage]}"
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Intro card */}
        <div className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-center">
            Bem-vindo ao CHC.LAT
          </h1>
          <p className="mb-6 text-lg text-center">
            Estamos quase lá... Seu link será desbloqueado em breve. Enquanto
            isso, que tal explorar nosso conteúdo?
          </p>

          <div className="flex justify-center mt-8 animate-bounce">
            <ChevronDown size={36} className="text-[#e1d6b9]" />
          </div>
        </div>

        {/* Primeiro anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-1"></div>
          </div>
        </div>

        {/* Seção 1 */}
        <div className="my-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h2 className="mb-4 text-2xl font-semibold">
            Por que usamos encurtadores?
          </h2>
          <p className="mb-3">
            Na era digital, os encurtadores de URL tornaram-se ferramentas
            essenciais para comunicação na web. Eles permitem compartilhar links
            longos de forma mais limpa e eficiente.
          </p>
          <p>
            Mas sabe o que é ainda melhor? Encurtadores que te recompensam pelo
            seu tempo. Enquanto você espera, nós monetizamos sua atenção. Um
            acordo justo, não é?
          </p>
        </div>

        {/* Segundo anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-2"></div>
          </div>
        </div>

        {/* Seção 2 */}
        <div className="my-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h2 className="mb-4 text-2xl font-semibold">Quase lá!</h2>
          <p className="mb-3">
            Continue rolando a página. Quanto mais você interage, mais rápido
            desbloqueamos o seu link. É como uma troca justa: seu tempo e
            atenção por acesso ao conteúdo que você deseja.
          </p>
          <p>
            Os anúncios que você vê aqui são cuidadosamente selecionados para
            equilibrar sua experiência e nossa monetização. Um ecossistema
            digital saudável, não acha?
          </p>
        </div>

        {/* Terceiro anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-3"></div>
          </div>
        </div>

        {/* Seção 3 */}
        <div className="my-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h2 className="mb-4 text-2xl font-semibold">Um pouco mais...</h2>
          <p className="mb-3">
            Está sentindo a ansiedade? Calma, já estamos nos aproximando do
            final. Continue rolando e interagindo com a página.
          </p>
          <p>
            Enquanto isso, por que não aproveitar para conhecer alguns de nossos
            parceiros e ofertas especiais? Você nunca sabe quando vai encontrar
            algo realmente interessante...
          </p>
        </div>

        {/* Quarto anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-4"></div>
          </div>
        </div>

        {/* Seção 4 */}
        <div className="my-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h2 className="mb-4 text-2xl font-semibold">
            Como funciona o CHC.LAT?
          </h2>
          <p className="mb-3">
            O CHC.LAT é um encurtador de URL inovador que permite monetizar seus
            links através de uma experiência de redirecionamento envolvente e
            rica em conteúdo.
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-3">
            <li>Você encurta um link usando nossa plataforma</li>
            <li>Compartilha esse link encurtado onde quiser</li>
            <li>Quando alguém clica, eles passam por esta página de espera</li>
            <li>Você ganha por cada interação e visualização</li>
          </ol>
          <p>É simples, eficiente e lucrativo. A internet como deveria ser!</p>
        </div>

        {/* Quinto anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-5"></div>
          </div>
        </div>

        {/* Seção final com o link */}
        <div className="my-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(59,30,14,0.3)] p-6 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
          <h2 className="mb-4 text-2xl font-semibold text-center">
            Você conseguiu!
          </h2>
          {unlocked ? (
            <div className="text-center">
              <p className="mb-6 text-lg">
                Obrigado pela sua paciência e interação. Seu link está pronto:
              </p>
              <a
                href="https://destino.exemplo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8b5a2b] to-[#cd7f32] rounded-full text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
              >
                Prosseguir para o destino <ExternalLink size={18} />
              </a>
              <p className="mt-6 text-sm opacity-80">
                Gostou do CHC.LAT? Experimente criar seu próprio link
                monetizado!
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Quase lá! Para desbloquear seu link:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      countdown === 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[rgba(224,219,216,0.1)] text-[#e1d6b9]"
                    }`}
                  >
                    {countdown === 0 ? "✓" : "1"}
                  </div>
                  <span className={countdown === 0 ? "text-green-400" : ""}>
                    Aguardar o temporizador
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      scrollPercentage >= 80
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[rgba(224,219,216,0.1)] text-[#e1d6b9]"
                    }`}
                  >
                    {scrollPercentage >= 80 ? "✓" : "2"}
                  </div>
                  <span
                    className={scrollPercentage >= 80 ? "text-green-400" : ""}
                  >
                    Rolar até o final ({scrollPercentage}%)
                  </span>
                </div>
              </div>
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500/30 cursor-not-allowed rounded-full text-white/50 font-semibold"
              >
                <Lock size={16} /> Link bloqueado
              </button>
            </div>
          )}
        </div>

        {/* Sexto anúncio */}
        <div className="my-12 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-2">
          <p className="text-xs text-center mb-2 opacity-60">ANÚNCIO</p>
          <div className="min-h-[250px] w-full">
            <div id="awn-z9952262-6"></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 mb-8 text-center text-sm opacity-70">
          <p>© 2025 CHC.LAT - Seu encurtador de links com monetização</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="#" className="hover:text-white">
              Sobre
            </a>
            <a href="#" className="hover:text-white">
              Termos
            </a>
            <a href="#" className="hover:text-white">
              Privacidade
            </a>
            <a href="#" className="hover:text-white">
              Contato
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
