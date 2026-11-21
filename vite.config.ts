import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { ROUTE_META, SITE_URL } from "./src/data/seoRoutes";

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Writes a copy of dist/index.html per known route with that route's title,
 * description, canonical and social tags. The app is still a client-side SPA,
 * this only gives crawlers that do not run JavaScript the right metadata.
 * Vercel serves a real file before it applies the SPA rewrite.
 */
function routeMetaHtml(): Plugin {
  return {
    name: "route-meta-html",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const indexPath = path.join(dist, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, "utf8");
      for (const [route, meta] of Object.entries(ROUTE_META)) {
        const url = route === "/" ? SITE_URL : `${SITE_URL}${route}`;
        const t = escapeAttr(meta.title);
        const d = escapeAttr(meta.description);
        let html = template
          .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
        if (meta.noIndex) html = html.replace(/(<meta name="robots" content=")[^"]*(")/, "$1noindex, nofollow$2");
        const outDir = route === "/" ? dist : path.join(dist, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    routeMetaHtml(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks: better long-term caching, smaller entry chunk.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return "vendor-react";
          if (id.includes("framer-motion") || id.includes("/motion-")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("gsap") || id.includes("lenis")) return "vendor-anim";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          return undefined;
        },
      },
    },
  },
}));
