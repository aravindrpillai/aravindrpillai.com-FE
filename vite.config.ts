import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: [
      '149.248.57.227', //BackEnd
      '216.128.176.119', //FrontEnd
      'aravindrpillai.com', 
      'www.aravindrpillai.com'
    ],
    host: "0.0.0.0",
    port: 80,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
