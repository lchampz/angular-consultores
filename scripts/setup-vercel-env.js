#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupVercelEnv() {
  console.log('🔐 Configurando variáveis de ambiente na Vercel\n');

  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Vercel CLI não encontrado!');
    console.log('   npm install -g vercel');
    process.exit(1);
  }

  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado!');
    console.log('   Copie o .env.example para .env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
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

  const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  const envType = await question('Ambiente (Production/Preview/Development) [Production]: ') || 'Production';
  const envFlag = envType.toLowerCase() === 'production' ? '--prod' : 
                  envType.toLowerCase() === 'preview' ? '--preview' : '';

  console.log(`\n🔧 Configurando para: ${envType}\n`);

  for (const varName of requiredVars) {
    if (envVars[varName]) {
      try {
        console.log(`📝 ${varName}...`);
        execSync(`echo "${envVars[varName]}" | vercel env add ${varName} ${envFlag}`, {
          stdio: 'pipe'
        });
        console.log(`✅ ${varName} configurada\n`);
      } catch (error) {
        console.log(`⚠️  ${varName} já existe ou erro\n`);
      }
    }
  }

  if (envVars.FIREBASE_MEASUREMENT_ID) {
    const add = await question('Adicionar FIREBASE_MEASUREMENT_ID? (s/N): ');
    if (add.toLowerCase() === 's') {
      try {
        execSync(`echo "${envVars.FIREBASE_MEASUREMENT_ID}" | vercel env add FIREBASE_MEASUREMENT_ID ${envFlag}`, {
          stdio: 'pipe'
        });
        console.log('✅ FIREBASE_MEASUREMENT_ID configurada\n');
      } catch (error) {
        console.log('⚠️  Erro ao adicionar\n');
      }
    }
  }

  console.log('✅ Configuração concluída!');
  console.log('   Verificar: vercel env ls');
  rl.close();
}

setupVercelEnv().catch(error => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
