// 1. تفعيل السكرول السلس Lenis
const lenis = new Lenis({ duration: 1.3, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. مؤشر الماوس التفاعلي
const cursor = document.getElementById('cursor');
const cursorText = document.getElementById('cursor-text');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
});

document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        if (type === 'project') { cursor.classList.add('active-project'); cursorText.style.display = 'block'; }
        else { cursor.classList.add('active-hover'); }
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active-project', 'active-hover');
        cursorText.style.display = 'none';
    });
});

// 3. محرك الموشن البصري الحي الدائم داخل التلفاز (HTML5 Canvas بدون توقف وبدون شاشة سوداء)
const canvas = document.getElementById('liveMotionCanvas');
const ctx = canvas.getContext('2d');
let currentChannelMode = 1;

function resizeCanvas() {
    if (canvas) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let step = 0;
function drawLiveBroadcast() {
    step += 0.03;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // خلفية كرزية داكنة متغيرة بنعومة
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#2d0c14');
    bgGrad.addColorStop(1, '#0c0305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (currentChannelMode === 1) {
        // القناة 01: شبكات هندسية دوارة وتفكيك بصري
        ctx.strokeStyle = 'rgba(230, 46, 84, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            const radius = 60 + i * 35 + Math.sin(step + i) * 15;
            ctx.arc(w / 2, h / 2 - 30, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(245, 240, 235, 0.3)';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 180, h / 2 - 30);
        ctx.lineTo(w / 2 + 180, h / 2 - 30);
        ctx.stroke();

    } else if (currentChannelMode === 2) {
        // القناة 02: موجات ونبضات التيبوغرافيا السائلة
        ctx.strokeStyle = 'rgba(230, 46, 84, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x += 6) {
            const y = (h / 2 - 30) + Math.sin(x * 0.015 + step) * 55 * Math.cos(step * 0.5);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

    } else if (currentChannelMode === 3) {
        // القناة 03: خطوط أشعة متباينة مصفوفة كألياف الورق والمكابس
        ctx.strokeStyle = 'rgba(245, 240, 235, 0.25)';
        ctx.lineWidth = 1;
        const totalLines = 24;
        for (let i = 0; i < totalLines; i++) {
            const angle = (Math.PI * 2 / totalLines) * i + (step * 0.2);
            const x2 = (w / 2) + Math.cos(angle) * (w * 0.6);
            const y2 = (h / 2 - 30) + Math.sin(angle) * (h * 0.6);
            ctx.beginPath();
            ctx.moveTo(w / 2, h / 2 - 30);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    requestAnimationFrame(drawLiveBroadcast);
}
drawLiveBroadcast();

// 4. بنك مقالات أثير صَميم المتكاملة لكل قناة
const essaysData = {
    "1": {
        code: "CHANNEL 01 / ON AIR",
        tag: "مقال وتأملات • القناة 01",
        title: "تفكيك الأنظمة البصرية: حينما يصبح الشكل جسداً للمعنى",
        brief: "عن الفرق بين الشعار العابر، والنظام البصري الرصين الذي يمتلك صوتاً ويفرض احترامه في السوق.",
        content: `
            <div class="article-header">
                <h2>تفكيك الأنظمة البصرية: حينما يصبح الشكل جسداً للمعنى</h2>
                <div class="article-meta-lead">بقلم أستوديو صَميم • سبتمبر 2026 • كواليس التوجيه الفني</div>
            </div>
            <div class="article-content">
                <p>في عالم التصميم المعاصر، يقع الكثير من أصحاب العلامات التجارية في فخ "الشعار السريع"؛ البحث عن أيقونة تلفت الانتباه للحظات، لكنها سرعان ما تتلاشى وتذوب أمام زخم السوق وضجيجه الرقمي. في أستوديو صَميم، نرى أن الهوية ليست رسماً زخرفياً، بل هي نظام هندسي فكري متماسك.</p>
                
                <div class="article-quote">
                    "الشعار ليس سوى رأس الجبل الجليدي؛ القوة الحقيقية تكمن في صلب النظام التيبوغرافي، وشبكة القياسات، وطريقة تنفس العناصر مع الفراغ."
                </div>

                <p>عندما نبدأ بتفكيك أي مشروع، لا نبحث في المجلدات الرائجة على بنترست، بل نغوص في جوهر العلامة: ما هي الرسالة التي يجب أن يستشعرها العميل قبل أن يقرأ الكلمات؟ كيف نصنع وزناً بصرياً يمنح العلامة وقاراً وثقة غير قابلة للشك؟</p>
                <p>النظام البصري الناجح هو ذلك الذي يمكن تطبيقه على كيس ورقي خشن، لافتة مبنى ضوئية، أو مجلة فاخرة، ويبقى يحمل نفس النبرة ونفس الأصالة دون أن يفقد هيبته.</p>
            </div>
        `
    },
    "2": {
        code: "CHANNEL 02 / ON AIR",
        tag: "مختبر الحروف • القناة 02",
        title: "التيبوغرافيا العربية: أصالة النحت وصرامة الحداثة",
        brief: "كيف نعيد بناء الحرف العربي ليتوافق مع البيئات الرقمية المتقدمة دون التنازل عن رصانته التراثية.",
        content: `
            <div class="article-header">
                <h2>التيبوغرافيا العربية: أصالة النحت وصرامة الحداثة</h2>
                <div class="article-meta-lead">أرشيف مختبر الحروف • أستوديو صَميم • 2026</div>
            </div>
            <div class="article-content">
                <p>الخط العربي ليس مجرد أبجدية؛ إنه هندسة روحية كُتبت بنسب دقيقة وحسابات رياضية صارمة تمتد لقرون. التحدي الذي نخوضه يومياً في صَميم هو: كيف نأخذ هذا الإرث الثقيل ونحرره من قيود الجمود دون أن نفقده هويته؟</p>

                <div class="article-quote">
                    "الحرف العربي حين يُرسم باحترام، يتفوق على أي عنصر بصري آخر؛ الحرف بحد ذاته هوية، معمار، وإيقاع موسيقي صامت."
                </div>

                <p>في مشاريعنا الحروفيّة، نركز على استخراج مصفوفات جديدة للحروف تمزج بين زوايا الكوفي المعمارية ورشاقة الخطوط المعاصرة. هذا ما يجعل الهوية متفردة، فلا يعود الشعار بحاجة إلى أيقونة إضافية لأن الكلمة بذاتها أصبحت عملاً نحتياً استثنائياً.</p>
            </div>
        `
    },
    "3": {
        code: "CHANNEL 03 / ON AIR",
        tag: "حرفة وملمس • القناة 03",
        title: "سيكولوجيا الملمس: لماذا نحتاج إلى الورق والطباعة الحية؟",
        brief: "في عصر الشاشات المسطحة والميغابكسل، يعود الورق القطني والختم الحراري ليكون قمة الفخامة الملموسة.",
        content: `
            <div class="article-header">
                <h2>سيكولوجيا الملمس: لماذا نحتاج إلى الورق والطباعة الحية؟</h2>
                <div class="article-meta-lead">توثيق معمل الطباعة • صَميم للعاديات • 2026</div>
            </div>
            <div class="article-content">
                <p>نعيش اليوم في بيئة رقمية فائقة السرعة؛ كل شيء ممسوح خلف لوح زجاجي أملس. لهذا السبب تحديداً، أصبح "الملمس" هو العملة الأكثر ندرة وقيمة في صناعة العلامات الفاخرة.</p>

                <div class="article-quote">
                    "العميل ينسى المنشور الرقمي بعد ثوانٍ، لكنه يتذكر وزن البطاقة القطنية في يده، ملمس الحبر الحجري، وصوت تقليب أوراق الدفتر ذي الكعب المكشوف."
                </div>

                <p>في دُكّان صَميم ومشروعات التغليف، نختبر تفاعل الأحبار المطفية مع ألياف الورق القطني الإيطالي، نعتمد تقنيات السلك سكرين والختم الحراري المجوف (Debossing). هذه التفاصيل ليست كماليات، بل هي الحبل السري الذي يربط وجدان العميل بالعلامة التجارية ويحولها إلى ذكرى دائمة.</p>
            </div>
        `
    }
};

// 5. إدارة التنقل بين القنوات وتشويش الشاشة
const chButtons = document.querySelectorAll('.ch-btn');
const glitch = document.getElementById('glitchOverlay');
const chCode = document.getElementById('chCode');
const essayTag = document.getElementById('essayTag');
const essayTitle = document.getElementById('essayTitle');
const essayBrief = document.getElementById('essayBrief');
const tuneKnob = document.getElementById('tuneKnob');
let currentAngle = 0;

chButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-channel');
        currentChannelMode = parseInt(target);

        chButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // دوران قرص التوليف
        currentAngle += 50;
        if (tuneKnob) tuneKnob.style.transform = `rotate(${currentAngle}deg)`;

        // حدوث تشويش سينمائي خاطف
        if (glitch) {
            glitch.classList.add('active');
            setTimeout(() => glitch.classList.remove('active'), 130);
        }

        // تحديث بيانات المقال على الشاشة
        const d = essaysData[target];
        if (d) {
            chCode.textContent = d.code;
            essayTag.textContent = d.tag;
            essayTitle.textContent = d.title;
            essayBrief.textContent = d.brief;
        }
    });
});

// 6. فتح وإغلاق قارئ المقال المنبثق Drawer
const essayCard = document.getElementById('essayCardTrigger');
const essayDrawer = document.getElementById('essayDrawer');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const drawerArticleBody = document.getElementById('drawerArticleBody');
const drawerChInfo = document.getElementById('drawerChInfo');

if (essayCard && essayDrawer) {
    essayCard.addEventListener('click', () => {
        const currentData = essaysData[currentChannelMode];
        if (!currentData) return;

        drawerChInfo.textContent = currentData.tag;
        drawerArticleBody.innerHTML = currentData.content;
        drawerArticleBody.scrollTop = 0;

        essayDrawer.classList.add('open');
        lenis.stop();
    });
}

if (drawerCloseBtn && essayDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
        essayDrawer.classList.remove('open');
        lenis.start();
    });
}