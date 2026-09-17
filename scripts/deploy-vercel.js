#!/usr/bin/env node
const { execSync } = require("child_process");
console.log("🚀 Iniciando deploy na Vercel...");

try {
  execSync("vercel --version", { stdio: "ignore" });
} catch (error) {
  console.error("❌ Vercel CLI não encontrado! Execute: npm install -g vercel");
  process.exit(1);
}
console.log("📝 Gerando arquivos de ambiente...");
require("./generate-env.js");
console.log("🔨 Fazendo build de produção...");
execSync("npm run build", { stdio: "inherit" });
console.log("🚀 Fazendo deploy na Vercel...");
execSync("vercel --prod", { stdio: "inherit" });
console.log("✅ Deploy concluído com sucesso!");
