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
      const suffix = counter.textContent.includes('%') ? '%' : '';
      const duration = 1000;
      const start = performance.now();

      const updateCounter = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        counter.textContent = `${value}${suffix}`;

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
  const track = partnersCarousel.querySelector('.partners-track');
  const sourceCards = track ? Array.from(track.querySelectorAll('.partner-card')) : [];
  const partnersSection = partnersCarousel.closest('.partners-shell');
  const prevButton = partnersSection?.querySelector('.partners-prev');
  const nextButton = partnersSection?.querySelector('.partners-next');

  if (track && sourceCards.length > 1) {
    for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
      sourceCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    partnersCarousel.dataset.loopReady = 'true';

    const state = {
      offset: 0,
      width: 0,
      pausedUntil: 0,
      autoFrame: null,
      animationFrame: null,
      lastTime: 0,
      isAnimating: false,
    };

    const easing = (value) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);

    const measureWidth = () => {
      state.width = track.scrollWidth / 3;
      state.offset = state.width + (((state.offset - state.width) % state.width) + state.width) % state.width;
    };

    const render = () => {
      track.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
    };

    const normalize = () => {
      if (!state.width) {
        return;
      }

      while (state.offset >= state.width * 2) {
        state.offset -= state.width;
      }

      while (state.offset < state.width) {
        state.offset += state.width;
      }

      render();
    };

    const animateTo = (targetOffset) => {
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
      }

      state.isAnimating = true;
      const startOffset = state.offset;
      const distance = targetOffset - startOffset;
      const duration = 520;
      const startTime = performance.now();

      const frame = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        state.offset = startOffset + distance * easing(progress);
        render();

        if (progress < 1) {
          state.animationFrame = requestAnimationFrame(frame);
          return;
        }

        state.isAnimating = false;
        normalize();
        state.animationFrame = null;
      };

      state.animationFrame = requestAnimationFrame(frame);
    };

    const stepWidth = () => {
      const card = track.querySelector('.partner-card');
      if (!card) {
        return 300;
      }

      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16');
      return card.getBoundingClientRect().width + gap;
    };

    const move = (direction) => {
      state.pausedUntil = performance.now() + 900;
      animateTo(state.offset + stepWidth() * direction);
    };

    const autoLoop = (time) => {
      if (!state.lastTime) {
        state.lastTime = time;
      }

      const deltaTime = time - state.lastTime;
      state.lastTime = time;

      if (time >= state.pausedUntil && !state.isAnimating) {
        state.offset += (deltaTime * 0.03);
        normalize();
      }

      state.autoFrame = requestAnimationFrame(autoLoop);
    };

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => move(-1));
      nextButton.addEventListener('click', () => move(1));
    }

    partnersCarousel.addEventListener('pointerdown', () => {
      state.pausedUntil = performance.now() + 1200;
    });

    window.addEventListener('resize', () => {
      measureWidth();
      normalize();
    });

    requestAnimationFrame(() => {
      measureWidth();
      state.offset = state.width;
      render();
      state.autoFrame = requestAnimationFrame(autoLoop);
    });
  }
}
