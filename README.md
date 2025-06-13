# 🧠 Metáforas Visuais - Landing Page para Psicólogos

Landing page profissional para captura de leads interessados em **10 Metáforas Visuais para Psicoterapia**, com integração completa ao ActiveCampaign e funil de vendas otimizado.

## 🚀 **Demonstração**

- **Landing Page:** [Ver Demo](https://seu-projeto.vercel.app)
- **Página de Oferta:** [Ver Oferta](https://seu-projeto.vercel.app/nova-oferta)

## ✨ **Funcionalidades**

### 🎯 **Captura de Leads**
- Modal de captura otimizado para conversão
- Validação de email em tempo real
- Integração automática com ActiveCampaign
- Redirecionamento personalizado com nome do lead

### 📱 **Design Responsivo**
- Interface moderna e profissional
- Otimizado para mobile, tablet e desktop
- Animações suaves e micro-interações
- Loading states e feedback visual

### 🔧 **Integração ActiveCampaign**
- Criação automática de contatos
- Adição à lista específica (ID: 4)
- Tags automáticas para segmentação
- Tratamento robusto de erros

### 🎨 **Funil de Vendas**
- Página de oferta personalizada
- Seção FAQ com accordion
- Barra de progresso de escassez
- CTAs otimizados para conversão

### 🔍 **SEO Otimizado**
- Meta tags completas
- Schema.org markup
- Sitemap.xml
- Open Graph e Twitter Cards
- Otimizado para psicólogos e terapeutas

## 🛠️ **Tecnologias Utilizadas**

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js (Vercel Functions)
- **Deploy:** Vercel
- **Integração:** ActiveCampaign API
- **SEO:** Schema.org, Open Graph

## 📦 **Instalação e Configuração**

### **1. Clone o repositório**
```bash
git clone https://github.com/peterdev1231/projeto-psicologo.git
cd projeto-psicologo
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
# Renomeie o arquivo de exemplo
mv vercel.env.local .env.local

# Edite com suas credenciais do ActiveCampaign
ACTIVECAMPAIGN_URL=https://sua-conta.api-us1.com
ACTIVECAMPAIGN_API_KEY=sua_api_key_aqui
ACTIVECAMPAIGN_LIST_ID=sua_lista_id
```

### **4. Teste localmente**
```bash
# Usando Vercel CLI
npm install -g vercel
vercel dev

# Ou usando servidor simples
npm run serve
```

## 🚀 **Deploy na Vercel**

### **1. Deploy inicial**
```bash
vercel --prod
```

### **2. Configure as variáveis de ambiente**
- Acesse [Vercel Dashboard](https://vercel.com/dashboard)
- Vá em **Settings** → **Environment Variables**
- Adicione as 3 variáveis do ActiveCampaign

### **3. Redeploy**
```bash
vercel --prod
```

## 📊 **Estrutura do Projeto**

```
projeto-psicologo/
├── api/
│   └── subscribe.js          # Vercel Function para ActiveCampaign
├── img/                      # Imagens e assets
├── nova-oferta/             # Página de oferta
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── index.html               # Landing page principal
├── styles.css               # Estilos principais
├── script.js                # JavaScript principal
├── package.json             # Dependências
├── vercel.json              # Configuração Vercel
├── sitemap.xml              # SEO
├── robots.txt               # SEO
└── README.md                # Documentação
```

## 🔧 **Configuração ActiveCampaign**

### **Encontrar suas credenciais:**

1. **URL da API:**
   - ActiveCampaign → Settings → Developer
   - Formato: `https://sua-conta.api-us1.com`

2. **API Key:**
   - ActiveCampaign → Settings → Developer
   - Copie a chave completa

3. **List ID:**
   - ActiveCampaign → Contacts → Lists
   - Clique na lista desejada
   - O ID aparece na URL: `/lists/manage/[ID]`

## 📈 **Monitoramento**

### **Logs da Vercel:**
- Dashboard → Functions → View Function Logs

### **ActiveCampaign:**
- Contacts → Lists → Sua Lista
- Verificar novos contatos com tags `metaforas-visuais`

## 🎯 **Fluxo de Conversão**

```
Landing Page → Modal → API → ActiveCampaign → Oferta Personalizada
```

1. **Usuário** acessa a landing page
2. **Clica** no CTA e abre o modal
3. **Preenche** nome e email
4. **Sistema** envia para ActiveCampaign
5. **Redirecionamento** para oferta com nome personalizado

## 🔒 **Segurança**

- ✅ API Keys em variáveis de ambiente
- ✅ Validação de entrada no backend
- ✅ CORS configurado
- ✅ Rate limiting respeitado
- ✅ Sanitização de dados

## 📱 **Responsividade**

- ✅ Mobile First
- ✅ Breakpoints otimizados
- ✅ Touch-friendly
- ✅ Performance otimizada

## 🎨 **Personalização**

### **Cores principais:**
```css
--primary: #dc2626;     /* Vermelho principal */
--secondary: #059669;   /* Verde sucesso */
--accent: #f59e0b;      /* Laranja destaque */
```

### **Fontes:**
- **Títulos:** Inter (700, 800)
- **Texto:** Inter (400, 500, 600)

## 📞 **Suporte**

Para dúvidas ou suporte:
- **Email:** contato@exemplo.com
- **Issues:** [GitHub Issues](https://github.com/peterdev1231/projeto-psicologo/issues)

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para profissionais da Psicologia** 