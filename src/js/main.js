// global.js
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Initialize Lenis Smooth Scroll & GSAP Integration
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    infinite: false,
    gestureOrientation: 'vertical',
    normalizeWheel: false,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ==========================================================================
     2. Hide/Show Header on Scroll
     ========================================================================== */
  const header = document.getElementById('main-header');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (header) {
    let lastScrollTop = 0;

    lenis.on('scroll', ({ scroll }) => {
      // Don't auto-hide header if mobile menu is actively open
      if (mobileDrawer?.classList.contains('flex')) return;

      if (Math.abs(lastScrollTop - scroll) <= 10) return;

      if (scroll > lastScrollTop && scroll > 120) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }

      lastScrollTop = scroll;
    });
  }

  /* ==========================================================================
     3. Mobile Navigation Drawer
     ========================================================================== */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';

      mobileBtn.setAttribute('aria-expanded', String(!isExpanded));
      hamburgerIcon?.classList.toggle('hidden');
      closeIcon?.classList.toggle('hidden');

      if (isExpanded) {
        mobileDrawer.classList.add('hidden');
        mobileDrawer.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        lenis.start();
      } else {
        mobileDrawer.classList.remove('hidden');
        mobileDrawer.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        lenis.stop();
      }
    });
  }

  /* ==========================================================================
     4. Smooth Collapsible Engine (replaces jQuery .slideUp() / .slideDown())
     ========================================================================== */
  /**
   * Smoothly expands an element using CSS Grid/max-height or native web animations.
   * Leverages GSAP for precise height animation and scroll-trigger reflows.
   */
  const animateCollapse = {
    slideUp(element, duration = 250) {
      return gsap.to(element, {
        height: 0,
        opacity: 0,
        duration: duration / 1000,
        ease: 'power2.out',
        onComplete: () => {
          element.style.display = 'none';
        },
      });
    },
    slideDown(element, duration = 250) {
      element.style.display = 'block';
      const targetHeight = element.scrollHeight;

      return gsap.fromTo(
        element,
        { height: 0, opacity: 0 },
        {
          height: targetHeight,
          opacity: 1,
          duration: duration / 1000,
          ease: 'power2.out',
          onComplete: () => {
            element.style.height = 'auto'; // allow responsive resizing after expand
          },
        }
      );
    },
  };

  /* --- Mobile Accordion Handler --- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mobile-accordion-btn');
    if (!btn) return;

    const content = btn.nextElementSibling;
    if (!content || !content.classList.contains('mobile-accordion-content')) return;

    const svg = btn.querySelector('svg');
    const isOpen = content.offsetHeight > 0 && window.getComputedStyle(content).display !== 'none';

    // Close all open accordions first (Single active accordion pattern)
    document.querySelectorAll('.mobile-accordion-content').forEach((item) => {
      if (item !== content && window.getComputedStyle(item).display !== 'none') {
        animateCollapse.slideUp(item, 250);
      }
    });
    document.querySelectorAll('.mobile-accordion-btn svg').forEach((icon) => {
      if (icon !== svg) icon.classList.remove('rotate-90');
    });

    if (isOpen) {
      animateCollapse.slideUp(content, 250).eventCallback('onComplete', () => {
        ScrollTrigger.refresh();
      });
      svg?.classList.remove('rotate-90');
    } else {
      svg?.classList.add('rotate-90');
      animateCollapse.slideDown(content, 250).eventCallback('onComplete', () => {
        ScrollTrigger.refresh();
      });
    }
  });

  /* --- FAQ Toggle Handler --- */
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.faq-toggle');
    if (!button) return;

    const item = button.closest('.faq-item');
    if (!item) return;

    const content = item.querySelector('.faq-content');
    const icon = button.querySelector('.faq-icon');
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const activeClass = 'text-brand-espresso-300';

    // Reset all sibling FAQs
    document.querySelectorAll('.faq-item').forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove(activeClass);
        otherItem.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-icon')?.classList.remove('rotate-45');

        const otherContent = otherItem.querySelector('.faq-content');
        if (otherContent && window.getComputedStyle(otherContent).display !== 'none') {
          animateCollapse.slideUp(otherContent, 200);
        }
      }
    });

    if (isOpen) {
      button.setAttribute('aria-expanded', 'false');
      icon?.classList.remove('rotate-45');
      item.classList.remove(activeClass);
      animateCollapse.slideUp(content, 200).eventCallback('onComplete', () => {
        ScrollTrigger.refresh();
      });
    } else {
      button.setAttribute('aria-expanded', 'true');
      icon?.classList.add('rotate-45');
      item.classList.add(activeClass);
      animateCollapse.slideDown(content, 200).eventCallback('onComplete', () => {
        ScrollTrigger.refresh();
      });
    }
  });

  /* ==========================================================================
     5. Accessible Dropdown Navigation
     ========================================================================== */
  const dropdownItems = document.querySelectorAll('.nav-dropdown-item');

  const toggleDropdown = (item, forceOpen) => {
    const btn = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    if (!btn || !menu) return;

    const isOpen = forceOpen !== undefined ? forceOpen : btn.getAttribute('aria-expanded') !== 'true';

    btn.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      menu.classList.remove('hidden');
      menu.classList.add('block');
      gsap.fromTo(menu, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -8,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          menu.classList.add('hidden');
          menu.classList.remove('block');
        },
      });
    }
  };

  dropdownItems.forEach((item) => {
    const btn = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');

    // Keydown navigation on main toggle
    btn?.addEventListener('keydown', (e) => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) toggleDropdown(item, true);

        // Focus first link in menu
        requestAnimationFrame(() => {
          menu?.querySelector('a')?.focus();
        });
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        toggleDropdown(item, false);
        btn.focus();
      }
    });

    // Keydown navigation inside dropdown menu items
    menu?.addEventListener('keydown', (e) => {
      const targetLink = e.target.closest('a');
      if (!targetLink) return;

      const links = Array.from(menu.querySelectorAll('a'));
      const currentIndex = links.indexOf(targetLink);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + links.length) % links.length;
        links[prevIndex]?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        toggleDropdown(item, false);
        btn?.focus();
      }
    });

    // Focusout handling to auto-close when tabbing away
    item.addEventListener('focusout', () => {
      // Small timeout allows document.activeElement to update correctly
      setTimeout(() => {
        if (!item.contains(document.activeElement)) {
          toggleDropdown(item, false);
        }
      }, 10);
    });
  });
});