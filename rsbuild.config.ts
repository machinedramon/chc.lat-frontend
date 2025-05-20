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
    ],
  },
  output: {
    assetPrefix: "./",
  },
});
