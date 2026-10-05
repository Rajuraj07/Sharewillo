// global.js
$(document).ready(function () {
  // 1. Initialize Lenis Smooth Scroll
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    infinite: false,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // 2. Hide/Show Header on Scroll
  let lastScrollTop = 0;
  const $header = $('#main-header');
  const $mobileDrawer = $('#mobile-drawer');

  if ($header.length) {
    lenis.on('scroll', (e) => {
      if ($mobileDrawer.hasClass('flex')) return;
      let scrollTop = e.scroll;
      if (Math.abs(lastScrollTop - scrollTop) <= 10) return;

      if (scrollTop > lastScrollTop && scrollTop > 120) {
        $header.addClass('nav-hidden');
      } else {
        $header.removeClass('nav-hidden');
      }
      lastScrollTop = scrollTop;
    });
  }

  // 3. Mobile Navigation Drawer
  const $mobileBtn = $('#mobile-menu-btn');
  const $hamburgerIcon = $('#hamburger-icon');
  const $closeIcon = $('#close-icon');

  if ($mobileBtn.length) {
    $mobileBtn.on('click', function () {
      let isExpanded = $(this).attr('aria-expanded') === 'true';
      $(this).attr('aria-expanded', !isExpanded);
      $hamburgerIcon.toggleClass('hidden');
      $closeIcon.toggleClass('hidden');

      if (isExpanded) {
        $mobileDrawer.addClass('hidden').removeClass('flex');
        $('body').removeClass('overflow-hidden');
        lenis.start();
      } else {
        $mobileDrawer.removeClass('hidden').addClass('flex');
        $('body').addClass('overflow-hidden');
        lenis.stop();
      }
    });
  }

  // 4. Accordions & FAQ Toggles
  $('.mobile-accordion-btn').on('click', function () {
    let $btn = $(this);
    let $content = $btn.next('.mobile-accordion-content');
    let $svg = $btn.find('svg');
    let isOpen = $content.is(':visible');

    $('.mobile-accordion-content').slideUp(250);
    $('.mobile-accordion-btn svg').removeClass('rotate-90');

    if (isOpen) {
      setTimeout(() => ScrollTrigger.refresh(), 260);
    } else {
      $content.slideDown(250, function () {
        ScrollTrigger.refresh();
      });
      $svg.addClass('rotate-90');
    }
  });

  $('.faq-toggle').on('click', function () {
    const $button = $(this);
    const $item = $button.closest('.faq-item');
    const $content = $item.find('.faq-content');
    const $icon = $button.find('.faq-icon');
    const isOpen = $button.attr('aria-expanded') === 'true';
    const activeClass = 'text-brand-espresso-300';

    $('.faq-item').not($item).each(function () {
      const $otherItem = $(this);
      $otherItem.removeClass(activeClass);
      $otherItem.find('.faq-toggle').attr('aria-expanded', 'false');
      $otherItem.find('.faq-content').slideUp(200);
      $otherItem.find('.faq-icon').removeClass('rotate-45');
    });

    if (isOpen) {
      $content.slideUp(200);
      $button.attr('aria-expanded', 'false');
      $icon.removeClass('rotate-45');
      $item.removeClass(activeClass);
    } else {
      $content.slideDown(200);
      $button.attr('aria-expanded', 'true');
      $icon.addClass('rotate-45');
      $item.addClass(activeClass);
    }
  });
});