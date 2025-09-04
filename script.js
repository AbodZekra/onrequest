// عناصر DOM الأساسية
const body = document.body;
const themeSwitcher = document.getElementById('theme-switcher');
const themeSwitcherMobile = document.getElementById('theme-switcher-mobile');
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');
const slides = document.querySelectorAll('.slide');
const prevButtons = document.querySelectorAll('.prev-slide');
const nextButtons = document.querySelectorAll('.next-slide');

// تبديل الوضع الداكن/الفاتح
function toggleTheme() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const icon = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    const text = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
    
    if (themeSwitcher) {
        themeSwitcher.innerHTML = `${icon}<span>${text}</span>`;
    }
    if (themeSwitcherMobile) {
        themeSwitcherMobile.innerHTML = `${icon}<span>${text}</span>`;
    }
}

// إدارة القائمة الجانبية
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// إنشاء سلايدر لكل مشروع
function initSliders() {
    document.querySelectorAll('.slider-container').forEach((container, index) => {
        let currentSlide = 0;
        const slides = container.querySelectorAll('.slide');
        const totalSlides = slides.length;

        function showSlide(n) {
            // إخفاء الصورة الحالية
            slides[currentSlide].classList.remove('active');
            
            // حساب الصورة الجديدة
            currentSlide = (n + totalSlides) % totalSlides;
            
            // إظهار الصورة الجديدة
            slides[currentSlide].classList.add('active');
        }

        // تهيئة: إظهار الصورة الأولى فقط
        slides.forEach((slide, i) => {
            if (i !== 0) slide.classList.remove('active');
        });

        // الأزرار الخاصة بكل سلايدر
        if (prevButtons[index]) {
            prevButtons[index].addEventListener('click', () => showSlide(currentSlide - 1));
        }
        if (nextButtons[index]) {
            nextButtons[index].addEventListener('click', () => showSlide(currentSlide + 1));
        }
    });
} 

// تأثير العد للأرقام
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// التحميل الكسول للصور
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px'
        });

        lazyImages.forEach(img => {
            // تخزين المصدر الأصلي في data-src إذا لم يكن موجوداً
            if (!img.hasAttribute('data-src')) {
                img.dataset.src = img.src;
            }
            imageObserver.observe(img);
        });
    } else {
        // Fallback للمتصفحات التي لا تدعم IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// كشف العناصر عند التمرير
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('stats-container')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .project-card, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// تحديث الصورة الدائرية
function updateProfileImage() {
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.src = 'https://via.placeholder.com/40';
    }
}

// تهيئة جميع الأحداث
function initEvents() {
    // تبديل الوضع
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', toggleTheme);
    }
    if (themeSwitcherMobile) {
        themeSwitcherMobile.addEventListener('click', toggleTheme);
    }
    
    // القائمة الجانبية
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    
    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });
    
    // تنعيم التمرير للروابط
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// تحميل المظهر المفضل من localStorage
function loadPreferredTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadPreferredTheme();
    initEvents();
    initSliders();
    setupScrollAnimations();
    updateProfileImage();
    lazyLoadImages();
});









document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // اجلب القيم من النموذج
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // محتوى الرسالة
    const fullMessage = `
📬 رسالة جديدة من موقع OnRequest:

👤 الاسم: ${name}
📧 البريد الإلكتروني: ${email}
📌 الموضوع: ${subject}
📝 الرسالة:
${message}
    `;

    // إعدادات البوت
    const botToken = "7883403757:AAECfGbmitqHCe3KwqPY9SIMlKFm1izJMj4";     // ضع توكن البوت هنا
    const chatId = "-1002556098849";         // ضع chat_id هنا
    const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // إرسال الطلب
    fetch(telegramURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: fullMessage,
        parse_mode: 'HTML'
      })
    })
    .then(response => {
      if (response.ok) {
        document.querySelector('.contact-form').reset();
      } else {
      }
    })
    .catch(error => {
    });
  });