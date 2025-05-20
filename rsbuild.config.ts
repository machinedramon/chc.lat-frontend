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
          content: "CHC.LAT é um encurtador de links com monetização. Transforme suas URLs em uma fonte de renda.",
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
    ],
  },
  output: {
    assetPrefix: "./",
  },
});