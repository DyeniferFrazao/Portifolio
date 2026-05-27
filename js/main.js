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
            delay    = 2200;
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
                observer.unobserve(entry.target);
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

/* ══════════════════════════════════════════════════════════
   FULLPAGE NAVIGATION — dots laterais + setas + teclado
══════════════════════════════════════════════════════════ */
(function initFullPage() {
    const sections = Array.from(document.querySelectorAll('.fp-section'));
    if (!sections.length) return;

    let current  = 0;
    let locked   = false;
    const LOCK_MS = 800;

    /* Navega para a seção pelo índice */
    function goTo(idx, instant) {
        if (idx < 0 || idx >= sections.length) return;
        if (locked && !instant) return;

        locked  = true;
        current = idx;
        sections[current].scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
        updateUI();
        setTimeout(() => { locked = false; }, LOCK_MS);
    }

    /* ── Wheel — bloqueia scroll livre, navega por seção ── */
    window.addEventListener('wheel', (e) => {
        /* Permite scroll interno se a seção tiver overflow-y: auto */
        const sec = sections[current];
        const overflows = sec.scrollHeight > sec.clientHeight;
        if (overflows) {
            const atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 4;
            const atTop    = sec.scrollTop <= 1;
            if (e.deltaY > 0 && !atBottom) return; // ainda tem conteúdo abaixo
            if (e.deltaY < 0 && !atTop)    return; // ainda tem conteúdo acima
        }
        e.preventDefault();
        goTo(current + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    /* ── Touch swipe ── */
    let touchStartY = 0;
    window.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', e => {
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 50) goTo(current + (dy > 0 ? 1 : -1));
    }, { passive: true });

    /* ── Teclado ── */
    window.addEventListener('keydown', e => {
        if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
        if (['ArrowUp',   'PageUp'  ].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
    });

    /* ── Links âncora do nav ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            const idx    = sections.indexOf(target);
            if (idx !== -1) {
                e.preventDefault();
                goTo(idx, false);
            }
        });
    });

    /* ── Dots de navegação ── */
    const dotsEl = document.getElementById('pageDots');
    if (dotsEl) {
        sections.forEach((sec, i) => {
            const btn = document.createElement('button');
            btn.className = 'page-dot' + (i === 0 ? ' active' : '');
            btn.title     = sec.dataset.label || `Seção ${i + 1}`;
            btn.addEventListener('click', () => goTo(i, false));
            dotsEl.appendChild(btn);
        });
    }

    /* ── Setas prev/next ── */
    const arrowPrev = document.getElementById('arrowPrev');
    const arrowNext = document.getElementById('arrowNext');
    arrowPrev?.addEventListener('click', () => goTo(current - 1, false));
    arrowNext?.addEventListener('click', () => goTo(current + 1, false));

    /* ── Atualiza UI ── */
    function updateUI() {
        document.querySelectorAll('.page-dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );
        arrowPrev?.classList.toggle('hidden', current === 0);
        arrowNext?.classList.toggle('hidden', current >= sections.length - 1);
    }

    /* ── IntersectionObserver para sincronizar ao usar scroll do nav header ── */
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !locked) {
                const idx = sections.indexOf(entry.target);
                if (idx !== -1) { current = idx; updateUI(); }
            }
        });
    }, { threshold: 0.55 });
    sections.forEach(s => io.observe(s));

    updateUI();
})();

/* ══════════════════════════════════════════════════════════
   GITHUB — perfil ao vivo (stats card na seção Formação)
══════════════════════════════════════════════════════════ */
(function initGitHubProfile() {
    const container = document.getElementById('ghStats');
    if (!container) return;

    fetch('https://api.github.com/users/DyeniferFrazao')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(u => {
            container.innerHTML = `
                <div class="gh-stat">
                    <span class="gh-stat-val">${u.public_repos ?? '—'}</span>
                    <span class="gh-stat-label">repos</span>
                </div>
                <div class="gh-stat">
                    <span class="gh-stat-val">${u.followers ?? '—'}</span>
                    <span class="gh-stat-label">seguidores</span>
                </div>
                <div class="gh-stat">
                    <span class="gh-stat-val">${u.following ?? '—'}</span>
                    <span class="gh-stat-label">seguindo</span>
                </div>
                ${u.location ? `<p style="font-family:var(--font-code);font-size:12px;color:var(--text-muted);margin-top:4px">📍 ${u.location}</p>` : ''}
            `;
        })
        .catch(() => {
            container.innerHTML = `
                <div class="gh-stat"><span class="gh-stat-val">3+</span><span class="gh-stat-label">repos</span></div>
                <div class="gh-stat"><span class="gh-stat-val">∞</span><span class="gh-stat-label">curiosidade</span></div>
            `;
        });
})();

/* ══════════════════════════════════════════════════════════
   GITHUB PROJECTS — fetch API + filtro por linguagem
══════════════════════════════════════════════════════════ */
(function initProjects() {
    const grid    = document.getElementById('projectsGrid');
    const filters = document.getElementById('projFilters');
    if (!grid) return;

    const langColors = {
        'JavaScript': '#f7df1e', 'TypeScript': '#3178c6',
        'HTML': '#e34c26',       'CSS': '#563d7c',
        'Python': '#3572A5',     'C#': '#178600',
        'Dart': '#00B4AB',       'Java': '#b07219',
        'Kotlin': '#A97BFF',     'Swift': '#F05138',
        'Jupyter Notebook': '#DA5B0B',
    };

    const fallbackRepos = [
        { name: 'MindCracker', description: 'Jogo de memória desenvolvido com Unity e C# — desafie sua mente!', language: 'C#',     html_url: 'https://github.com/DyeniferFrazao/MindCracker', topics: ['unity','game','csharp'] },
        { name: 'SpaceMarker',  description: 'Jogo espacial criado com Python e PyGame — explore o universo.', language: 'Python', html_url: 'https://github.com/DyeniferFrazao/SpaceMarker',  topics: ['python','pygame','game'] },
        { name: 'Portifolio',   description: 'Portfólio pessoal — glassmorphism, animações e tema purple/code.', language: 'HTML', html_url: 'https://github.com/DyeniferFrazao/Portifolio',   topics: ['html','css','javascript'] },
    ];

    const langIcon = l => ({ 'C#':'🎮','Python':'🐍','HTML':'🌐','JavaScript':'⚡','TypeScript':'🔷','CSS':'🎨','Dart':'🎯','Java':'☕','Kotlin':'💜','Swift':'🍎','Jupyter Notebook':'📓' }[l] || '💻');

    let allRepos = [];

    /* ── Renderiza cards ── */
    function render(repos) {
        grid.innerHTML = '';
        if (!repos.length) {
            grid.innerHTML = '<p style="color:var(--text-muted);font-family:var(--font-code);grid-column:1/-1;text-align:center">nenhum repo encontrado para esse filtro.</p>';
            return;
        }
        repos.forEach(repo => {
            const color = langColors[repo.language] || '#68B2F8';
            const icon  = langIcon(repo.language);
            const desc  = repo.description || 'Repositório no GitHub';
            const tags  = (repo.topics || []).slice(0, 3).map(t => `<span class="proj-tag">${t}</span>`).join('');

            const card = document.createElement('article');
            card.className = 'proj-card';
            card.dataset.lang = repo.language || '';
            card.innerHTML = `
                <div class="proj-card-top">
                    <span class="proj-icon">${icon}</span>
                    <a class="proj-link" href="${repo.html_url}" target="_blank" rel="noopener" title="Abrir no GitHub">↗</a>
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

    /* ── Filtro por linguagem ── */
    function applyFilter(lang) {
        document.querySelectorAll('.proj-filter').forEach(b =>
            b.classList.toggle('active', b.dataset.lang === lang)
        );
        const filtered = lang === 'all'
            ? allRepos
            : allRepos.filter(r => r.language === lang);
        render(filtered);
    }

    filters?.querySelectorAll('.proj-filter').forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.lang));
    });

    /* ── Fetch GitHub API ── */
    fetch('https://api.github.com/users/DyeniferFrazao/repos?sort=updated&per_page=12')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(repos => {
            allRepos = repos.filter(r => !r.fork && r.name !== 'DyeniferFrazao');
            if (!allRepos.length) throw new Error('empty');
            render(allRepos);
        })
        .catch(() => {
            allRepos = fallbackRepos;
            render(allRepos);
        });
})();
