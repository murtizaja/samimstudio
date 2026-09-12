// 1. تفعيل النزول السلس والفاخر (Lenis Smooth Scroll)
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

// 2. مؤشر الماوس التفاعلي الدقيق
const cursor = document.getElementById('cursor');
const cursorText = document.getElementById('cursor-text');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// تحريك المؤشر بسلاسة متناهية عبر GSAP
gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
});

// تفاعل المؤشر مع الروابط والمشاريع
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

// 3. حركات دخول النصوص عبر GSAP عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    gsap.from('.line-inner', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    });

    gsap.from('.hero-bio, .scroll-indicator, .badge-tag', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
});

// 4. بيانات المشاريع الموسعة لدراسة الحالة (Case Studies)
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

// 5. إدارة نافذة دراسة الحالة المنبثقة (Drawer)
const drawer = document.getElementById('projectDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerContent = document.getElementById('drawerContent');

document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
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

        drawer.classList.add('open');
        lenis.stop(); // إيقاف تمرير الصفحة الرئيسية مؤقتاً
    });
});

drawerClose.addEventListener('click', () => {
    drawer.classList.remove('open');
    lenis.start(); // استئناف التمرير
});