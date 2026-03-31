/* ===================================================================
   ROOPKOTHA PRODUCTION — Interactive JavaScript
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // Loader
    const loader = document.getElementById('loader');
    const startLoad = () => setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 2400);
    window.addEventListener('load', startLoad);
    if (document.readyState === 'complete') startLoad();

    // Custom Cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX; cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px'; cursorDot.style.top = cursorY + 'px';
    });
    (function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px'; cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, input, textarea, select, .service-card, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); cursorOutline.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); cursorOutline.classList.remove('hover'); });
    });

    // Particles
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [], mouseP = { x: -1000, y: -1000 };
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.05;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            const dx = mouseP.x - this.x, dy = mouseP.y - this.y, dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) { const f = (120 - dist) / 120; this.x -= dx * f * 0.02; this.y -= dy * f * 0.02; }
            if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 165, 116, ${this.opacity})`; ctx.fill();
        }
    }
    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
        particles = []; for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();
    (function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 130) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 165, 116, ${(1 - dist / 130) * 0.1})`;
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    })();
    document.addEventListener('mousemove', (e) => { mouseP.x = e.clientX; mouseP.y = e.clientY; });

    // Navbar
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        navbar.classList.toggle('scrolled', sy > 80);
        backToTop.classList.toggle('visible', sy > 600);
        let current = '';
        sections.forEach(s => { if (sy >= s.offsetTop - 200) current = s.getAttribute('id'); });
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.section === current);
        });
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile Menu
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active'); mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
        navToggle.classList.remove('active'); mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }));

    // Typing
    const phrases = [
        'Where every frame tells a story.',
        'Crafting cinematic fairy tales.',
        'Where music meets emotion.',
        'Stories that stay with you.',
        'রূপকথা — The Art of Storytelling.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const typedEl = document.getElementById('typedText');
    (function typeLoop() {
        const cur = phrases[phraseIdx];
        typedEl.textContent = deleting ? cur.substring(0, --charIdx) : cur.substring(0, ++charIdx);
        let speed = deleting ? 35 : 70;
        if (!deleting && charIdx === cur.length) { speed = 2200; deleting = true; }
        else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 500; }
        setTimeout(typeLoop, speed);
    })();

    // Counters
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = +el.dataset.target, start = performance.now();
            (function tick(now) {
                const p = Math.min((now - start) / 2000, 1);
                el.textContent = Math.floor((1 - (1-p)*(1-p)) * target);
                if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
            })(start);
        });
    }

    // Scroll Animations
    let countersAnimated = false;
    function initAnimations() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    if ((e.target.classList.contains('hero-stats') || e.target.closest?.('.hero-stats')) && !countersAnimated) {
                        countersAnimated = true; animateCounters();
                    }
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
    }

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(c => {
            if (f === 'all' || c.dataset.category === f) {
                c.classList.remove('hidden'); c.style.animation = 'fadeInUp 0.5s ease forwards';
            } else c.classList.add('hidden');
        });
    }));

    // Tilt
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const rx = (e.clientY - r.top - r.height/2) / (r.height/2) * -4;
            const ry = (e.clientX - r.left - r.width/2) / (r.width/2) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // Contact Form
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><div style="width:20px;height:20px;border:2px solid rgba(0,0,0,0.2);border-top-color:rgba(0,0,0,0.7);border-radius:50%;animation:spin 0.8s linear infinite;"></div>';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            
            const result = await response.json();
            if (response.status === 200) {
                submitBtn.innerHTML = '<span>Inquiry Sent! ✓</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                submitBtn.style.color = 'white';
                setTimeout(() => { 
                    submitBtn.innerHTML = orig; 
                    submitBtn.style.background = ''; 
                    submitBtn.style.color = ''; 
                    submitBtn.disabled = false; 
                    form.reset(); 
                }, 3000);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(error);
            submitBtn.innerHTML = '<span>Error! ✗</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            submitBtn.style.color = 'white';
            setTimeout(() => { 
                submitBtn.innerHTML = orig; 
                submitBtn.style.background = ''; 
                submitBtn.style.color = ''; 
                submitBtn.disabled = false; 
            }, 3000);
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    }));

    // Parallax
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (sy < window.innerHeight) {
            const hc = document.querySelector('.hero-content');
            const hv = document.querySelector('.hero-visual');
            if (hc) { hc.style.transform = `translateY(${sy * 0.12}px)`; hc.style.opacity = 1 - sy / (window.innerHeight * 0.8); }
            if (hv) { hv.style.transform = `translateY(${sy * 0.08}px)`; hv.style.opacity = 1 - sy / (window.innerHeight * 0.9); }
        }
    });

    // Dynamic keyframes
    const s = document.createElement('style');
    s.textContent = `@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(s);
});
