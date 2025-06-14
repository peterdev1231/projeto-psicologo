document.addEventListener('DOMContentLoaded', () => {
    // Função para disparar o evento de Lead para o Facebook Pixel
    function trackFacebookLead() {
        if (typeof fbq !== 'function') {
            console.warn('Facebook Pixel (fbq) não encontrado. O evento de Lead não foi rastreado.');
            return;
        }

        // Tenta recuperar os dados do lead do localStorage para melhorar a correspondência
        const leadDataString = localStorage.getItem('leadData');
        let leadData = {};

        if (leadDataString) {
            try {
                const parsedData = JSON.parse(leadDataString);
                // Prepara os dados para o Advanced Matching do Facebook
                leadData = {
                    em: parsedData.email, // Email
                    fn: parsedData.name,   // First Name
                };
            } catch (e) {
                console.error('Erro ao parsear dados do lead do localStorage:', e);
            }
        }
        
        // Dispara o evento 'Lead' com os dados de correspondência avançada
        fbq('track', 'Lead', leadData);
        console.log('Evento de Lead enviado para o Facebook Pixel.', leadData);
    }

    // Chama a função para rastrear o lead assim que a página carregar
    trackFacebookLead();

    // Função para personalizar o conteúdo da página com o nome do lead
    function updateDynamicContent() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const leadName = urlParams.get('name');
            const firstName = leadName ? decodeURIComponent(leadName).trim().split(' ')[0] : 'Psi';
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

            // Personaliza o título principal que pode conter HTML
            const mainTitleElement = document.querySelector('.offer-hero h1');
            if (mainTitleElement) {
                mainTitleElement.innerHTML = mainTitleElement.innerHTML.replace('Psi,', `${capitalizedFirstName},`);
            }

            // Mapeamento de outros elementos a serem atualizados apenas com texto
            const elementsToUpdate = {
                'header-name': capitalizedFirstName,
                'lead-name': capitalizedFirstName,
                'surprise-name': capitalizedFirstName,
                'surprise-name-2': capitalizedFirstName
            };

            // Adiciona a classe .dynamic-name a esta lista para ser atualizada
            const dynamicNameElements = document.querySelectorAll('.dynamic-name');
            dynamicNameElements.forEach(el => {
                el.textContent = capitalizedFirstName;
            });

            for (const id in elementsToUpdate) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = elementsToUpdate[id];
                }
            }
            
            // Garante que a assinatura tenha o texto correto, independentemente da personalização
            const fromNameElement = document.getElementById('from-name');
            if(fromNameElement) {
                fromNameElement.textContent = "De: Sua colega e mentora";
            }

            if (leadName) {
                 console.log(`✔️ Nomes personalizados para: ${capitalizedFirstName}`);
            } else {
                console.log("ℹ️ Nenhum parâmetro 'name' encontrado na URL. Usando fallback 'Psi'.");
            }
        } catch (error) {
            console.error('Erro ao personalizar nomes na página:', error);
        }
    }

    // Chama a função de personalização no início
    updateDynamicContent();

    const buyNowBtn = document.getElementById('buy-now-btn');
    const finalCtaBtn = document.getElementById('final-page-cta');
    const skipOfferLink = document.getElementById('skip-offer-link');
    const priceSectionCta = document.getElementById('price-section-cta');

    // URL do seu checkout (ex: Hotmart, Kiwify, etc.)
    const checkoutUrl = 'https://pay.hotmart.com/F100283965V?checkoutMode=10';
    let audioContext = null; // Para gerenciar o áudio desbloqueado pelo navegador

    // URL para onde o usuário vai se recusar a oferta (pode ser uma página de obrigado)
    const thankYouUrl = '../obrigado.html'; // Você precisará criar esta página

    // Função para construir URL do checkout com dados do lead
    function getCheckoutUrlWithData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const nameFromUrl = urlParams.get('name');
            const emailFromUrl = urlParams.get('email');

            // Prioriza dados da URL, pois são mais confiáveis no redirecionamento
            if (nameFromUrl && emailFromUrl) {
                const params = new URLSearchParams({
                    email: emailFromUrl,
                    name: nameFromUrl, // Hotmart usa 'name' para o nome completo
                    first_name: nameFromUrl.split(' ')[0],
                    utm_source: 'nova_oferta',
                    utm_campaign: 'metaforas_visuais'
                });
                console.log('Dados da URL usados para o checkout.');
                return `${checkoutUrl}&${params.toString()}`;
            }

            // Fallback para localStorage se os dados não estiverem na URL
            const leadData = localStorage.getItem('leadData');
            if (leadData) {
                const data = JSON.parse(leadData);
                const params = new URLSearchParams({
                    email: data.email,
                    name: data.fullName,
                    first_name: data.name,
                    utm_source: 'nova_oferta',
                    utm_campaign: 'metaforas_visuais',
                    lead_timestamp: data.timestamp
                });
                console.log('Dados do localStorage usados para o checkout (fallback).');
                return `${checkoutUrl}&${params.toString()}`;
            }
        } catch (error) {
            console.error('Erro ao construir URL do checkout:', error);
        }
        
        // Se tudo falhar, retorna a URL base
        console.log('Nenhum dado encontrado para pré-preenchimento.');
        return checkoutUrl;
    }

    // Debug: Mostra dados do lead capturados
    try {
        const leadData = localStorage.getItem('leadData');
        if (leadData) {
            const data = JSON.parse(leadData);
            console.log('📧 Dados do lead capturados:', data);
            console.log('🔗 URL do checkout será:', getCheckoutUrlWithData());
        } else {
            console.log('⚠️ Nenhum dado de lead encontrado no localStorage');
        }
    } catch (error) {
        console.error('Erro ao verificar dados do lead:', error);
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            console.log('Redirecionando para o checkout...');
            window.location.href = getCheckoutUrlWithData();
        });
    }

    if (finalCtaBtn) {
        finalCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecionando para o checkout (CTA Final)...');
            window.location.href = getCheckoutUrlWithData();
        });
    }

    if (priceSectionCta) {
        priceSectionCta.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecionando para o checkout (Price Section)...');
            window.location.href = getCheckoutUrlWithData();
        });
    }

    if (skipOfferLink) {
        skipOfferLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Usuário recusou a oferta. Redirecionando...');
            window.location.href = thankYouUrl;
        });
    }

    // Event listener para o botão da seção surpresa
    const surpriseCtaBtn = document.getElementById('surprise-cta-btn');
    if (surpriseCtaBtn) {
        surpriseCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎁 Clique no CTA Surpresa - redirecionando para checkout...');
            window.location.href = getCheckoutUrlWithData();
        });
    }

    // Animações de entrada (reutilizando a lógica do script principal)
    function observeElements() {
        const benefitItems = document.querySelectorAll('.benefit-item');
        if (!benefitItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        benefitItems.forEach(item => {
            observer.observe(item);
        });
    }

    observeElements();

    // Funcionalidades de CRO
    initLocationNotification();
    initProgressBar();
    initSurpriseGift();
    initAudioUnlocker();
}); 

// ===== FUNCIONALIDADES DE CRO =====

// 1. Notificação com localização via IP
function initLocationNotification() {
    // Observer para detectar quando usuário chega na seção de oferta
    const offerSection = document.querySelector('.offer-price-section');
    if (!offerSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showLocationNotification();
                observer.unobserve(entry.target); // Mostra apenas uma vez
            }
        });
    }, {
        threshold: 0.3 // Quando 30% da seção estiver visível
    });

    observer.observe(offerSection);
}

function showLocationNotification() {
    // Tenta obter localização via IP
    getUserLocation().then(location => {
        const notification = createLocationNotification(location);
        document.body.appendChild(notification);
        
        // Mostra a notificação com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 500);

        // Remove após 8 segundos
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 8000);
    });
}

async function getUserLocation() {
    try {
        // Tenta obter localização via API gratuita
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.city && data.region) {
            return {
                city: data.city,
                state: data.region
            };
        }
    } catch (error) {
        console.log('Erro ao obter localização:', error);
    }
    
    // Fallback para São Paulo
    return {
        city: 'São Paulo',
        state: 'SP'
    };
}

function createLocationNotification(location) {
    const notification = document.createElement('div');
    notification.className = 'location-notification';
    
    const messages = [
        `Alguém de ${location.city}, ${location.state} acabou de garantir acesso!`,
        `Psicólogo(a) de ${location.city}, ${location.state} adquiriu há 2 minutos`,
        `Profissional de ${location.city}, ${location.state} garantiu o desconto!`,
        `Terapeuta de ${location.city}, ${location.state} acabou de comprar`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">🌟</div>
            <div class="notification-text">${randomMessage}</div>
            <div class="notification-close">×</div>
        </div>
    `;
    
    // Adiciona evento de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    });
    
    return notification;
}

// 2. Barra de progresso de bibliotecas disponíveis
function initProgressBar() {
    // Adiciona a barra de progresso na seção de oferta
    const offerSection = document.querySelector('.offer-price-section');
    if (!offerSection) return;

    const progressContainer = createProgressBar();
    offerSection.insertBefore(progressContainer, offerSection.firstChild);
    
    // Inicia a animação da barra
    startProgressAnimation();
}

function createProgressBar() {
    const container = document.createElement('div');
    container.className = 'libraries-progress-container';
    
    // Valor inicial fixo, removendo a dependência do localStorage
    let currentProgress = 67; // Começa sempre em 67%
    
    container.innerHTML = `
        <div class="progress-header">
            <div class="progress-icon">📚</div>
            <div class="progress-info">
                <h4>Bibliotecas Disponíveis Neste Preço</h4>
                <p>Apenas <span id="libraries-remaining">${Math.floor((100 - currentProgress) * 1.5)}</span> bibliotecas restantes por R$ 47</p>
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${currentProgress}%"></div>
                <div class="progress-text">
                    <span id="progress-percentage">${Math.round(currentProgress)}</span>% reservadas
                </div>
            </div>
        </div>
        <div class="progress-warning">
            <span class="warning-icon">⚠️</span>
            Quando atingir 100%, o preço volta para R$ 297
        </div>
    `;
    
    return container;
}

function startProgressAnimation() {
    let currentProgress = 67; // Inicia sempre do valor base
    
    // Primeira animação mais rápida para mostrar movimento
    setTimeout(() => {
        if (currentProgress < 89) {
            const initialIncrease = Math.random() * 0.8 + 0.3; // 0.3% a 1.1%
            currentProgress += initialIncrease;
            currentProgress = Math.min(currentProgress, 89);
            updateProgressDisplay(currentProgress);
        }
    }, 3000); // Primeira atualização em 3 segundos
    
    // Animações contínuas
    setInterval(() => {
        if (currentProgress < 89) {
            const increase = Math.random() * 0.6 + 0.2; // 0.2% a 0.8%
            currentProgress += increase;
            currentProgress = Math.min(currentProgress, 89);
            updateProgressDisplay(currentProgress);
        }
    }, Math.random() * 20000 + 15000); // A cada 15-35 segundos
}

function updateProgressDisplay(progress) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const librariesRemaining = document.getElementById('libraries-remaining');
    const progressContainer = document.querySelector('.libraries-progress-container');

    if (progressFill && progressPercentage && librariesRemaining) {
        progressFill.style.width = `${progress}%`;
        progressPercentage.textContent = Math.round(progress);
        
        // Lógica para calcular bibliotecas restantes
        const maxLibraries = 48; // Total de bibliotecas "virtuais"
        const remaining = Math.max(1, Math.floor(((100 - progress) / 33) * maxLibraries)); // Garante que nunca seja 0
        librariesRemaining.textContent = remaining;

        // Efeitos visuais de urgência
        if (progress > 85 && progressContainer) {
            progressContainer.classList.add('urgent');
        } else if (progressContainer) {
            progressContainer.classList.remove('urgent');
        }

        // Animação de pulso a cada atualização
        if (progressContainer) {
            progressContainer.classList.add('progress-update');
            setTimeout(() => progressContainer.classList.remove('progress-update'), 500);
        }
    }
}

// 3. PRESENTE SURPRESA PERSONALIZADO
function initSurpriseGift() {
    const giftContainer = document.getElementById('surprise-gift-section');
    const triggerElement = document.getElementById('surprise-trigger'); // Gatilho agora é o elemento invisível

    if (!giftContainer || !triggerElement) {
        console.log("Elemento #surprise-gift-section ou #surprise-trigger não encontrado. A função não será executada.");
        return;
    }

    let isGiftShown = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isGiftShown) {
                console.log("🎁 Fim do FAQ alcançado, ativando presente surpresa!");
                
                // Adiciona um pequeno atraso para o efeito ser mais notado
                setTimeout(() => {
                    giftContainer.classList.add('show');
                    
                    // Efeito de scroll suave e som
                    setTimeout(() => {
                        giftContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        playMagicBoxSound();
                        createConfettiExplosion();
                    }, 400);

                }, 500);

                isGiftShown = true;
                observer.unobserve(entry.target); // Para de observar após ativar
            }
        });
    }, { threshold: 0.5 }); // Ativa quando 50% do gatilho estiver visível

    observer.observe(triggerElement);
}

function personalizeSupriseGift() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let leadName = urlParams.get('name');
        
        if (leadName) {
            leadName = decodeURIComponent(leadName);
            const capitalizedName = leadName.charAt(0).toUpperCase() + leadName.slice(1).toLowerCase();
            
            // Personaliza os elementos com o nome
            const surpriseName1 = document.getElementById('surprise-name');
            const surpriseName2 = document.getElementById('surprise-name-2');
            
            if (surpriseName1) {
                surpriseName1.textContent = capitalizedName;
            }
            
            if (surpriseName2) {
                surpriseName2.textContent = capitalizedName;
            }
        }
    } catch (error) {
        console.error('Erro ao personalizar presente surpresa:', error);
    }
}

function showSurpriseGift() {
    const surpriseSection = document.getElementById('surprise-gift-section');
    if (!surpriseSection) return;
    
    // Toca o som da caixa mágica se abrindo
    playMagicBoxSound();
    
    // Adiciona classe para mostrar com animação
    surpriseSection.classList.add('show');
    
    // Efeito de confetes/sparkles visuais
    setTimeout(() => {
        createConfettiExplosion();
    }, 600);
    
    // Scroll suave até a seção
    setTimeout(() => {
        surpriseSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 500);
    
    // Log para debug
    console.log('🎁 Presente surpresa revelado!');
}

function playMagicBoxSound() {
    // Verifica se o áudio está desbloqueado. Se não, mostra apenas o fallback visual.
    if (!audioContext || audioContext.state !== 'running') {
        console.log('🔇 Áudio bloqueado ou não iniciado. Mostrando fallback visual.');
        createVisualSparkles(); // Mostra brilhos visuais como alternativa
        return;
    }

    try {
        // Sequência de sons para simular uma caixa mágica se abrindo
        const sounds = [
            { freq: 523.25, duration: 0.1, delay: 0 },     // C5 - início
            { freq: 659.25, duration: 0.1, delay: 0.1 },   // E5 
            { freq: 783.99, duration: 0.15, delay: 0.2 },  // G5
            { freq: 1046.5, duration: 0.2, delay: 0.35 },  // C6 - clímax
            { freq: 1318.5, duration: 0.3, delay: 0.5 },   // E6 - final mágico
        ];
        
        sounds.forEach(sound => {
            setTimeout(() => {
                createTone(audioContext, sound.freq, sound.duration);
            }, sound.delay * 1000);
        });
        
        // Som de "sparkle" adicional
        setTimeout(() => {
            createSparkleEffect(audioContext);
        }, 800);
        
    } catch (error) {
        console.log('Erro ao tocar o som:', error);
        createVisualSparkles(); // Fallback visual em caso de erro
    }
}

function createTone(audioContext, frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Envelope para som mais suave
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function createSparkleEffect(audioContext) {
    // Efeito de "sparkles" com frequências aleatórias
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const freq = 1000 + Math.random() * 1000; // Frequências altas
            createTone(audioContext, freq, 0.1);
        }, i * 50);
    }
}

function createVisualSparkles() {
    // Efeito visual de sparkles se o áudio não funcionar
    const surpriseSection = document.getElementById('surprise-gift-section');
    if (!surpriseSection) return;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '2rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
            
            surpriseSection.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }, i * 100);
    }
}

function createConfettiExplosion() {
    const surpriseSection = document.getElementById('surprise-gift-section');
    if (!surpriseSection) return;
    
    const confettiElements = ['🎉', '✨', '🌟', '💫', '🎊', '⭐'];
    const colors = ['#f59e0b', '#dc2626', '#7c3aed', '#059669', '#db2777'];
    
    // Cria explosão de confetes do centro
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const isEmoji = Math.random() > 0.3;
            
            if (isEmoji) {
                confetti.innerHTML = confettiElements[Math.floor(Math.random() * confettiElements.length)];
                confetti.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            } else {
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
            }
            
            confetti.style.position = 'absolute';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.left = '50%';
            confetti.style.top = '30%';
            
            // Direção aleatória para explosão
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 200 + 100;
            const gravity = 0.5;
            const life = Math.random() * 2000 + 1500;
            
            confetti.style.animation = `confettiExplosion ${life}ms ease-out forwards`;
            confetti.style.setProperty('--angle', angle + 'rad');
            confetti.style.setProperty('--velocity', velocity + 'px');
            confetti.style.setProperty('--gravity', gravity);
            
            surpriseSection.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, life);
        }, i * 50);
    }
}

function getCheckoutUrlWithSurpriseBonus() {
    try {
        const leadData = localStorage.getItem('leadData');
        if (leadData) {
            const data = JSON.parse(leadData);
            // Adiciona parâmetro especial para o bônus surpresa
            const params = new URLSearchParams({
                email: data.email,
                name: data.fullName,
                first_name: data.name,
                utm_source: 'nova_oferta',
                utm_campaign: 'metaforas_visuais',
                lead_timestamp: data.timestamp,
                surprise_bonus: 'kit_emergencia', // Parâmetro especial
                bonus_value: '127' // Valor do bônus adicional
            });
            return `${checkoutUrl}?${params.toString()}`;
        }
    } catch (error) {
        console.error('Erro ao recuperar dados do lead para surpresa:', error);
    }
    
    // Fallback com parâmetro de surpresa
    const params = new URLSearchParams({
        surprise_bonus: 'kit_emergencia',
        bonus_value: '127',
        utm_source: 'nova_oferta_surprise'
    });
    return `${checkoutUrl}?${params.toString()}`;
}

// ===== HELPERS & INICIALIZADORES =====

// Desbloqueia o AudioContext com a primeira interação do usuário
function initAudioUnlocker() {
    const unlockAudio = () => {
        if (audioContext === null) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createBufferSource();
            source.buffer = audioContext.createBuffer(1, 1, 22050);
            source.connect(audioContext.destination);
            source.start(0);
            console.log('🔊 Contexto de áudio desbloqueado.');
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
}