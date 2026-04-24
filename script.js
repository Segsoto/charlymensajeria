const revealItems = document.querySelectorAll('.section-reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('[data-counter]');

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const duration = 1000;
      const start = performance.now();

      const updateCounter = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        counter.textContent = `${value}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
      observer.unobserve(counter);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('nav-open')) {
      return;
    }

    const clickedOutside = !mainNav.contains(event.target) && !menuToggle.contains(event.target);
    if (clickedOutside) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      menuToggle.focus();
    }
  });
}

const form = document.querySelector('.contact-form');
const formNote = document.querySelector('.form-note');

if (form && formNote) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formNote.textContent =
      'Gracias. Un asesor corporativo se comunicara con usted en breve.';
    form.reset();
  });
}

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const partnersCarousel = document.querySelector('.partners-carousel');

if (partnersCarousel && !partnersCarousel.dataset.loopReady) {
  const sourceCards = Array.from(partnersCarousel.querySelectorAll('.partner-card'));
  const partnersSection = partnersCarousel.closest('.partners-shell');
  const prevButton = partnersSection?.querySelector('.partners-prev');
  const nextButton = partnersSection?.querySelector('.partners-next');

  if (sourceCards.length > 1) {
    sourceCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      partnersCarousel.appendChild(clone);
    });

    partnersCarousel.dataset.loopReady = 'true';

    let animationFrameId = null;
    let pauseUntil = 0;

    const normalizeScroll = () => {
      const halfWidth = partnersCarousel.scrollWidth / 2;
      if (partnersCarousel.scrollLeft >= halfWidth) {
        partnersCarousel.scrollLeft -= halfWidth;
      } else if (partnersCarousel.scrollLeft <= 0) {
        partnersCarousel.scrollLeft += halfWidth;
      }
    };

    const getLoopWidth = () => partnersCarousel.scrollWidth / 2;

    const setWrappedScrollLeft = (targetLeft) => {
      const loopWidth = getLoopWidth();
      const wrappedLeft = ((targetLeft % loopWidth) + loopWidth) % loopWidth;
      partnersCarousel.scrollLeft = wrappedLeft;
    };

    const autoScroll = () => {
      if (Date.now() >= pauseUntil) {
        partnersCarousel.scrollLeft += 0.5;
        normalizeScroll();
      }

      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const getStepSize = () => {
      const firstCard = partnersCarousel.querySelector('.partner-card');
      if (!firstCard) {
        return 300;
      }
      const gap = Number.parseFloat(getComputedStyle(partnersCarousel).columnGap || '16');
      return firstCard.getBoundingClientRect().width + gap;
    };

    const moveByStep = (direction) => {
      pauseUntil = Date.now() + 1600;
      const step = getStepSize() * direction;
      setWrappedScrollLeft(partnersCarousel.scrollLeft + step);
    };

    partnersCarousel.addEventListener('scroll', normalizeScroll, { passive: true });
    partnersCarousel.addEventListener('resize', normalizeScroll);
    partnersCarousel.addEventListener('pointerdown', () => {
      pauseUntil = Date.now() + 1600;
    });
    partnersCarousel.addEventListener('wheel', () => {
      pauseUntil = Date.now() + 1600;
    }, { passive: true });

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => moveByStep(-1));
      nextButton.addEventListener('click', () => moveByStep(1));
    }

    window.addEventListener('resize', () => {
      normalizeScroll();
    });

    animationFrameId = requestAnimationFrame(autoScroll);
  }
}
