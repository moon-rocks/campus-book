import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const animations = {
  // Hero entrance animation
  animateHero(heroContainerRef: HTMLElement, contentRef: HTMLElement, visualRef: HTMLElement) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Hero container fades in
    tl.fromTo(
      heroContainerRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );

    // 2. Small label appears
    const label = contentRef.querySelector('.hero-anim-label');
    if (label) {
      tl.fromTo(
        label,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      );
    }

    // 3. Heading reveals
    const heading = contentRef.querySelector('.hero-anim-heading');
    if (heading) {
      tl.fromTo(
        heading,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.25'
      );
    }

    // 4. Description fades upward
    const desc = contentRef.querySelector('.hero-anim-desc');
    if (desc) {
      tl.fromTo(
        desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.35'
      );
    }

    // 5. CTA buttons stagger in
    const ctas = contentRef.querySelectorAll('.hero-anim-cta');
    if (ctas.length > 0) {
      tl.fromTo(
        ctas,
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.55, ease: 'back.out(1.5)' },
        '-=0.3'
      );
    }

    // Trust indicators
    const trust = contentRef.querySelector('.hero-anim-trust');
    if (trust) {
      tl.fromTo(
        trust,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }

    // 6. Book stack enters with scale + rotation
    const stack = visualRef ? visualRef.querySelector('.hero-visual-stack') : null;
    if (stack) {
      tl.fromTo(
        stack,
        { scale: 0.8, opacity: 0, rotateY: -20, rotateX: 15 },
        { scale: 1, opacity: 1, rotateY: 0, rotateX: 0, duration: 1.0, ease: 'back.out(1.3)' },
        '-=0.8'
      );
    }

    // 7. Floating information cards appear one by one
    const floatingBadges = visualRef ? visualRef.querySelectorAll('.hero-floating-badge') : [];
    if (floatingBadges.length > 0) {
      tl.fromTo(
        floatingBadges,
        { scale: 0.6, opacity: 0, y: 12 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'back.out(1.8)' },
        '-=0.5'
      );
    }

    return tl;
  },

  // Floating book animation with subtle rotation and parallax
  floatBook(element: HTMLElement) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(element, {
      y: -14,
      rotationZ: 2,
      rotationX: 3,
      duration: 3.5,
      ease: 'sine.inOut',
    });
    return tl;
  },

  // Account dropdown entrance
  animateAccountDropdown(dropdownEl: HTMLElement, onComplete?: () => void) {
    const buttons = dropdownEl.querySelectorAll('.account-stagger-btn');
    const tl = gsap.timeline({ onComplete });

    tl.fromTo(
      dropdownEl,
      { scale: 0.95, opacity: 0, y: 8 },
      { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );

    if (buttons.length > 0) {
      tl.fromTo(
        buttons,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.2, ease: 'power2.out' },
        '-=0.15'
      );
    }
    return tl;
  },

  // Account dropdown exit
  animateAccountDropdownClose(dropdownEl: HTMLElement, onComplete: () => void) {
    gsap.to(dropdownEl, {
      scale: 0.96,
      opacity: 0,
      y: 6,
      duration: 0.2,
      ease: 'power2.in',
      onComplete,
    });
  },

  // ScrollTrigger card stagger reveal
  staggerCards(container: HTMLElement, cardSelector: string = '.book-card-item') {
    const cards = container.querySelectorAll(cardSelector);
    if (!cards.length) return;

    return gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  },

  // Section title reveal with ScrollTrigger
  revealSection(sectionEl: HTMLElement) {
    return gsap.fromTo(
      sectionEl,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  },
};

export { gsap, ScrollTrigger };
