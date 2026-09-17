const fs = require("fs");
const path = require("path");

// Função para obter variáveis de ambiente (prioriza process.env para Vercel/CI)
function getEnvVars() {
  const envVars = {};

  // Primeiro, tenta ler do process.env (Vercel/CI)
  if (process.env.FIREBASE_API_KEY) {
    return {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      API_URL: process.env.API_URL || "/api",
    };
  }

  // Se não tiver no process.env, lê do arquivo .env
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.error(
      "❌ Arquivo .env não encontrado! Copie o .env.example para .env e preencha as variáveis."
    );
    console.error(
      "   Ou configure as variáveis de ambiente no sistema (para CI/CD)."
    );
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");

  // Parse das variáveis do arquivo .env
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    }
  });

  envVars.API_URL = envVars.API_URL || "/api";
  return envVars;
}

// Obtém as variáveis
const envVars = getEnvVars();

// Valida variáveis obrigatórias
const requiredVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

const missingVars = requiredVars.filter((varName) => !envVars[varName]);
if (missingVars.length > 0) {
  console.error("❌ Variáveis de ambiente obrigatórias não encontradas:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  process.exit(1);
}

// Gera o conteúdo do environment.ts
const environmentTs = `export const environment = {
  production: false,
  firebase: {
    apiKey: "${envVars.FIREBASE_API_KEY || ""}",
    authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ""}",
    projectId: "${envVars.FIREBASE_PROJECT_ID || ""}",
    storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ""}",
    messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ""}",
    appId: "${envVars.FIREBASE_APP_ID || ""}",
    measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ""}"
  },
  apiUrl: '${envVars.API_URL || "/api"}'
};
`;

// Gera o conteúdo do environment.prod.ts
const environmentProdTs = `export const environment = {
  production: true,
  firebase: {
    apiKey: "${envVars.FIREBASE_API_KEY || ""}",
    authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ""}",
    projectId: "${envVars.FIREBASE_PROJECT_ID || ""}",
    storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ""}",
    messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ""}",
    appId: "${envVars.FIREBASE_APP_ID || ""}",
    measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ""}"
  },
  apiUrl: '${envVars.API_URL || "/api"}'
};
`;

// Escreve os arquivos
const envDir = path.join(__dirname, "..", "src", "environments");
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, "environment.ts"), environmentTs);
fs.writeFileSync(path.join(envDir, "environment.prod.ts"), environmentProdTs);

console.log("✅ Arquivos de ambiente gerados com sucesso!");
