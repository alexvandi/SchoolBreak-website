/* =========================================
   INTRO OVERLAY CONTROLLER (solo Home, solo prima visita)
   ========================================= */
(function () {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    // Se l'utente ha già visto l'intro in questa sessione, non farla partire e mostra la home
    if (sessionStorage.getItem('sb_intro_seen')) {
        overlay.remove();
        return;
    }

    // Aggiungo una classe "intro-active" per nascondere i contenuti sottostanti (header, testi, bottoni)
    document.body.classList.add('intro-active');
    document.body.classList.add('no-scroll');

    const w1 = document.getElementById('intro-w1');
    const w2 = document.getElementById('intro-w2');
    const logo = document.getElementById('intro-logo');

    // Step 1: Mostra "WELCOME" e "TO" insieme sulla stessa riga
    setTimeout(() => {
        if (w1) w1.classList.add('show');
        if (w2) w2.classList.add('show');
    }, 400);

    // Step 2: Mostra il Logo che sale dal basso e si ferma più grande
    setTimeout(() => {
        if (logo) logo.classList.add('show');
    }, 1400);

    // Step 3: Fai scorrere WELCOME TO verso l'alto (scomparsa), e rimpicciolisci il logo portandolo in alto
    setTimeout(() => {
        if (w1) w1.style.opacity = '0';
        if (w2) w2.style.opacity = '0';
        if (w1) w1.style.transform = 'translateY(-50px)';
        if (w2) w2.style.transform = 'translateY(-50px)';

        if (logo) logo.classList.add('slide-home'); // Muove il logo grande verso l'alto

        // Rivela il resto della pagina sotto (l'overlay trasparente rimane su fino alla fine, non nasconde nulla)
        document.body.classList.remove('intro-active');
        document.body.classList.remove('no-scroll');
        sessionStorage.setItem('sb_intro_seen', '1');
    }, 3200);

    // Step 4: Fondi l'overlay rimosso per transizione pulita con la Home reale (che intanto è apparsa sotto in fade-in)
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 600);
    }, 4000);
})();

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

/* =========================================
   SUPABASE - EVENTI LOGIC
   ========================================= */
const SUPABASE_URL = 'https://bohsivvtuqcoelopzkth.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvaHNpdnZ0dXFjb2Vsb3B6a3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODIwODksImV4cCI6MjA4Njc1ODA4OX0.QTQt4y5-aHcLsWWQIv3YG6MY8zHx_j7XrtQK0dFh_qs';

// Inizializza client Supabase solo se l'SDK è stato caricato via CDN
// IMPORTANTE: NON usare 'let supabase' qui perché oscura l'oggetto globale del CDN!
try {
    if (window.supabase && window.supabase.createClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase client inizializzato con successo.');
    }
} catch (e) {
    console.warn('Supabase SDK non disponibile in questa pagina.', e);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Logica per mostrare gli eventi in eventi.html
    const eventsContainer = document.getElementById('events-container');
    if (eventsContainer && window.supabaseClient) {
        fetchEvents();
    }

    async function fetchEvents() {
        const { data: events, error } = await window.supabaseClient
            .from('events')
            .select('*')
            .order('event_date', { ascending: true }); // Mostra i prossimi per primi

        if (error) {
            console.error('Errore nel fetch eventi:', error);
            eventsContainer.innerHTML = '<p style="color:red;text-align:center;">Errore durante il caricamento degli eventi.</p>';
            return;
        }

        if (!events || events.length === 0) {
            eventsContainer.innerHTML = '<p style="text-align:center;">Nessun evento disponibile al momento. Riprova più tardi!</p>';
            return;
        }

        eventsContainer.innerHTML = ''; // Svuota lo skeleton di caricamento

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';

            // Layout fedele allo screenshot: Immagine enorme sopra, bottoni affiancati sotto
            card.innerHTML = `
                <img src="${event.poster_url || 'https://via.placeholder.com/800x1000/000000/ff0000?text=LOCANDINA+NON+DISPONIBILE'}" alt="Locandina ${event.title}" class="event-poster">
                <div class="event-actions">
                    <a href="${event.ticket_link || '#'}" class="btn-white" target="_blank" rel="noopener">ACQUISTA I<br>BIGLIETTI</a>
                    <a href="mailto:schoolbreakevent@gmail.com?subject=Info Tavoli ${event.title}" class="btn-gray">PRENOTA UN<br>TAVOLO</a>
                </div>
            `;
            eventsContainer.appendChild(card);
        });

        // Riabilita IntersectionObserver per i nuovi cards iniettati
        const reveals = document.querySelectorAll('.reveal');
        const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            });
        }, revealOptions);
        reveals.forEach(el => revealOnScroll.observe(el));
    }


    // 2. Logica per caricare foto e salvare DB in admin.html
    const adminForm = document.getElementById('admin-event-form');
    if (adminForm && window.supabaseClient) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const msgBox = document.getElementById('admin-message');
            submitBtn.textContent = 'CARICAMENTO IN CORSO...';
            submitBtn.disabled = true;
            msgBox.textContent = '';
            msgBox.style.color = 'white';

            try {
                const name = document.getElementById('eventName').value;
                const date = document.getElementById('eventDate').value;
                const ticketUrl = document.getElementById('ticketLink').value;
                const fileInput = document.getElementById('eventPoster');

                let posterPublicUrl = '';

                // Se ho un'immagine, caricamento su Storage
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                    const filePath = `${fileName}`;

                    // Upload nel bucket "event-posters"
                    const { data: uploadData, error: uploadError } = await window.supabaseClient
                        .storage
                        .from('event-posters')
                        .upload(filePath, file);

                    if (uploadError) {
                        throw new Error('Errore durante l\'upload dell\'immagine: ' + uploadError.message);
                    }

                    // Prendi URL pubblico
                    const { data: publicUrlData } = window.supabaseClient
                        .storage
                        .from('event-posters')
                        .getPublicUrl(filePath);

                    posterPublicUrl = publicUrlData.publicUrl;
                }

                // Inserimento a DB
                const { data: insertData, error: insertError } = await window.supabaseClient
                    .from('events')
                    .insert([
                        { title: name, event_date: date, ticket_link: ticketUrl, poster_url: posterPublicUrl }
                    ]);

                if (insertError) {
                    throw new Error('Errore nell\'inserimento a database: ' + insertError.message);
                }

                msgBox.style.color = 'green';
                msgBox.textContent = 'Evento Caricato con Successo!';
                adminForm.reset();

            } catch (err) {
                console.error(err);
                msgBox.style.color = 'red';
                msgBox.textContent = err.message || 'Si è verificato un errore.';
            } finally {
                submitBtn.textContent = 'AGGIUNGI EVENTO';
                submitBtn.disabled = false;
            }
        });
    }
});
