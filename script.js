// DOM Elements
const earlyAccessBtn = document.getElementById('early-access-btn');
const mainCtaBtn = document.getElementById('main-cta-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalForm = document.getElementById('modal-form');
const benefitItems = document.querySelectorAll('.benefit-item');

// Countdown Elements
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Modal handling
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for opening modal
earlyAccessBtn.addEventListener('click', openModal);
mainCtaBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Modal form submission
modalForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const submitBtn = document.querySelector('.modal-submit-btn');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!name) {
        showNotification('Como prefere ser chamado(a)? Precisamos personalizar sua entrega', 'error');
        nameInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Precisamos de um email válido para enviar suas metáforas', 'error');
        emailInput.focus();
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'ENVIANDO...';
    submitBtn.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    submitBtn.disabled = true;
    
    try {
        // Para teste local - se não conseguir conectar com o backend, simula sucesso
        let response, data;
        
        try {
            // Tenta enviar para backend via Vercel Function
            response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        });

            data = await response.json();
        } catch (fetchError) {
            // Se falhar (teste local), simula sucesso
            console.log('Modo teste local ativado - simulando envio bem-sucedido');
            response = { ok: true };
            data = { success: true };
        }

        if (response.ok && data.success) {
            // Salva os dados do lead no localStorage para usar no checkout
            const firstName = name.split(' ')[0];
            localStorage.setItem('leadData', JSON.stringify({
                name: firstName,
                fullName: name,
                email: email,
                timestamp: Date.now()
            }));
            
            // Redireciona para a página de oferta com o nome como parâmetro
            window.location.href = `nova-oferta/index.html?name=${encodeURIComponent(firstName)}`;

        } else {
            showNotification(data.message || 'Erro ao enviar. Tente novamente.', 'error');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email autocomplete functionality
function initEmailAutocomplete() {
    const emailInput = document.getElementById('user-email');
    if (!emailInput) return;

    // Provedores populares no Brasil
    const emailProviders = [
        'gmail.com',
        'hotmail.com',
        'outlook.com',
        'yahoo.com.br',
        'yahoo.com',
        'uol.com.br',
        'bol.com.br',
        'terra.com.br',
        'ig.com.br',
        'globo.com',
        'r7.com',
        'live.com',
        'icloud.com',
        'msn.com'
    ];

    let autocompleteContainer = null;

    function createAutocompleteContainer() {
        if (autocompleteContainer) return;
        
        autocompleteContainer = document.createElement('div');
        autocompleteContainer.className = 'email-autocomplete';
        autocompleteContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            display: none;
        `;
        
        // Posicionar relativo ao input
        emailInput.parentNode.style.position = 'relative';
        emailInput.parentNode.appendChild(autocompleteContainer);
    }

    function showSuggestions(userInput) {
        if (!userInput.includes('@')) {
            hideAutocomplete();
            return;
        }

        const [localPart, domainPart] = userInput.split('@');
        if (!localPart || domainPart === undefined) {
            hideAutocomplete();
            return;
        }

        // Filtrar provedores que começam com o que o usuário digitou
        const matchingProviders = emailProviders.filter(provider => 
            provider.toLowerCase().startsWith(domainPart.toLowerCase())
        );

        if (matchingProviders.length === 0 || domainPart === '') {
            // Se não há match ou usuário acabou de digitar @, mostrar todos
            displaySuggestions(localPart, domainPart === '' ? emailProviders : []);
        } else {
            displaySuggestions(localPart, matchingProviders);
        }
    }

    function displaySuggestions(localPart, providers) {
        if (!autocompleteContainer) createAutocompleteContainer();
        
        autocompleteContainer.innerHTML = '';
        
        if (providers.length === 0) {
            hideAutocomplete();
            return;
        }

        // Limitar a 6 sugestões para não sobrecarregar
        const limitedProviders = providers.slice(0, 6);
        
        limitedProviders.forEach(provider => {
            const suggestion = document.createElement('div');
            suggestion.className = 'email-suggestion';
            suggestion.textContent = `${localPart}@${provider}`;
            suggestion.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
                transition: background-color 0.2s ease;
                font-size: 14px;
                color: #374151;
            `;
            
            // Hover effect
            suggestion.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f9fafb';
            });
            
            suggestion.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
            
            // Click to select
            suggestion.addEventListener('click', function() {
                emailInput.value = this.textContent;
                hideAutocomplete();
                emailInput.focus();
                
                // Trigger validation
                emailInput.dispatchEvent(new Event('input'));
            });
            
            autocompleteContainer.appendChild(suggestion);
        });
        
        autocompleteContainer.style.display = 'block';
    }

    function hideAutocomplete() {
        if (autocompleteContainer) {
            autocompleteContainer.style.display = 'none';
        }
    }

    // Event listeners
    emailInput.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        showSuggestions(value);
    });

    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAutocomplete();
        }
        
        // Navegação com setas (opcional - implementação básica)
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const suggestions = autocompleteContainer?.querySelectorAll('.email-suggestion');
            if (suggestions && suggestions.length > 0) {
                // Implementação básica - foca no primeiro item
                suggestions[0].click();
            }
        }
    });

    // Esconder quando clicar fora
    document.addEventListener('click', function(e) {
        if (!emailInput.contains(e.target) && !autocompleteContainer?.contains(e.target)) {
            hideAutocomplete();
        }
    });

    // Esconder quando o input perde o foco (com delay para permitir cliques)
    emailInput.addEventListener('blur', function() {
        setTimeout(hideAutocomplete, 150);
    });
}

// Show notification function
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Scroll animations for benefit items
function observeElements() {
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

// Initialize scroll animations on load
document.addEventListener('DOMContentLoaded', function() {
    observeElements();
    initEmailAutocomplete(); // Inicializar autocomplete de email
});

// Add hover effects to buttons
function addButtonEffects() {
    const buttons = [earlyAccessBtn, mainCtaBtn];
    
    buttons.forEach(button => {
        if (button) {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
}

// Add click ripple effect
function addRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple to buttons
[earlyAccessBtn, mainCtaBtn].forEach(button => {
    if (button) {
        button.addEventListener('click', addRippleEffect);
    }
});

// Typing effect removed - testimonial shows static text

// Parallax effect for methodology card
function addParallaxEffect() {
    const methodologyCard = document.querySelector('.methodology-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (methodologyCard) {
            methodologyCard.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Smooth reveal animation for about section
function addAboutAnimation() {
    const aboutSection = document.querySelector('.about-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromLeft 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', function() {
    addButtonEffects();
    addParallaxEffect();
    addAboutAnimation();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes success-bounce {
            0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
            40% { transform: translateY(-10px) scale(1.1); }
            80% { transform: translateY(-3px) scale(1.05); }
        }
        
        @keyframes slideInFromLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .benefit-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Add subtle mouse tracking for golden highlights
document.addEventListener('mousemove', function(e) {
    const highlights = document.querySelectorAll('.highlight');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    highlights.forEach((highlight, index) => {
        const intensity = 0.5 + (mouseX + mouseY) * 0.25;
        highlight.style.textShadow = `0 0 ${intensity * 20}px rgba(245, 158, 11, ${intensity * 0.5})`;
    });
});

// Add loading states
function addLoadingStates() {
    // Simulate loading for images
    const imagePlaceholder = document.querySelector('.image-placeholder');
    if (imagePlaceholder) {
        imagePlaceholder.style.background = `
            linear-gradient(90deg, #2d2d2d 25%, #3d3d3d 50%, #2d2d2d 75%)
        `;
        imagePlaceholder.style.backgroundSize = '200% 100%';
        imagePlaceholder.style.animation = 'loading-shimmer 1.5s infinite';
    }
    
    const shimmerStyle = document.createElement('style');
    shimmerStyle.textContent = `
        @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
    `;
    document.head.appendChild(shimmerStyle);
}

// Initialize loading states
addLoadingStates();

// Countdown Timer Functionality
function initializeCountdown() {
    const deadlineDateElement = document.getElementById('deadline-date');
    const minutesLeftElement = document.getElementById('minutes-left');
    
    // Get all countdown elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Set countdown end time once when page loads
    const countdownEnd = new Date().getTime() + (10 * 60 * 1000); // 10 minutes from page load
    
    // Function to format the deadline date based on actual countdown time
    function formatDeadlineDate(timeLeftMs) {
        const now = new Date();
        const deadline = new Date(now.getTime() + timeLeftMs);
        
        const hours = deadline.getHours().toString().padStart(2, '0');
        const minutes = deadline.getMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes} de hoje`;
    }
    
    // Set the initial deadline date text (will be updated in countdown)
    const initialTimeLeft = countdownEnd - new Date().getTime();
    deadlineDateElement.textContent = formatDeadlineDate(Math.max(0, initialTimeLeft));
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = countdownEnd - now;
        
        if (timeLeft > 0) {
            // Both counters use the same 30-minute countdown for consistency
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            const totalMinutesLeft = Math.floor(timeLeft / (1000 * 60));
            
            // Since it's always "today", days is always 00
            daysElement.textContent = '00';
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // Update mini counter
            minutesLeftElement.textContent = totalMinutesLeft;
            
            // Update deadline date to match countdown
            deadlineDateElement.textContent = formatDeadlineDate(timeLeft);
            
            // Add subtle urgency effects when time is running low
            if (totalMinutesLeft <= 10) {
                document.querySelector('.countdown-timer').style.borderColor = 'rgba(239, 68, 68, 0.4)';
                
                if (totalMinutesLeft <= 5) {
                    // Very subtle red tint
                    document.querySelector('.countdown-mini').style.background = 'rgba(239, 68, 68, 0.1)';
                    document.querySelector('.countdown-mini').style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    
                    // Update mini counter text for urgency
                    document.querySelector('.countdown-mini').innerHTML = 
                        `Últimos <span id="minutes-left" style="color: #ef4444; font-weight: 600;">${totalMinutesLeft}</span> min!`;
                }
            }
            
        } else {
            // Countdown ended - page will need to be refreshed for new countdown
            // Show temporary "resetting" message
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '10';
            secondsElement.textContent = '00';
            minutesLeftElement.textContent = '10';
            
            // Update banner for ended countdown
            document.querySelector('.countdown-title').textContent = 'TEMPO ESGOTADO';
            document.querySelector('.countdown-mini').innerHTML = 
                'Recarregue a página para nova chance!';
            
            // Reset styles
            document.querySelector('.countdown-timer').style.borderColor = '';
            document.querySelector('.countdown-mini').style.background = '';
            document.querySelector('.countdown-mini').style.borderColor = '';
            
            // Update deadline
            deadlineDateElement.textContent = 'tempo esgotado';
            
            // After 5 seconds, suggest page refresh
            setTimeout(() => {
                document.querySelector('.countdown-mini').innerHTML = 
                    'Recarregue a página (F5) para nova oportunidade!';
            }, 5000);
        }
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
    
    // Deadline date is now updated in real-time within updateCountdown function
    // No need for separate interval
    
    // Add urgent pulse animation styles
    const urgentStyle = document.createElement('style');
    urgentStyle.textContent = `
        @keyframes pulse-urgent {
            0%, 100% { 
                transform: scale(1); 
                text-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
            }
            50% { 
                transform: scale(1.15); 
                text-shadow: 0 4px 16px rgba(239, 68, 68, 0.8);
            }
        }
    `;
    document.head.appendChild(urgentStyle);
}

// Initialize countdown when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
});

// Add click handler to countdown banner to scroll to CTA
document.querySelector('.countdown-banner').addEventListener('click', function() {
    const finalCTA = document.querySelector('.final-cta');
    finalCTA.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}); 