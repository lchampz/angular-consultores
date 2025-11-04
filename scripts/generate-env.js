const fs = require('fs');
const path = require('path');

// Lê o arquivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado! Copie o .env.example para .env e preencha as variáveis.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse das variáveis
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Gera o conteúdo do environment.ts
const environmentTs = `export const environment = {
  production: false,
  firebase: {
    apiKey: "${envVars.FIREBASE_API_KEY || ''}",
    authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ''}",
    projectId: "${envVars.FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${envVars.FIREBASE_APP_ID || ''}",
    measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ''}"
  },
  apiUrl: '${envVars.API_URL || '/api'}'
};
`;

// Gera o conteúdo do environment.prod.ts
const environmentProdTs = `export const environment = {
  production: true,
  firebase: {
    apiKey: "${envVars.FIREBASE_API_KEY || ''}",
    authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ''}",
    projectId: "${envVars.FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${envVars.FIREBASE_APP_ID || ''}",
    measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ''}"
  },
  apiUrl: '${envVars.API_URL || '/api'}'
};
`;

// Escreve os arquivos
const envDir = path.join(__dirname, '..', 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), environmentTs);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), environmentProdTs);

console.log('✅ Arquivos de ambiente gerados com sucesso!');
