import React, { useEffect } from "react";

export default function AdCashPage() {
  // Usando useEffect para garantir execução do script no lado do cliente
  useEffect(() => {
    // Garantir que aclib esteja disponível antes de executar runAutoTag
    const checkAclib = () => {
      if (window.aclib) {
        window.aclib.runAutoTag({
          zoneId: "zwva8kf59r",
        });
      } else {
        // Tentar novamente após 500ms se aclib não estiver disponível
        setTimeout(checkAclib, 500);
      }
    };

    // Iniciar verificação após carregamento da página
    checkAclib();
  }, []);

  return (
    <div className="container">
      {/* Step 1: Include Adcash library com URL correto e ID */}
      <script
        id="aclib"
        type="text/javascript"
        src="//acscdn.com/script/aclib.js"
      ></script>

      <h1>Página com Anúncios AdCash</h1>

      {/* Primeira seção de texto */}
      <div className="content-section">
        <h2>Tecnologia e Inovação</h2>
        <p>
          A tecnologia tem avançado rapidamente nos últimos anos, transformando
          a forma como vivemos, trabalhamos e nos comunicamos. Desde a
          popularização dos smartphones até o desenvolvimento da inteligência
          artificial, estamos testemunhando uma revolução digital sem
          precedentes.
        </p>
      </div>

      {/* Primeiro anúncio */}
      <div className="ad-container" id="ad-1"></div>

      {/* Segunda seção de texto */}
      <div className="content-section">
        <h2>Sustentabilidade e Meio Ambiente</h2>
        <p>
          A preocupação com a sustentabilidade tem crescido significativamente
          nas últimas décadas, à medida que os efeitos das mudanças climáticas
          se tornam mais evidentes. Governos, empresas e cidadãos em todo o
          mundo estão buscando maneiras de reduzir seu impacto ambiental.
        </p>
      </div>

      {/* Segundo anúncio */}
      <div className="ad-container" id="ad-2"></div>

      {/* Terceira seção de texto */}
      <div className="content-section">
        <h2>Saúde e Bem-estar</h2>
        <p>
          A saúde e o bem-estar são aspectos fundamentais da vida humana, e os
          avanços na medicina e na ciência continuam a melhorar nossa
          compreensão do corpo humano e a desenvolver tratamentos mais eficazes
          para diversas condições.
        </p>
      </div>

      {/* Terceiro anúncio */}
      <div className="ad-container" id="ad-3"></div>

      {/* Quarta seção de texto */}
      <div className="content-section">
        <h2>Educação e Aprendizado</h2>
        <p>
          A educação está passando por uma transformação significativa,
          impulsionada pelos avanços tecnológicos e por uma compreensão mais
          profunda de como as pessoas aprendem. Plataformas de ensino online
          estão democratizando o acesso ao conhecimento.
        </p>
      </div>

      {/* Quarto anúncio */}
      <div className="ad-container" id="ad-4"></div>

      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f9f9f9;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
          }
          
          h2 {
            color: #2c3e50;
            border-bottom: 2px solid #f1f1f1;
            padding-bottom: 10px;
          }
          
          .content-section {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-bottom: 30px;
          }
          
          .ad-container {
            margin-bottom: 30px;
            min-height: 250px;
          }
        `}
      </style>
    </div>
  );
}
