// home.js
// $(document).ready(function () {
//   // Guard Clause: Only run home script if home page elements exist
//   if (!$('.hero-section').length && !$('.section-motivate').length) return;

//   // 1. Lottie ScrollTriggers
//   function createLottieScrollTrigger(config) {
//     let target = typeof config.target === 'string' ? document.querySelector(config.target) : config.target;
//     if (!target) return null;

//     let playhead = { frame: 0 };
//     let anim = lottie.loadAnimation({
//       container: target,
//       renderer: 'svg',
//       loop: false,
//       autoplay: false,
//       path: config.path,
//     });

//     anim.addEventListener('data_failed', () => {
//       console.error('Lottie file failed to load. Check path:', config.path);
//     });

//     anim.addEventListener('DOMLoaded', () => {
//       gsap.to(playhead, {
//         frame: anim.totalFrames - 1,
//         ease: 'none',
//         scrollTrigger: {
//           trigger: config.trigger || '.hero-section',
//           start: config.start || 'top top',
//           end: config.end || '+=1100',
//           scrub: 0.8,
//           invalidateOnRefresh: true,
//         },
//         onUpdate: () => anim.goToAndStop(playhead.frame, true),
//       });
//       ScrollTrigger.refresh();
//     });

//     return anim;
//   }

//   if ($('.hero-section').length) {
//     let mm = gsap.matchMedia();
//     mm.add('(min-width: 992px)', () => {
//       let anim = createLottieScrollTrigger({
//         target: '#desktop-lottie',
//         path: './src/assets/first-scroll-people.json',
//         trigger: '.hero-section',
//         start: 'top top',
//         end: '+=750',
//       });
//       return () => anim?.destroy();
//     });

//     mm.add('(max-width: 991px)', () => {
//       let anim = createLottieScrollTrigger({
//         target: '#mobile-lottie',
//         path: './src/assets/mobile-first-scroll-people.json',
//         trigger: '.hero-section',
//         start: 'top top',
//         end: '+=750',
//       });
//       return () => anim?.destroy();
//     });

//     gsap.to('.hero-section', {
//       backgroundColor: '#ffffff',
//       ease: 'none',
//       scrollTrigger: {
//         trigger: '.hero-section',
//         start: 'top top',
//         end: '+=400',
//         scrub: true,
//         invalidateOnRefresh: true,
//       },
//     });
//   }

//   // 2. Section Motivate Grid Animation
//   if ($('.section-motivate').length) {
//     const initialPositions = [
//       { selector: '.home_motivate-img.cc-1', x: '41rem', y: '-5rem' },
//       { selector: '.home_motivate-img.cc-2', x: '29rem', y: '10rem' },
//       { selector: '.home_motivate-img.cc-3', x: '13rem', y: '-14rem' },
//       { selector: '.home_motivate-img.cc-4', x: '0px', y: '16rem' },
//       { selector: '.home_motivate-img.cc-5', x: '-13rem', y: '-14rem' },
//       { selector: '.home_motivate-img.cc-6', x: '-27rem', y: '10rem' },
//       { selector: '.home_motivate-img.cc-7', x: '-38rem', y: '-8rem' },
//     ];

//     gsap.fromTo('.motivate-grid', { opacity: 0 }, {
//       opacity: 1,
//       duration: 0.8,
//       ease: 'power2.out',
//       scrollTrigger: {
//         trigger: '.section-motivate',
//         start: 'top 60%',
//         toggleActions: 'play none none reverse',
//       },
//     });

//     initialPositions.forEach((item) => {
//       if ($(item.selector).length) {
//         gsap.from(item.selector, {
//           x: item.x,
//           y: item.y,
//           duration: 1.2,
//           ease: 'power3.out',
//           scrollTrigger: {
//             trigger: '.section-motivate',
//             start: 'top 60%',
//             toggleActions: 'play none none reverse',
//           },
//         });
//       }
//     });
//   }

//   // 3. Tab Switcher
//   const tabs = document.querySelectorAll('.tab-btn');
//   const panels = document.querySelectorAll('.tab-panel');
//   const indicator = document.getElementById('tab-bg-indicator');

//   if (tabs.length && indicator) {
//     const moveIndicator = (tab) => {
//       gsap.to(indicator, { x: tab.offsetLeft, width: tab.offsetWidth, duration: 0.3, ease: 'power2.out' });
//     };

//     const switchTab = (activeTab) => {
//       tabs.forEach((tab) => {
//         const isActive = tab === activeTab;
//         tab.setAttribute('aria-selected', isActive);
//         tab.setAttribute('tabindex', isActive ? '0' : '-1');
//         tab.classList.toggle('text-white', isActive);
//         tab.classList.toggle('text-brand-espresso-500', !isActive);
//         tab.classList.toggle('hover:opacity-80', !isActive);
//       });

//       moveIndicator(activeTab);

//       panels.forEach((panel) => {
//         const isMatch = panel.id === activeTab.dataset.target;
//         panel.classList.toggle('hidden', !isMatch);
//         panel.classList.toggle('flex', isMatch);
//         if (isMatch) {
//           gsap.fromTo(
//             panel.querySelectorAll('.testimonial-card'),
//             { opacity: 0, y: 15 },
//             { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
//           );
//         }
//       });
//     };

//     const initialTab = document.querySelector('.tab-btn[aria-selected="true"]') || tabs[0];
//     gsap.set(indicator, { x: initialTab.offsetLeft, width: initialTab.offsetWidth });

//     tabs.forEach((tab, index) => {
//       // Click Handler
//       tab.addEventListener('click', () => switchTab(tab));

//       // Keyboard Navigation Handler (WAI-ARIA Pattern)
//       tab.addEventListener('keydown', (e) => {
//         let targetTab = null;

//         if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
//           e.preventDefault();
//           targetTab = tabs[(index + 1) % tabs.length];
//         } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
//           e.preventDefault();
//           targetTab = tabs[(index - 1 + tabs.length) % tabs.length];
//         } else if (e.key === 'Home') {
//           e.preventDefault();
//           targetTab = tabs[0];
//         } else if (e.key === 'End') {
//           e.preventDefault();
//           targetTab = tabs[tabs.length - 1];
//         }

//         if (targetTab) {
//           targetTab.focus();
//           switchTab(targetTab);
//         }
//       });
//     });

//     window.addEventListener('resize', () => {
//       const activeTab = document.querySelector('.tab-btn[aria-selected="true"]');
//       if (activeTab) moveIndicator(activeTab);
//     });
//   }

//   // 4. Process Card Parallax
//   const leftCards = document.querySelectorAll('.process-card');
//   const lottieCards = document.querySelectorAll('.lottie-card');

//   if (leftCards.length && lottieCards.length) {
//     leftCards.forEach((card, index) => {
//       if (index === 0 || !lottieCards[index - 1]) return;
//       gsap.to(lottieCards[index - 1], {
//         yPercent: -100,
//         ease: 'none',
//         scrollTrigger: {
//           trigger: card,
//           start: 'top 50%',
//           end: 'top 20%',
//           scrub: 1.2,
//         },
//       });
//     });
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  // Guard Clause: Only execute if home page elements exist
  const heroSection = document.querySelector('.hero-section');
  const motivateSection = document.querySelector('.section-motivate');

  if (!heroSection && !motivateSection) return;

  /* ==========================================================================
     1. Lottie ScrollTriggers
     ========================================================================== */
  /**
   * Helper function to instantiate Lottie animations synchronized with ScrollTrigger
   * @param {Object} config - Configuration options for Lottie & ScrollTrigger
   */
  const createLottieScrollTrigger = (config) => {
    const target = typeof config.target === 'string' ? document.querySelector(config.target) : config.target;
    if (!target) return null;

    const playhead = { frame: 0 };
    const anim = lottie.loadAnimation({
      container: target,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: config.path,
    });

    anim.addEventListener('data_failed', () => {
      console.error('Lottie file failed to load. Check path:', config.path);
    });

    anim.addEventListener('DOMLoaded', () => {
      gsap.to(playhead, {
        frame: anim.totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: config.trigger || heroSection,
          start: config.start || 'top top',
          end: config.end || '+=1100',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        onUpdate: () => anim.goToAndStop(playhead.frame, true),
      });
      ScrollTrigger.refresh();
    });

    return anim;
  };

  if (heroSection) {
    const mm = gsap.matchMedia();

    // Desktop Lottie Setup (>= 992px)
    mm.add('(min-width: 992px)', () => {
      const anim = createLottieScrollTrigger({
        target: '#desktop-lottie',
        path: './src/assets/first-scroll-people.json',
        trigger: heroSection,
        start: 'top top',
        end: '+=750',
      });
      return () => anim?.destroy();
    });

    // Mobile Lottie Setup (<= 991px)
    mm.add('(max-width: 991px)', () => {
      const anim = createLottieScrollTrigger({
        target: '#mobile-lottie',
        path: './src/assets/mobile-first-scroll-people.json',
        trigger: heroSection,
        start: 'top top',
        end: '+=750',
      });
      return () => anim?.destroy();
    });

    // Hero Section Background Color Transition
    gsap.to(heroSection, {
      backgroundColor: '#ffffff',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=400',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  /* ==========================================================================
     2. Section Motivate Grid Animation
     ========================================================================== */
  if (motivateSection) {
    const initialPositions = [
      { selector: '.home_motivate-img.cc-1', x: '41rem', y: '-5rem' },
      { selector: '.home_motivate-img.cc-2', x: '29rem', y: '10rem' },
      { selector: '.home_motivate-img.cc-3', x: '13rem', y: '-14rem' },
      { selector: '.home_motivate-img.cc-4', x: '0px', y: '16rem' },
      { selector: '.home_motivate-img.cc-5', x: '-13rem', y: '-14rem' },
      { selector: '.home_motivate-img.cc-6', x: '-27rem', y: '10rem' },
      { selector: '.home_motivate-img.cc-7', x: '-38rem', y: '-8rem' },
    ];

    // Fade-in main grid container
    gsap.fromTo(
      '.motivate-grid',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: motivateSection,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Animate image positions using batch query to reduce redundant checks
    initialPositions.forEach(({ selector, x, y }) => {
      const el = motivateSection.querySelector(selector);
      if (el) {
        gsap.from(el, {
          x,
          y,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: motivateSection,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });
  }

  /* ==========================================================================
     3. Accessible Tab Switcher (WAI-ARIA Pattern)
     ========================================================================== */
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));
  const indicator = document.getElementById('tab-bg-indicator');

  if (tabs.length && indicator) {
    /**
     * Animate sliding tab background indicator
     * @param {HTMLElement} tab - Active tab element
     */
    const moveIndicator = (tab) => {
      gsap.to(indicator, {
        x: tab.offsetLeft,
        width: tab.offsetWidth,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    /**
     * Switch active tab and update corresponding panel visibility & card animations
     * @param {HTMLElement} activeTab - Tab button to activate
     */
    const switchTab = (activeTab) => {
      tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
        tab.classList.toggle('text-white', isActive);
        tab.classList.toggle('text-brand-espresso-500', !isActive);
        tab.classList.toggle('hover:opacity-80', !isActive);
      });

      moveIndicator(activeTab);

      panels.forEach((panel) => {
        const isMatch = panel.id === activeTab.dataset.target;
        panel.classList.toggle('hidden', !isMatch);
        panel.classList.toggle('flex', isMatch);

        if (isMatch) {
          const cards = panel.querySelectorAll('.testimonial-card');
          if (cards.length) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
            );
          }
        }
      });
    };

    // Set initial position of indicator without animation
    const initialTab = document.querySelector('.tab-btn[aria-selected="true"]') || tabs[0];
    gsap.set(indicator, { x: initialTab.offsetLeft, width: initialTab.offsetWidth });

    // Attach Event Listeners
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => switchTab(tab));

      tab.addEventListener('keydown', (e) => {
        let targetTab = null;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            targetTab = tabs[(index + 1) % tabs.length];
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            targetTab = tabs[(index - 1 + tabs.length) % tabs.length];
            break;
          case 'Home':
            e.preventDefault();
            targetTab = tabs[0];
            break;
          case 'End':
            e.preventDefault();
            targetTab = tabs[tabs.length - 1];
            break;
        }

        if (targetTab) {
          targetTab.focus();
          switchTab(targetTab);
        }
      });
    });

    // Native ResizeObserver for responsive recalculation (smoother & faster than window.onresize)
    const navContainer = tabs[0].parentElement;
    if (navContainer) {
      const resizeObserver = new ResizeObserver(() => {
        const activeTab = document.querySelector('.tab-btn[aria-selected="true"]');
        if (activeTab) moveIndicator(activeTab);
      });
      resizeObserver.observe(navContainer);
    }
  }

  /* ==========================================================================
     4. Process Card Parallax
     ========================================================================== */
  const leftCards = document.querySelectorAll('.process-card');
  const lottieCards = document.querySelectorAll('.lottie-card');

  if (leftCards.length && lottieCards.length) {
    leftCards.forEach((card, index) => {
      // Skip the first card or missing corresponding target
      if (index === 0 || !lottieCards[index - 1]) return;

      gsap.to(lottieCards[index - 1], {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 50%',
          end: 'top 20%',
          scrub: 1.2,
        },
      });
    });
  }
});