// ============================================
// Huzaifa Rahat — Portfolio Website
// Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initRevealAnimations(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  initSkillBars(prefersReducedMotion);
  initExperienceTabs();
  initFlipCards();
  initGalleryTilt(prefersReducedMotion);
  initGalleryVideos();
  initGalleryAnimation();
  initFloatingLabels();
  initCaseStudyAnimation(prefersReducedMotion);
  initClientsWall(prefersReducedMotion);
  initHeroSequence(prefersReducedMotion);
  initAwardGlow(prefersReducedMotion);
  initGrowthCards(prefersReducedMotion);
});

// ----------------------------------------------------------------------
// 1 & 14. Navbar Scroll Behavior & Link Active State
// ----------------------------------------------------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check
  handleScroll();

  // Active state based on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

// ----------------------------------------------------------------------
// 2. Mobile Menu Toggle
// ----------------------------------------------------------------------
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navLinksContainer) return;

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  };

  const closeMenu = () => {
    navToggle.classList.remove('active');
    navLinksContainer.classList.remove('active');
  };

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target) && navLinksContainer.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ----------------------------------------------------------------------
// 3. Smooth Scroll
// ----------------------------------------------------------------------
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const offset = 80; // Fixed navbar height

  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ----------------------------------------------------------------------
// 4. Scroll-Triggered Reveal Animations
// ----------------------------------------------------------------------
function initRevealAnimations(reducedMotion) {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  if (reducedMotion) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

// ----------------------------------------------------------------------
// 5. Animated Counters
// ----------------------------------------------------------------------
function initCounters(reducedMotion) {
  const counterContainers = document.querySelectorAll('.stat-card');
  if (counterContainers.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector('.stat-number');
          if (numberEl) {
            animateValue(numberEl, reducedMotion);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counterContainers.forEach(el => observer.observe(el));
}

function animateValue(obj, reducedMotion) {
  const target = parseInt(obj.getAttribute('data-target'), 10) || 0;
  const suffix = obj.getAttribute('data-suffix') || '';
  
  if (reducedMotion) {
    obj.innerText = target.toLocaleString() + suffix;
    return;
  }

  const duration = 2000;
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4); // ease out
    const current = Math.floor(easeOutQuart * target);
    
    obj.innerText = current.toLocaleString() + (progress === 1 ? suffix : '');
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  
  window.requestAnimationFrame(step);
}

// ----------------------------------------------------------------------
// 6. Skill Progress Bars
// ----------------------------------------------------------------------
function initSkillBars(reducedMotion) {
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-fill');
          const percentText = entry.target.querySelector('.skill-percentage');
          
          if (fill) {
            const targetPercent = parseInt(fill.getAttribute('data-percent'), 10) || 0;
            if (reducedMotion) {
              fill.style.width = targetPercent + '%';
              if (percentText) percentText.innerText = targetPercent + '%';
            } else {
              fill.style.width = targetPercent + '%';
              if (percentText) animateSkillCounter(percentText, targetPercent);
            }
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach(card => observer.observe(card));
}

function animateSkillCounter(obj, target) {
  const duration = 1500;
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeOutQuart * target);
    
    obj.innerText = current + '%';
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ----------------------------------------------------------------------
// 7. Experience Tabs
// ----------------------------------------------------------------------
function initExperienceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length === 0 || tabPanels.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-tab') === targetTab) {
          panel.classList.add('active');
        }
      });
    });
  });
}

// ----------------------------------------------------------------------
// Gallery Waterfall Animation
// ----------------------------------------------------------------------
function initGalleryAnimation() {
  const grids = document.querySelectorAll('.gallery-grid');
  if (grids.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.gallery-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('animate-in');
            }, i * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  grids.forEach(grid => observer.observe(grid));
}

// ----------------------------------------------------------------------
// 8. Flip Cards (Mobile Tap Toggle)
// ----------------------------------------------------------------------
function initFlipCards() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const flipCards = document.querySelectorAll('.flip-card');
  
  if (!isMobile || flipCards.length === 0) return;

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

// ----------------------------------------------------------------------
// 9. Gallery Item Hover Tilt
// ----------------------------------------------------------------------
function initGalleryTilt(reducedMotion) {
  if (reducedMotion) return;
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;
  if (!isDesktop) return;

  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 3 degrees)
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      
      item.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
      item.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        item.style.transition = ''; // clear inline transition
      }, 300);
    });
  });
}

// ----------------------------------------------------------------------
// 10. Contact Form Floating Labels
// ----------------------------------------------------------------------
function initFloatingLabels() {
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  
  formInputs.forEach(input => {
    const checkValue = () => {
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('has-value');
      } else {
        input.parentElement.classList.remove('has-value');
      }
    };
    
    input.addEventListener('input', checkValue);
    input.addEventListener('change', checkValue);
    
    // Check initial state
    checkValue();
  });
}

// ----------------------------------------------------------------------
// 11. Case Study Curtain Animation
// ----------------------------------------------------------------------
function initCaseStudyAnimation(reducedMotion) {
  const caseStudies = document.querySelectorAll('.case-study-card');
  if (caseStudies.length === 0) return;

  if (reducedMotion) {
    caseStudies.forEach(el => {
      el.classList.add('animate-in');
      el.querySelectorAll('.outcome-box').forEach(b => b.style.opacity = '1');
      el.querySelectorAll('.skill-pill').forEach(p => p.style.opacity = '1');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Stagger outcome boxes
          const outcomes = entry.target.querySelectorAll('.outcome-box');
          outcomes.forEach((box, i) => {
            box.style.animationDelay = `${0.3 + i * 0.15}s`;
          });
          // Stagger skill pills
          const pills = entry.target.querySelectorAll('.skill-pill');
          pills.forEach((pill, i) => {
            pill.style.animationDelay = `${0.5 + i * 0.08}s`;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  caseStudies.forEach(card => observer.observe(card));
}

// ----------------------------------------------------------------------
// 12. Clients Wall Staggered Animation
// ----------------------------------------------------------------------
function initClientsWall(reducedMotion) {
  const clientsGrid = document.querySelector('.clients-grid');
  if (!clientsGrid) return;
  const clientCards = clientsGrid.querySelectorAll('.client-card');

  if (reducedMotion) {
    clientCards.forEach(card => card.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Calculate grid positions for stagger
          const gridStyle = window.getComputedStyle(clientsGrid);
          const columns = gridStyle.gridTemplateColumns.split(' ').length;
          
          clientCards.forEach((card, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            // Delay spreading diagonally
            const delay = (row + col) * 0.1;
            card.style.transitionDelay = `${delay}s`;
            
            // Allow CSS to apply transition before adding active class
            requestAnimationFrame(() => {
              card.classList.add('active');
            });
          });
          
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(clientsGrid);
}

// ----------------------------------------------------------------------
// 15. Gallery Video Handling
// ----------------------------------------------------------------------
function initGalleryVideos() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  galleryItems.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    if (isMobile) {
      video.muted = true;
      video.loop = true;
      video.setAttribute('playsinline', '');
      video.play().catch(e => console.log('Autoplay prevented:', e));
    } else {
      item.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log('Play prevented:', e));
      });
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Rewind
      });
    }
  });
}

// ----------------------------------------------------------------------
// 16. Hero Animation Sequence
// ----------------------------------------------------------------------
function initHeroSequence(reducedMotion) {
  if (reducedMotion) {
    // Show everything immediately
    document.querySelectorAll('.hero-content .reveal').forEach(el => el.classList.add('active'));
    return;
  }
  // Hero animations are handled by CSS animation delays on the hero elements
  // Just ensure they're visible (the CSS keyframes handle the sequence)
}

// ----------------------------------------------------------------------
// 17. Award Card Glow
// ----------------------------------------------------------------------
function initAwardGlow(reducedMotion) {
  const awardCards = document.querySelectorAll('.award-card');
  if (awardCards.length === 0) return;

  if (reducedMotion) {
    awardCards.forEach(card => card.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  awardCards.forEach(card => observer.observe(card));
}

// ----------------------------------------------------------------------
// 18. Growth Cards Animation
// ----------------------------------------------------------------------
function initGrowthCards(reducedMotion) {
  const growthCards = document.querySelectorAll('.growth-card');
  if (growthCards.length === 0) return;

  if (reducedMotion) {
    growthCards.forEach(card => card.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  growthCards.forEach(card => observer.observe(card));
}
