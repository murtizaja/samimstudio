// 1. تفعيل السكرول السلس Lenis لصفحة الدكان
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical'
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. مؤشر الماوس التفاعلي الخاص بالدكان
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

// تفعيل استجابة المؤشر مع عناصر الدكان
document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        if (type === 'project') {
            cursor.classList.add('active-project');
            cursorText.style.display = 'block';
            cursorText.textContent = 'فحص';
        } else {
            cursor.classList.add('active-hover');
        }
    });

    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active-project', 'active-hover');
        cursorText.style.display = 'none';
    });
});

// 3. تأثير الارتفاع ثلاثي الأبعاد لبطاقات المنتجات الحرفية
document.querySelectorAll('.artisan-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotX = -(y / (rect.height / 2)) * 6;
        const rotY = (x / (rect.width / 2)) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});