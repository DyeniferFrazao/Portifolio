/* ═══════════════════════════════════════════════════
   main.js — Portfólio Dyênifer Frazão (Shelly)
═══════════════════════════════════════════════════ */

/* ── Custom Cursor ── */
(function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Efeito de expansão em elementos interativos */
    const interactives = document.querySelectorAll(
        'a, button, .block, .ability-card, .social-link, input, textarea, .tag'
    );
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width       = '48px';
            ring.style.height      = '48px';
            ring.style.borderColor = 'rgba(104, 178, 248, 0.75)';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width       = '32px';
            ring.style.height      = '32px';
            ring.style.borderColor = 'rgba(104, 178, 248, 0.45)';
        });
    });
})();

/* ── Typewriter — cicla entre cargos ── */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = [
        'Desenvolvedora Full Stack',
        'UX/UI Designer',
        'Análise de Dados com Python',
        'Criadora de Experiências Digitais',
        'Engenheira de Soluções',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    function tick() {
        const current = roles[roleIndex];

        if (deleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = deleting ? 38 : 68;

        if (!deleting && charIndex === current.length) {
            delay    = 2200; // pausa antes de deletar
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting   = false;
            roleIndex  = (roleIndex + 1) % roles.length;
            delay      = 450;
        }

        setTimeout(tick, delay);
    }

    tick();
})();

/* ── Scroll Progress Bar ── */
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total    = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = ((scrolled / total) * 100) + '%';
    }, { passive: true });
})();

/* ── Header sticky com efeito de blur ── */
(function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 70) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
})();

/* ── Botão Scroll-to-Top ── */
(function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ── Menu mobile hambúrguer ── */
(function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav    = document.getElementById('navigation');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    /* Fecha ao clicar em um link */
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('open');
        });
    });
})();

/* ── Reveal lateral (Sobre) via IntersectionObserver ── */
(function initReveal() {
    const targets = document.querySelectorAll('.reveal-left, .reveal-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // revela só uma vez
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
})();

/* ── ScrollReveal para cards ── */
(function initScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;

    const sr = ScrollReveal({ reset: false });

    sr.reveal('.block', {
        origin:   'bottom',
        distance: '28px',
        duration: 620,
        delay:    80,
        interval: 90,
        easing:   'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    sr.reveal('.ability-card', {
        origin:   'bottom',
        distance: '28px',
        duration: 620,
        delay:    80,
        interval: 110,
        easing:   'cubic-bezier(0.4, 0, 0.2, 1)',
    });
})();

/* ── Terminal Bio — editável e persistente ── */
(function initBio() {
    const bio  = document.getElementById('bioOutput');
    const hint = document.getElementById('bioEditHint');
    if (!bio) return;

    const STORAGE_KEY = 'shelly_bio_v1';

    /* Restaura edições anteriores (preserva innerHTML com os spans coloridos) */
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) bio.innerHTML = saved;
    } catch {}

    /* Salva ao sair do campo */
    bio.addEventListener('blur', () => {
        try { localStorage.setItem(STORAGE_KEY, bio.innerHTML); } catch {}
    });

    /* Esconde o hint durante a edição */
    bio.addEventListener('focus', () => {
        if (hint) hint.style.opacity = '0';
    });
    bio.addEventListener('blur', () => {
        if (hint) hint.style.opacity = '1';
    });

    /* Impede Enter de criar <div> — usa <br> em vez disso */
    bio.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak');
        }
    });
})();
