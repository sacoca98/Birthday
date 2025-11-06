// Initialize particles on page load
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initializeAnimations();
    setupScrollAnimations();
}); 

//Create floating particles
function createParticles() {
    const particles = document.getElementById('particles');
    const particleEmojis = ['❤', '💕', '💖', '💗', '🌸', '🌹', '✨', '💫', '🦋'];

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

        // Random Position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() *100 + '%';

        //Random Animation Duration and Delay
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        particles.appendChild(particle);
    }
}

//Initialize Typewriter and Other Animations
function initializeAnimations() {
    // Typewriter effect is handled by CSS

    // Add staggered animation delays to elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

// Scrool animations (AOS - Animated on Scroll)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                //Special handling for message text
                if (entry.target.classList.contains('message-card')) {
                    animateMessageText();
                }
            }
        });
    }, observerOptions);

    //Observe Elements for Scroll Animations
    const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);

        // Add delay based on dat-delay attribute
        const delay = element.getAttribute('data-delay');
        if (delay) {
            element.style.transitionDelay = delay + 'ms';
        }
    });
}

// Animate message text with staggered effect
function animateMessageText() {
    const messageTexts = document.querySelectorAll('.message-text');
    messageTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('fade-in-animate');
        }, index * 500);
    });
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

//Toggle like functionality for photos
function toggleLike(button) {
    const heartIcon = button.querySelector('.heart-icon');
    button.classList.toggle('liked');

    if (button.classList.contains('liked')) {
        heartIcon.textContent = '❤';
        //Create Floating Heart Effect
        createFloatingHeart(button);        
    } else {
        heartIcon.textContent = '🤍';
    }
}

// Create floating heart animation when photo is liked
function createFloatingHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.position = 'absolute';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000'

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    //Animate the Heart
    heart.animate([
        { transform: 'translateY(0px) scale(1)', opacity: 1},
        { transform: 'translateY(-60px) scale(1.5)', opacity: 0}
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => {
        document.body.removeChild(heart);
    };
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const parallaxSpeed = 0.5;

    if (hero) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }

    //Update particles position based on scroll
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = 0.2 + (index % 3) * 0.1;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add mouse movement effect ot hero section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Subtle movement effect
    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;

    const floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts) {
        floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Add click effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0,5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6 ease out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add entrance animations for photos when they come into view
const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img) {
                img.style.animation = 'photoEnter 0,8s ease-out forwards';
            }
        }
    });
}, { threshold: 0.2});

// Observe all photo cards
document.querySelectorAll('.photo-card').forEach(card => {
    photoObserver.observe(card);
});

// --- MODAL IMAGE ---
document.querySelectorAll('.photo-card').forEach(card => {
  const img = card.querySelector('img');
  const caption = card.querySelector('.photo-caption')?.textContent || '';

  img.addEventListener('click', () => openModal(img.src, caption));
});

function openModal(src, caption) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDescription');

  modalImg.src = src;
  modalDesc.textContent = caption;

  modal.classList.add('active');
}

const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('imageModal');

closeModal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// --- ENLACES POR IMAGEN EN EL MODAL ---

// Array con tus enlaces personalizados (uno por cada imagen)
const modalLinks = [
  'https://youtu.be/dxplIAxxXCc?si=MVjEB5iep72tjh0P',
  'https://youtu.be/W4AiOKlOO0Q?si=bilk3hN7AgEiWeu4',
  'https://youtu.be/JX0b0OwKGE0?si=dOkk_ph2H6A1e6Jw&t=60',
  'https://youtu.be/10EX-_h4pYc?si=NjvizZ3ZeW6Iby0B&t=59',
  'https://youtu.be/jUe8uoKdHao?si=hHo2UDoY-8ZS6Y4w&t=46',
  'https://youtu.be/BeUOBoSPWvA?si=kqXLUMBc8sniI4PV&t=33'
];

// Guardamos el índice de la imagen abierta
let currentModalIndex = null;

// Reemplaza la parte donde abres el modal para guardar el índice
document.querySelectorAll('.photo-card img').forEach((img, index) => {
  img.addEventListener('click', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDescription');
    const caption = img.closest('.photo-card').querySelector('.photo-caption')?.textContent || '';

    modalImg.src = img.src;
    modalDesc.textContent = caption;
    modal.classList.add('active');

    currentModalIndex = index; // guardamos cuál imagen se abrió
  });
});

// Cuando se hace clic en la imagen dentro del modal → abrir enlace
document.getElementById('modalImage').addEventListener('click', () => {
  if (currentModalIndex !== null && modalLinks[currentModalIndex]) {
    window.open(modalLinks[currentModalIndex], '_blank'); // abre en nueva pestaña
  }
});

const bgMusic = document.getElementById('bg-music');

// Detectar la primera interacción del usuario (click o touch)
const startMusic = () => {
  if (!bgMusic) return;
  bgMusic.volume = 0.5;
  bgMusic.play().catch(err => console.log('Autoplay bloqueado:', err));

  // Quitar los listeners para no repetir
  document.removeEventListener('click', startMusic);
  document.removeEventListener('touchstart', startMusic);
};

document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

// Add photo enter animation
const photoStyle = document.createElement('style');
photoStyle.textContent = `
    @keyframes photoEnter {
        from {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0deg);
            opacity: 1
        }
    }
`;

document.head.appendChild(photoStyle);
