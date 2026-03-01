document.addEventListener('DOMContentLoaded', () => {
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenu.removeAttribute('inert');
        menuOpenBtn.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.setAttribute('inert', '');
        menuOpenBtn.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
    }

    menuOpenBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);

    // Header cambia colore on-scroll (sfondo nero)
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Optional: Close menu when clicking outside of links (on the overlay itself)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close menu when clicking a menu link
    const menuLinks = document.querySelectorAll('.menu-link');

    // Chiude il menu quando premo un link
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Se il link contiene un hash per la stessa pagina e vogliamo scorrimento smooth
            if (link.getAttribute('href').startsWith('#') && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }

            // Chiudiamo il menu. La navigazione verso altre pagine avverrà nativamente
            closeMenu();
        });
    });
    // Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 3D Tilt Effect on mousemove
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            // Rimuovo animazione fluida per seguire il mouse istantaneamente
            el.style.transition = 'none';
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // max rotation 15 degrees
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            // Ripristino animazione fluida per ritornare alla posizione base
            el.style.transition = 'transform 0.4s ease-out';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});
