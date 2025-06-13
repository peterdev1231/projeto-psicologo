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
        
        const dayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const dayText = dayNames[now.getDay()];
        
        const hours = deadline.getHours().toString().padStart(2, '0');
        const minutes = deadline.getMinutes().toString().padStart(2, '0');
        
        return `hoje ${dayText} até ${hours}:${minutes}`;
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
                        `Últimos <span id="minutes-left" style="color: #ef4444; font-weight: 600;">${totalMinutesLeft}</span> minutos!`;
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