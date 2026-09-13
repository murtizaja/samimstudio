// 1. تفعيل السكرول السلس Lenis
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical'
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. مؤشر الماوس التفاعلي
const cursor = document.getElementById('cursor');
const cursorText = document.getElementById('cursor-text');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
});

function attachCursorEvents() {
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const type = el.getAttribute('data-cursor');
            if (type === 'project') {
                cursor.classList.add('active-project');
                cursorText.style.display = 'block';
            } else {
                cursor.classList.add('active-hover');
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active-project', 'active-hover');
            cursorText.style.display = 'none';
        });
    });
}
attachCursorEvents();

// 3. تأثير الـ 3D Tilt للشعار
const logoWrap = document.getElementById('logo3d');
const logoLayer = logoWrap ? logoWrap.querySelector('.logo-3d-layer') : null;
const logoGlow = logoWrap ? logoWrap.querySelector('.logo-3d-glow') : null;

if (logoWrap && logoLayer) {
    logoWrap.addEventListener('mousemove', (e) => {
        const rect = logoWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotX = -(y / (rect.height / 2)) * 25;
        const rotY = (x / (rect.width / 2)) * 25;

        logoLayer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(24px) scale(1.08)`;
        logoLayer.style.filter = `drop-shadow(${-rotY * 0.8}px ${rotX * 0.8 + 6}px 14px rgba(25, 213, 99, 0.35)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.7))`;

        if (logoGlow) {
            logoGlow.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) translateZ(-10px)`;
        }
    });

    logoWrap.addEventListener('mouseleave', () => {
        logoLayer.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        logoLayer.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))';
        if (logoGlow) {
            logoGlow.style.transform = 'translate(0, 0) translateZ(-10px)';
        }
    });
}

// 4. محرك تشكل الجزيئات لأنترو "صَميم ستوديو" (Particle Morphing Canvas)
const introOverlay = document.getElementById('introOverlay');
const introCanvas = document.getElementById('introCanvas');
const introSkip = document.getElementById('introSkip');

let introAnimationId;
let particles = [];

function initIntroParticles() {
    if (!introCanvas || !introOverlay) return;

    // فحص إذا كان الزائر قد شاهد الأنترو مسبقاً في هذه الجلسة
    if (sessionStorage.getItem('samim_intro_seen')) {
        introOverlay.style.display = 'none';
        document.body.classList.remove('intro-active');
        triggerHeroAnimations();
        return;
    }

    lenis.stop();
    const ctx = introCanvas.getContext('2d');
    const w = introCanvas.width = window.innerWidth;
    const h = introCanvas.height = window.innerHeight;

    // رسم النص المؤقت في الذاكرة لأخذ إحداثيات البكسلات بدقة
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = w;
    offCanvas.height = h;

    const fontSize = Math.min(w * 0.11, 100);
    offCtx.fillStyle = '#ffffff';
    offCtx.font = `700 ${fontSize}px 'IBM Plex Sans Arabic', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    
    // رسم النص الرئيسي والفرعي
    offCtx.fillText('صَميم ستوديو', w / 2, h / 2 - 15);
    
    offCtx.font = `600 ${fontSize * 0.22}px 'Syne', sans-serif`;
    offCtx.letterSpacing = "6px";
    offCtx.fillText('SAMIM STUDIO // 2026', w / 2, h / 2 + fontSize * 0.55);

    const imgData = offCtx.getImageData(0, 0, w, h).data;
    const targetPoints = [];
    const step = 4; // دقة التقاط النقاط

    for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
            const index = (y * w + x) * 4;
            if (imgData[index + 3] > 128) {
                targetPoints.push({ x, y });
            }
        }
    }

    // إنشاء مصفوفة الجزيئات المتناثرة
    particles = [];
    const colors = ['#19d563', '#ffffff', '#a8f5c6', '#69e599'];

    for (let i = 0; i < targetPoints.length; i++) {
        const pt = targetPoints[i];
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            originX: pt.x,
            originY: pt.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.5,
            ease: Math.random() * 0.04 + 0.03
        });
    }

    let startTime = performance.now();

    function renderParticles(now) {
        ctx.fillStyle = 'rgba(6, 7, 9, 0.25)';
        ctx.fillRect(0, 0, w, h);

        const elapsed = (now - startTime) / 1000;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // جذب مغناطيسي نحو الحروف
            p.x += (p.originX - p.x) * p.ease;
            p.y += (p.originY - p.y) * p.ease;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // بعد 3 ثوانٍ من التشكل الكامل، يتم إنهاء الأنترو بانسحاب سينمائي
        if (elapsed > 3.2) {
            finishIntro();
            return;
        }

        introAnimationId = requestAnimationFrame(renderParticles);
    }

    introAnimationId = requestAnimationFrame(renderParticles);
}

function finishIntro() {
    if (!introOverlay || introOverlay.classList.contains('hidden')) return;

    cancelAnimationFrame(introAnimationId);
    sessionStorage.setItem('samim_intro_seen', 'true');

    gsap.to(introOverlay, {
        opacity: 0,
        scale: 1.04,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
            introOverlay.classList.add('hidden');
            document.body.classList.remove('intro-active');
            lenis.start();
            triggerHeroAnimations();
        }
    });
}

if (introSkip) {
    introSkip.addEventListener('click', finishIntro);
}

// 5. حركات دخول نصوص الواجهة بعد انتهاء الأنترو
function triggerHeroAnimations() {
    gsap.from('.line-inner', {
        y: 90,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    });

    gsap.from('.slogan-visual-wrap, .hero-bio, .scroll-indicator, .badge-tag', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initIntroParticles();
});

// 6. بيانات دراسات الحالة وإدارة فتح الـ Drawer
const projectsData = {
    "project-1": {
        title: "هوية روح وريحان المتكاملة",
        category: "مطاعم وضيافة عصرية — 2026",
        desc: "مشروع استراتيجي لبناء نظام بصري يجمع بين حفاوة التقاليد والرؤية الحديثة للتصميم. شمل العمل تصميم الحروفيات العربية، علب التقديم، والمطبوعات الفاخرة.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
            "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1600&q=85",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85"
        ]
    },
    "project-2": {
        title: "قلادة الفضية — الصياغة والتغليف",
        category: "حلي ومجوهرات فاخرة — 2026",
        desc: "صياغة هوية متكاملة لعلامة مجوهرات يدوية؛ ترتكز على الخطوط الهندسية الصافية، والطباعة بالختم الحراري (Foil) على ورق قطني فاحم السواد.",
        images: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=85",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85"
        ]
    },
    "project-3": {
        title: "صاحب ماركة — إعادة إحياء الهوية",
        category: "أزياء راقية وتوجيه فني — 2025",
        desc: "تطوير شامل للغة البصرية لترسيخ الهوية كعلامة فاخرة، مع بطاقات التاغ المصممة بتقنية اللينوكت والسلك سكرين.",
        images: [
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=85",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85"
        ]
    },
    "project-4": {
        title: "مجموعة دفاتر حاء نون الحرفية",
        category: "مطبوعات ودفاتر كعب يدوية — 2025",
        desc: "احتفاء بالحرفة الطباعية الورقية؛ تجليد كعب مقوى وخياطة مكشوفة، مستلهمة من أنماط الزخرفة والعمارة التراثية الرصينة.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85",
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=85"
        ]
    }
};

const drawer = document.getElementById('projectDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerContent = document.getElementById('drawerContent');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const data = projectsData[id];
        if (!data) return;

        const imagesHtml = data.images.map(img => `<img src="${img}" alt="${data.title}">`).join('');

        drawerContent.innerHTML = `
            <div class="drawer-hero">
                <span class="section-label">${data.category}</span>
                <h1>${data.title}</h1>
                <p>${data.desc}</p>
            </div>
            <div class="drawer-media-flow">
                ${imagesHtml}
            </div>
        `;

        drawerContent.scrollTop = 0;
        drawer.classList.add('open');
        document.body.classList.add('drawer-active');
        lenis.stop();
    });
});

if (drawerClose) {
    drawerClose.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.classList.remove('drawer-active');
        lenis.start();
    });
}

// 7. نسخ الإيميل
const emailLink = document.getElementById('studioEmail');
const copyBtn = document.getElementById('copyEmailBtn');
const copyNotice = document.getElementById('copyNotice');

if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', () => {
        const emailToCopy = emailLink.textContent.replace(' ↗', '').trim();
        navigator.clipboard.writeText(emailToCopy).then(() => {
            copyNotice.classList.add('show');
            setTimeout(() => {
                copyNotice.classList.remove('show');
            }, 2500);
        });
    });
}