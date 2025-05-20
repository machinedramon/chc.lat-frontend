import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "CHC.LAT - Encurtador com Monetização",
    crossorigin: "anonymous",
    tags: [
      // Meta tags para SEO
      {
        tag: "meta",
        attrs: {
          name: "description",
          content:
            "CHC.LAT é um encurtador de links com monetização. Transforme suas URLs em uma fonte de renda.",
        },
        head: true,
      },
      {
        tag: "meta",
        attrs: {
          name: "theme-color",
          content: "#3b1e0e",
        },
        head: true,
      },

      // SCRIPT POPUNDER (antes de </head>)
      {
        tag: "script",
        attrs: {
          type: "text/javascript",
          src: "//pl26698008.profitableratecpm.com/68/c9/f9/68c9f9785ff63202669d05f31cd10598.js",
        },
        head: true, // Coloca no <head>
      },

      // Script do Adsterra Banner - apenas o necessário
      {
        tag: "script",
        attrs: {
          type: "text/javascript",
        },
        children: `
          var atOptions = { 
            'key' : '1123eee015220ba1dacddd14ea04a988', 
            'format' : 'iframe', 
            'height' : 250, 
            'width' : 300, 
            'params' : {} 
          };
          document.write('<scr' + 'ipt type="text/javascript" src="//www.highperformanceformat.com/1123eee015220ba1dacddd14ea04a988/invoke.js"></scr' + 'ipt>');
        `,
        head: false,
        append: true, // Append to body instead of head
      },

      // SOCIAL BAR (antes de </body>)
      {
        tag: "script",
        attrs: {
          type: "text/javascript",
          src: "//pl26698026.profitableratecpm.com/1a/27/6a/1a276a2539c6de9bdcb241acca9b60c3.js",
        },
        head: false,
        append: true, // Garante que fique no final do <body>
      },
    ],
  },
  output: {
    assetPrefix: "./",
  },
});
