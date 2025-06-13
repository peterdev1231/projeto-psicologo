export default async function handler(req, res) {
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

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

        // Dados para ActiveCampaign
        const contactData = {
            contact: {
                email: email,
                firstName: name.split(' ')[0], // Primeiro nome
                lastName: name.split(' ').slice(1).join(' ') || '', // Resto do nome
                tags: ['metaforas-visuais', 'landing-page'] // Tags para organizar
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

        if (!acResponse.ok) {
            console.error('Erro ActiveCampaign:', await acResponse.text());
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }

        const contactResult = await acResponse.json();
        const contactId = contactResult.contact.id;

        // 2. Adicionar à lista específica (se configurada)
        if (process.env.ACTIVECAMPAIGN_LIST_ID) {
            const listData = {
                contactList: {
                    list: process.env.ACTIVECAMPAIGN_LIST_ID,
                    contact: contactId,
                    status: 1 // 1 = subscribed, 2 = unsubscribed
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

            if (!listResponse.ok) {
                console.error('Erro ao adicionar à lista:', await listResponse.text());
                // Não falha aqui - contato foi criado com sucesso
            }
        }
        
        return res.status(200).json({ 
            message: 'Sucesso! Suas metáforas foram enviadas!',
            success: true 
        });

    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
} 