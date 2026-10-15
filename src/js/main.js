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
            element.style.height = 'auto';
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
    const isVisible = window.getComputedStyle(content).display !== 'none';

    // 1. Close all other open accordions (Sibling items)
    document.querySelectorAll('.mobile-accordion-content').forEach((item) => {
      if (item !== content && window.getComputedStyle(item).display !== 'none') {
        animateCollapse.slideUp(item, 250);
      }
    });

    document.querySelectorAll('.mobile-accordion-btn svg').forEach((icon) => {
      if (icon !== svg) icon.classList.remove('rotate-90');
    });

    // 2. Toggle current item (Self item)
    if (isVisible) {
      // Closing the active item
      svg?.classList.remove('rotate-90');
      
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => {
          content.style.display = 'none'; // Guarantee DOM state display: none
          content.style.height = '';      // Clean up inline height inline override
          ScrollTrigger.refresh();
        },
      });
    } else {
      // Opening the target item
      svg?.classList.add('rotate-90');
      content.style.display = 'block';

      const targetHeight = content.scrollHeight;

      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: targetHeight,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => {
            content.style.height = 'auto'; // Re-enable auto-height for responsive resizing
            ScrollTrigger.refresh();
          },
        }
      );
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
   5. Accessible Dropdown Navigation (Core Functional Only)
   ========================================================================== */
  const dropdownItems = document.querySelectorAll('.nav-dropdown-item');

  const toggleDropdown = (item, forceOpen) => {
    const btn = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    if (!btn || !menu) return;

    const isOpen = forceOpen !== undefined ? forceOpen : btn.getAttribute('aria-expanded') !== 'true';

    btn.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('hidden', !isOpen);
    menu.classList.toggle('block', isOpen);
  };

  dropdownItems.forEach((item) => {
    const btn = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');

    // 1. Click Handler for Toggle Button
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(item);
    });

    // 2. Keydown Navigation on Toggle Button
    btn?.addEventListener('keydown', (e) => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Open and move focus on Enter, Space, or ArrowDown
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) toggleDropdown(item, true);

        // Shift focus to the first interactive menu item
        requestAnimationFrame(() => {
          menu?.querySelector('a, button')?.focus();
        });
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        toggleDropdown(item, false);
        btn.focus();
      }
    });

    // 3. Keydown Navigation Inside Menu Links
    menu?.addEventListener('keydown', (e) => {
      const targetItem = e.target.closest('a, button');
      if (!targetItem) return;

      const items = Array.from(menu.querySelectorAll('a, button'));
      const currentIndex = items.indexOf(targetItem);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        toggleDropdown(item, false);
        btn?.focus();
      }
    });

    // 4. Focusout Handling (Auto-close when tabbing out of the component)
    item.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!item.contains(document.activeElement)) {
          toggleDropdown(item, false);
        }
      }, 10);
    });
  });

});