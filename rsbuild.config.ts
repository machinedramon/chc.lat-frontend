import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "AdCash Example",
    // Configurar crossorigin para recursos
    crossorigin: "anonymous",
    // Adicionar as tags para AdCash
    tags: [
      // Step 1: Script da biblioteca AdCash
      {
        tag: "script",
        attrs: {
          id: "aclib",
          type: "text/javascript",
          src: "//acscdn.com/script/aclib.js",
          crossorigin: "anonymous",
        },
        head: true,
        append: false, // Colocá-lo no início do head
      },
      // Step 2: Script de inicialização do AdCash
      {
        tag: "script",
        children: `
          window.addEventListener('load', function() {
            if (window.aclib) {
              window.aclib.runAutoTag({
                zoneId: 'zwva8kf59r',
              });
            } else {
              // Tentar novamente após carregamento se aclib não estiver disponível
              function checkAclib() {
                if (window.aclib) {
                  window.aclib.runAutoTag({
                    zoneId: 'zwva8kf59r',
                  });
                } else {
                  setTimeout(checkAclib, 500);
                }
              }
              setTimeout(checkAclib, 500);
            }
          });
        `,
        head: true,
        append: true, // Colocá-lo após o script da biblioteca
      },
    ],
  },
  // Configurar output para garantir acesso correto aos recursos
  output: {
    // Definir como './' para permitir caminhos relativos
    assetPrefix: "./",
  },
});
