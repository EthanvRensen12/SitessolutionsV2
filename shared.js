/* ═══════════════════════════════════════════════════════
   SHARED.JS — Sites Solutions
═══════════════════════════════════════════════════════ */

// ═══ CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .service-card, .phase-card, .stat-box, .value-card, .faq-item, .check-option, .cs-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px'; cursor.style.height = '20px';
        ring.style.width = '60px'; ring.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px'; cursor.style.height = '12px';
        ring.style.width = '40px'; ring.style.height = '40px';
    });
});

// ═══ CANVAS PARTICLE GRID
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLS = Math.ceil(window.innerWidth / 80);
const ROWS = Math.ceil(window.innerHeight / 80);
const pts = [];

for (let c = 0; c <= COLS; c++) {
    for (let r = 0; r <= ROWS; r++) {
        pts.push({
            x: (c / COLS) * window.innerWidth,
            y: (r / ROWS) * window.innerHeight,
            ox: (c / COLS) * window.innerWidth,
            oy: (r / ROWS) * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        });
    }
}

let frame = 0;
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    pts.forEach(p => {
        p.x += p.vx + Math.sin(frame * 0.005 + p.ox * 0.01) * 0.15;
        p.y += p.vy + Math.cos(frame * 0.005 + p.oy * 0.01) * 0.15;
        const dx = p.x - p.ox, dy = p.y - p.oy;
        if (Math.abs(dx) > 15) p.vx *= -1;
        if (Math.abs(dy) > 15) p.vy *= -1;
    });

    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
                const mdx = pts[i].x - mx, mdy = pts[i].y - my;
                const md = Math.sqrt(mdx * mdx + mdy * mdy);
                const alpha = (1 - (d / 90)) * (md < 250 ? 0.14 : 0.03);
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(39,142,245,${alpha})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    pts.forEach(p => {
        const mdx = p.x - mx, mdy = p.y - my;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        const r = md < 200 ? 1.8 : 0.8;
        const alpha = md < 200 ? 0.5 : 0.16;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(39,142,245,${alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(drawGrid);
}
drawGrid();

// ═══ HEADER SCROLL
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

// ═══ MOBILE MENU
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (nav.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// ═══ SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => ro.observe(el));

// ═══ STAT COUNTERS
const statEls = document.querySelectorAll('[data-target]');
const so = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
            e.target.dataset.counted = '1';
            const target = +e.target.dataset.target;
            const suffix = e.target.dataset.suffix || '';
            const dur = 2000;
            const inc = target / (dur / 16);
            let curr = 0;
            const t = setInterval(() => {
                curr += inc;
                if (curr >= target) { curr = target; clearInterval(t); }
                e.target.textContent = Math.floor(curr) + suffix;
            }, 16);
        }
    });
}, { threshold: 0.5 });
statEls.forEach(el => so.observe(el));

// ═══ CONTACT FORM (on pages that have it)
const form = document.getElementById('projectForm');
if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const n = document.getElementById('name');
        const em = document.getElementById('email');
        const tl = document.getElementById('timeline');
        let ok = true;

        [n, em, tl].forEach(f => { if (f) f.style.borderColor = 'rgba(39,142,245,0.25)'; });

        if (n && !n.value.trim()) { n.style.borderColor = 'rgba(39,238,245,0.7)'; ok = false; }
        if (em && !em.value.includes('@')) { em.style.borderColor = 'rgba(39,238,245,0.7)'; ok = false; }
        if (tl && !tl.value) { tl.style.borderColor = 'rgba(39,238,245,0.7)'; ok = false; }
        if (!ok) return;

        status.style.display = 'block';
        status.style.color = 'rgba(255,255,255,0.6)';
        status.style.background = 'rgba(39,142,245,0.08)';
        status.style.border = '1px solid rgba(39,142,245,0.2)';
        status.textContent = 'Sending...';

        try {
            const r = await fetch(form.action, { method: 'POST', body: new FormData(form) });
            const j = await r.json();
            if (r.ok && j.success) {
                status.style.color = 'var(--cyan)';
                status.style.background = 'rgba(39,238,245,0.06)';
                status.style.border = '1px solid rgba(39,238,245,0.2)';
                status.textContent = "Message sent! We'll be in touch within 24 hours.";
                form.reset();
                document.querySelectorAll('.check-option').forEach(o => o.classList.remove('checked'));
            } else {
                status.style.color = '#ff4466';
                status.textContent = 'Error: ' + (j.message || 'Failed to send.');
            }
        } catch {
            status.style.color = '#ff4466';
            status.textContent = 'Network error. Please try again.';
        }
    });
}

// ═══ SMOOTH SCROLL for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ═══ HERO INITIAL REVEAL
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) el.classList.add('visible');
        });
    }, 200);
});
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const logoImg = document.querySelector('.logo-img');

    if (window.scrollY > 50) {
        header.style.padding = "0.8rem 5%";
        logoImg.style.height = "32px";
        header.style.background = "rgba(8, 12, 20, 0.95)"; // Darker background on scroll
        header.style.backdropFilter = "blur(10px)";
    } else {
        header.style.padding = "1.5rem 5%";
        logoImg.style.height = "40px";
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
    }
});