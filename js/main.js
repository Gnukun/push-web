/**
 * プッシュ！ 公式Webサイト JavaScript
 * 軽快な動作・アクセシビリティ・快適なユーザー体験
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CONSTANTS & ELEMENT SELECTORS
     ========================================================================== */
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const toastNotification = document.getElementById('toastNotification');
  const faqQuestions = document.querySelectorAll('.faq-question');

  const EMAIL_ADDRESS = 'pushweb77@gmail.com';

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  function toggleMobileNav(open) {
    const isOpen = typeof open === 'boolean' ? open : !hamburgerBtn.classList.contains('is-active');

    hamburgerBtn.classList.toggle('is-active', isOpen);
    mobileNav.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));

    // Prevent background scrolling when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }

  // Close nav when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileNav(false);
    });
  });

  // Close nav on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerBtn && hamburgerBtn.classList.contains('is-active')) {
      toggleMobileNav(false);
    }
  });

  /* ==========================================================================
     3. HEADER SCROLL & STICKY MOBILE BAR
     ========================================================================== */
  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Header shadow toggle
    if (header) {
      if (currentScrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Reset the mobile drawer when switching to the desktop layout.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && hamburgerBtn?.classList.contains('is-active')) {
      toggleMobileNav(false);
    }
  });

  /* ==========================================================================
     4. FAQ ACCORDION
     ========================================================================== */
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all other open FAQs for a clean accordion effect
      faqQuestions.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.style.maxHeight = null;
          }
        }
      });

      // Toggle clicked item
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     5. EMAIL CLIPBOARD COPY
     ========================================================================== */
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('is-shown');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('is-shown');
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(EMAIL_ADDRESS);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = EMAIL_ADDRESS;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        if (copyBtnText) copyBtnText.textContent = 'コピーしました！';
        showToast('メールアドレスをコピーしました！');

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'アドレスをコピー';
        }, 2500);
      } catch (err) {
        showToast('コピーに失敗しました。手動で選択してください。');
      }
    });
  }

  /* ==========================================================================
     7. SMOOTH SCROLL WITH HEADER OFFSET
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = window.innerWidth >= 1024 ? 72 : 64;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const animTargets = document.querySelectorAll(
    '.feature-card, .pricing-card, .target-item, .showcase-card, .timeline-step, .options-pricing-box, .cta-box'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animTargets.forEach(el => {
      el.classList.add('fade-in-up');
      observer.observe(el);
    });
  }

});
