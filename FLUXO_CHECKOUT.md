# 🛒 Sistema de Fluxo de Checkout Implementado

## 📋 Visão Geral
Sistema completo para capturar leads na página principal e transferir os dados através do funil até o checkout.

## 🔄 Fluxo Completo

### 1. **Página de Captura** (`index.html`)
- ✅ Usuário preenche nome e email no modal
- ✅ Dados são salvos no `localStorage`
- ✅ Redirecionamento para nova oferta com nome na URL

**Dados salvos no localStorage:**
```json
{
  "name": "Victor",
  "fullName": "Victor Marques", 
  "email": "victor@email.com",
  "timestamp": 1703123456789
}
```

### 2. **Nova Oferta** (`nova-oferta/index.html`)
- ✅ Personalização da página com nome do lead
- ✅ Recuperação dos dados do localStorage
- ✅ Botões de compra redirecionam para checkout com dados

**URL gerada para checkout:**
```
checkout.html?email=victor@email.com&name=Victor%20Marques&first_name=Victor&utm_source=nova_oferta&utm_campaign=metaforas_visuais&lead_timestamp=1703123456789
```

### 3. **Checkout** (`checkout.html`)
- ✅ Recebe dados via parâmetros da URL
- ✅ Pré-preenche formulário com dados do lead
- ✅ Mostra informações de debug
- ✅ Simula finalização da compra

## 🔧 Como Usar

### Para Hotmart/Kiwify:
1. Substitua a URL no arquivo `nova-oferta/script.js`:
```javascript
const checkoutUrl = 'https://pay.hotmart.com/SEU_CHECKOUT_ID';
```

2. Os dados do lead serão passados como parâmetros:
```
https://pay.hotmart.com/SEU_CHECKOUT_ID?email=victor@email.com&name=Victor%20Marques&first_name=Victor&utm_source=nova_oferta&utm_campaign=metaforas_visuais&lead_timestamp=1703123456789
```

### Para Checkout Personalizado:
- Use a página `checkout.html` como base
- Adapte o formulário conforme necessário
- Integre com seu processador de pagamento

## 📊 Debug e Monitoramento

### Console Logs:
- **Página principal**: Confirma salvamento dos dados
- **Nova oferta**: Mostra dados recuperados e URL do checkout
- **Checkout**: Exibe todos os parâmetros recebidos

### Verificação Manual:
1. Abra DevTools (F12)
2. Vá para Application > Local Storage
3. Verifique se `leadData` está salvo

## 🎯 Benefícios

✅ **Rastreamento completo** do lead através do funil
✅ **Personalização** em todas as etapas
✅ **Dados preservados** mesmo se usuário fechar o navegador
✅ **UTM tracking** para análise de conversão
✅ **Compatível** com qualquer plataforma de checkout
✅ **Fallback** caso dados não estejam disponíveis

## 🚀 Próximos Passos

1. **Teste o fluxo completo**:
   - Preencha o formulário na página principal
   - Verifique personalização na nova oferta
   - Clique em "Comprar" e veja os dados no checkout

2. **Configure sua plataforma de pagamento**:
   - Substitua a URL do checkout
   - Teste com dados reais

3. **Adicione analytics** (opcional):
   - Google Analytics
   - Facebook Pixel
   - Hotjar/Clarity

## 📝 Arquivos Modificados

- `script.js` - Salvamento dos dados no localStorage
- `nova-oferta/script.js` - Recuperação e passagem dos dados
- `nova-oferta/index.html` - Link para CSS específico
- `checkout.html` - Página de exemplo (NOVO)
- `nova-oferta/styles.css` - Correção do valor R$ 608

---

**🎉 Sistema pronto para uso!** Teste o fluxo completo e ajuste conforme necessário. 