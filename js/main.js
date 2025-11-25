/**
 * ============================================================
 * EVAN AMAYA - PORTFOLIO JAVASCRIPT
 * Desarrollador Web Front-end | Colombia, Bogota
 * Optimizado con animaciones estilo GSAP
 * ============================================================
 */

// ====================================================================
// LOADING SCREEN
// ====================================================================
const loadingScreen = document.querySelector('.loading-screen');

window.addEventListener('load', () => {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
    }
});

// ====================================================================
// NAVEGACION Y HEADER
// ====================================================================

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect para header glassmorphism
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, { passive: true });

// Active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav-link');

const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinkElements.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menu al hacer click en un link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ====================================================================
// SMOOTH SCROLL MEJORADO - Estilo GSAP
// ====================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Animacion suave estilo GSAP
            smoothScrollTo(offsetPosition, 800);
        }
    });
});

// Funcion de smooth scroll personalizada con easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function: easeOutExpo
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeOutExpo(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ====================================================================
// CODE TABS FUNCTIONALITY
// ====================================================================

const codeTabs = document.querySelectorAll('.code-tab');
const codeContents = document.querySelectorAll('.code-content');

codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const lang = tab.dataset.lang;

        // Remove active class from all tabs and contents
        codeTabs.forEach(t => t.classList.remove('active'));
        codeContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const content = document.querySelector(`[data-content="${lang}"]`);
        if (content) {
            content.classList.add('active');
        }
    });
});

// ====================================================================
// INTERSECTION OBSERVER AVANZADO - Estilo GSAP ScrollTrigger
// ====================================================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Si tiene hijos con delays escalonados
            const staggerChildren = entry.target.querySelectorAll('[data-stagger]');
            staggerChildren.forEach((child, index) => {
                child.style.transitionDelay = `${index * 0.1}s`;
                setTimeout(() => {
                    child.classList.add('animated');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observar todos los elementos con clases de animacion
document.querySelectorAll('.animate-on-scroll, .animate-fade-left, .animate-fade-right, .animate-scale').forEach(el => {
    animationObserver.observe(el);
});

// ====================================================================
// PARALLAX EFFECT - Estilo GSAP ScrollTrigger
// ====================================================================

const parallaxElements = document.querySelectorAll('.parallax-element');
const heroPhoto = document.querySelector('.hero-photo');
const heroContent = document.querySelector('.hero-content');

let ticking = false;

function updateParallax() {
    const scrollY = window.pageYOffset;

    // Efecto parallax en la foto del hero
    if (heroPhoto && scrollY < window.innerHeight) {
        const parallaxValue = scrollY * 0.3;
        heroPhoto.style.transform = `translateY(${parallaxValue}px)`;
    }

    // Efecto de desvanecimiento en el contenido del hero
    if (heroContent && scrollY < window.innerHeight) {
        const opacity = Math.max(1 - (scrollY / (window.innerHeight * 0.8)), 0);
        const translateY = scrollY * 0.5;
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${translateY}px)`;
    }

    // Parallax en otros elementos
    parallaxElements.forEach(el => {
        const speed = el.dataset.parallaxSpeed || 0.2;
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const parallaxY = (window.innerHeight - rect.top) * speed;
            el.style.transform = `translateY(${parallaxY}px)`;
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// ====================================================================
// CURSOR PERSONALIZADO (Desktop only)
// ====================================================================

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower && window.matchMedia('(min-width: 769px)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animacion suave del cursor
    function animateCursor() {
        // Cursor principal - sigue rapido
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Cursor follower - sigue mas lento
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Efectos en hover de elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .tech-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.opacity = '0';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.opacity = '1';
        });
    });
}

// ====================================================================
// EFECTO DE TEXTO TYPING (opcional)
// ====================================================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ====================================================================
// ANIMACION DE NUMEROS (Contador)
// ====================================================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ====================================================================
// MAGNETIC BUTTONS EFFECT
// ====================================================================

const magneticButtons = document.querySelectorAll('.btn-gradient');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ====================================================================
// TILT EFFECT PARA PROJECT CARDS
// ====================================================================

const tiltCards = document.querySelectorAll('.project-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ====================================================================
// LAZY LOADING PARA IMAGENES
// ====================================================================

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '100px'
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// ====================================================================
// PRELOAD DE RECURSOS CRITICOS
// ====================================================================

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
}

// ====================================================================
// SCROLL PROGRESS BAR
// ====================================================================

const progressBar = document.querySelector('.scroll-progress');

if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ====================================================================
// PERFORMANCE OPTIMIZATIONS
// ====================================================================

// Debounce function para eventos de scroll/resize
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para animaciones
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimizar resize events
window.addEventListener('resize', debounce(() => {
    // Recalcular posiciones si es necesario
    updateActiveNavLink();
}, 250));

// ====================================================================
// ACCESSIBILITY: Keyboard Navigation
// ====================================================================

document.addEventListener('keydown', (e) => {
    // ESC cierra menu mobile
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// ====================================================================
// INIT & LOG
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    updateActiveNavLink();

    console.log('%c Portfolio cargado correctamente', 'color: #0d9488; font-size: 14px; font-weight: bold;');
    console.log('%c Desarrollado por Evan Amaya', 'color: #a0a0a0; font-size: 12px;');
    console.log('%c Con animaciones estilo GSAP', 'color: #14b8a6; font-size: 11px;');
});

// ====================================================================
// SISTEMA DE PARTÍCULAS INTERACTIVAS
// ====================================================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = this.getParticleCount();
        this.animationId = null;
        this.colors = ['#0d9488', '#14b8a6', '#0f766e', '#2dd4bf'];

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50;
        if (width < 1024) return 80;
        return 120;
    }

    init() {
        this.resize();
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: Math.random() * 0.5 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', debounce(() => {
            this.resize();
            this.particleCount = this.getParticleCount();
            this.init();
        }, 250));

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Click para crear explosion de particulas
        window.addEventListener('click', (e) => {
            for (let i = 0; i < 5; i++) {
                const particle = this.createParticle(e.clientX, e.clientY);
                particle.speedX = (Math.random() - 0.5) * 4;
                particle.speedY = (Math.random() - 0.5) * 4;
                particle.size = Math.random() * 4 + 2;
                this.particles.push(particle);
            }
            // Limitar particulas
            if (this.particles.length > this.particleCount + 50) {
                this.particles.splice(0, this.particles.length - this.particleCount);
            }
        });
    }

    drawParticle(particle, time) {
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7;

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.opacity * pulse;
        this.ctx.fill();

        // Glow effect
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.globalAlpha = 1;
    }

    connectParticles() {
        const maxDistance = 120;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(13, 148, 136, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Movimiento base
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Interaccion con el mouse
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
    }

    animate() {
        const time = Date.now() * 0.001;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Actualizar y dibujar particulas
        for (const particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle, time);
        }

        // Conectar particulas cercanas
        this.connectParticles();

        // Mouse glow effect
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouse.radius
            );
            gradient.addColorStop(0, 'rgba(13, 148, 136, 0.15)');
            gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');

            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Inicializar sistema de particulas
const particleSystem = new ParticleSystem();

