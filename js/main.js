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
        'Analista de Dados',
        'UX/UI Designer',
        'Dev front-end / mobile',
        'Entusiasta das novas tecnologias',
        'Criadora de Experiências Digitais',
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

/* ── GitHub Projects ── */
(function initProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    /* Mapeamento de linguagem → cor */
    const langColors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'HTML':       '#e34c26',
        'CSS':        '#563d7c',
        'Python':     '#3572A5',
        'C#':         '#178600',
        'Dart':       '#00B4AB',
        'Java':       '#b07219',
        'Kotlin':     '#A97BFF',
        'Swift':      '#F05138',
        'Jupyter Notebook': '#DA5B0B',
    };

    /* Descrições e ícones de fallback */
    const fallbackRepos = [
        {
            name: 'MindCracker',
            description: 'Jogo de memória desenvolvido com Unity e C# — desafie sua mente!',
            language: 'C#',
            html_url: 'https://github.com/DyeniferFrazao/MindCracker',
            stargazers_count: 0,
            topics: ['unity', 'game', 'csharp'],
        },
        {
            name: 'SpaceMarker',
            description: 'Jogo espacial criado com Python e PyGame — explore o universo em pixels.',
            language: 'Python',
            html_url: 'https://github.com/DyeniferFrazao/SpaceMarker',
            stargazers_count: 0,
            topics: ['python', 'pygame', 'game'],
        },
        {
            name: 'Portifolio',
            description: 'Portfólio pessoal com design glassmorphism, animações e tema purple/code.',
            language: 'HTML',
            html_url: 'https://github.com/DyeniferFrazao/Portifolio',
            stargazers_count: 0,
            topics: ['html', 'css', 'javascript', 'portfolio'],
        },
    ];

    function langIcon(lang) {
        const icons = {
            'C#': '🎮', 'Python': '🐍', 'HTML': '🌐',
            'JavaScript': '⚡', 'TypeScript': '🔷',
            'CSS': '🎨', 'Dart': '🎯', 'Java': '☕',
            'Kotlin': '💜', 'Swift': '🍎',
            'Jupyter Notebook': '📓',
        };
        return icons[lang] || '💻';
    }

    function renderCards(repos) {
        grid.innerHTML = '';
        repos.forEach(repo => {
            const color = langColors[repo.language] || '#68B2F8';
            const icon  = langIcon(repo.language);
            const desc  = repo.description || 'Repositório no GitHub';
            const tags  = (repo.topics || []).slice(0, 3)
                .map(t => `<span class="proj-tag">${t}</span>`).join('');

            const card = document.createElement('article');
            card.className = 'proj-card';
            card.innerHTML = `
                <div class="proj-card-top">
                    <span class="proj-icon">${icon}</span>
                    <a class="proj-link" href="${repo.html_url}" target="_blank" rel="noopener">
                        ↗
                    </a>
                </div>
                <h3 class="proj-name">${repo.name}</h3>
                <p class="proj-desc">${desc}</p>
                <div class="proj-footer">
                    <span class="proj-lang">
                        <span class="proj-lang-dot" style="background:${color}"></span>
                        ${repo.language || 'Code'}
                    </span>
                    <div class="proj-tags">${tags}</div>
                </div>`;
            grid.appendChild(card);
        });
    }

    /* Tenta a API do GitHub; usa fallback se falhar */
    fetch('https://api.github.com/users/DyeniferFrazao/repos?sort=updated&per_page=12')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(repos => {
            const filtered = repos.filter(r =>
                !r.fork && r.name !== 'DyeniferFrazao'
            );
            renderCards(filtered.length ? filtered : fallbackRepos);
        })
        .catch(() => renderCards(fallbackRepos));
})();
