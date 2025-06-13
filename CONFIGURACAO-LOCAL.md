# 🚀 Como testar localmente antes do deploy

## 📋 **Pré-requisitos:**

1. **Node.js** instalado (https://nodejs.org)
2. **Conta ActiveCampaign** ativa
3. **Vercel CLI** para rodar localmente

## 🔧 **Setup passo a passo:**

### **1. Instalar Vercel CLI:**
```bash
npm install -g vercel
```

### **2. Configurar variáveis:**
1. **Renomeie** o arquivo `vercel.env.local` para `.env.local`
2. **ActiveCampaign:** Settings > Developer
3. **Copie:**
   - **URL:** `https://SUA_CONTA.api-us1.com` 
   - **API Key:** chave longa gerada
4. **Cole** no arquivo `.env.local`

### **3. Rodar localmente:**
```bash
vercel dev
```

### **4. Testar:**
- **Abra:** http://localhost:3000
- **Clique** no botão de CTA
- **Preencha** o modal
- **Verifique** se aparece no ActiveCampaign

## 🎯 **Exemplo de .env.local configurado:**
```
ACTIVECAMPAIGN_URL=https://victor123.api-us1.com
ACTIVECAMPAIGN_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

## ✅ **Após funcionar local:**
```bash
vercel --prod
```

## 🐛 **Debug:**
- **Logs:** aparecem no terminal do `vercel dev`
- **Network:** DevTools > Network para ver requests
- **Console:** F12 para ver erros JavaScript 