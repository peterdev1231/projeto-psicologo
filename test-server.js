const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: './vercel.env.local' });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint - mesma lógica do api/subscribe.js
app.post('/api/subscribe', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validação básica
        if (!name || !email) {
            return res.status(400).json({ message: 'Nome e email são obrigatórios' });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email inválido' });
        }

        console.log('📧 Teste de integração:');
        console.log('Nome:', name);
        console.log('Email:', email);
        console.log('URL AC:', process.env.ACTIVECAMPAIGN_URL);
        console.log('Lista ID:', process.env.ACTIVECAMPAIGN_LIST_ID);

        // Dados para ActiveCampaign
        const contactData = {
            contact: {
                email: email,
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || '',
                tags: ['metaforas-visuais', 'landing-page']
            }
        };

        // 1. Criar/atualizar contato
        const acResponse = await fetch(`${process.env.ACTIVECAMPAIGN_URL}/api/3/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY
            },
            body: JSON.stringify(contactData)
        });

        console.log('🔗 Response Status:', acResponse.status);

        if (!acResponse.ok) {
            const errorText = await acResponse.text();
            console.error('❌ Erro ActiveCampaign:', errorText);
            return res.status(500).json({ 
                message: 'Erro ao conectar com ActiveCampaign',
                error: errorText 
            });
        }

        const contactResult = await acResponse.json();
        const contactId = contactResult.contact.id;
        console.log('✅ Contato criado ID:', contactId);

        // 2. Adicionar à lista específica
        if (process.env.ACTIVECAMPAIGN_LIST_ID) {
            const listData = {
                contactList: {
                    list: process.env.ACTIVECAMPAIGN_LIST_ID,
                    contact: contactId,
                    status: 1
                }
            };

            const listResponse = await fetch(`${process.env.ACTIVECAMPAIGN_URL}/api/3/contactLists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY
                },
                body: JSON.stringify(listData)
            });

            if (listResponse.ok) {
                console.log('✅ Adicionado à lista com sucesso!');
            } else {
                console.log('⚠️ Erro ao adicionar à lista (contato foi criado)');
            }
        }
        
        return res.status(200).json({ 
            message: 'Sucesso! Suas metáforas foram enviadas!',
            success: true,
            contactId: contactId
        });

    } catch (error) {
        console.error('❌ Erro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Servir o index.html na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('🚀 Servidor rodando em http://localhost:' + PORT);
    console.log('📧 ActiveCampaign URL:', process.env.ACTIVECAMPAIGN_URL || 'NÃO CONFIGURADO');
    console.log('📋 Lista ID:', process.env.ACTIVECAMPAIGN_LIST_ID || 'NÃO CONFIGURADO');
    console.log('🔑 API Key:', process.env.ACTIVECAMPAIGN_API_KEY ? 'CONFIGURADO' : 'NÃO CONFIGURADO');
    console.log('\n💡 Teste o formulário e veja os logs aqui!');
}); 