$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Lenis Smooth Scroll Setup
  let lenis = new Lenis({
    duration: 1.2,
    easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((t) => {
    lenis.raf(1000 * t);
  });

  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.refresh();

  // 2. Header Hide / Show Logic
  let lastScrollTop = 0;
  let $header = $('#main-header');
  let $mobileDrawer = $('#mobile-drawer');

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

  // 3. Mobile Drawer Controls
  let $mobileBtn = $('#mobile-menu-btn');
  let $hamburgerIcon = $('#hamburger-icon');
  let $closeIcon = $('#close-icon');

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

  // 4. Accordion Logic
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

  // 5. Lottie ScrollTrigger Function (Hero Scroll Style)
  function createLottieScrollTrigger(config) {
    let target = typeof config.target === 'string'
      ? document.querySelector(config.target)
      : config.target;

    if (!target) return null;

    let playhead = { frame: 0 };
    let anim = lottie.loadAnimation({
      container: target,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: config.path,
    });

    // Check if Lottie JSON file loaded properly
    anim.addEventListener('data_failed', () => {
      console.error('Lottie file failed to load. Check path:', config.path);
    });

    anim.addEventListener('DOMLoaded', () => {
      gsap.to(playhead, {
        frame: anim.totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: config.trigger || '.hero-section',
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
  }

  // 6. MatchMedia Responsive Triggers
  let mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    let anim = createLottieScrollTrigger({
      target: '#desktop-lottie',
      path: './src/assets/first-scroll-people.json',
      trigger: '.hero-section',
      start: 'top top',
      end: '+=750',    
    });
    return () => anim?.destroy();
  });

  mm.add('(max-width: 991px)', () => {
    let anim = createLottieScrollTrigger({
      target: '#mobile-lottie',
      path: './src/assets/mobile-first-scroll-people.json',
      trigger: '.hero-section',
      start: 'top top',
      end: '+=750',
    });
    return () => anim?.destroy();
  });
});