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
  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const toastNotification = document.getElementById('toastNotification');
  const showcaseModal = document.getElementById('showcaseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const previewButtons = document.querySelectorAll('.showcase-preview-btn');
  const faqQuestions = document.querySelectorAll('.faq-question');
  const contactSection = document.getElementById('contact');

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
  let lastScrollY = window.scrollY;

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

    // Mobile Sticky Bottom Bar visibility
    if (mobileStickyBar) {
      // Show when scrolled past hero section (~350px)
      const pastHero = currentScrollY > 350;
      
      // Hide when contact section is clearly in view
      let inContact = false;
      if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        inContact = contactRect.top < window.innerHeight * 0.7;
      }

      if (pastHero && !inContact) {
        mobileStickyBar.classList.add('is-visible');
        mobileStickyBar.setAttribute('aria-hidden', 'false');
      } else {
        mobileStickyBar.classList.remove('is-visible');
        mobileStickyBar.setAttribute('aria-hidden', 'true');
      }
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

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
     6. SHOWCASE PREVIEW MODAL
     ========================================================================== */
  const showcaseData = {
    'modal-cafe': {
      title: 'SUNNY COFFEE ROASTERS 様（飲食店・カフェデモ）',
      subtitle: '業種：カフェ・喫茶・ロースタリー / テイクアウト対応',
      imgSrc: 'images/samples/sample-cafe.svg',
      desc: '店内の落ち着いた空気感や焙煎へのこだわりを伝えるため、温かみのあるアースカラーで統一。テイクアウトメニューの確認やアクセス情報への動線を整理し、初めて訪れるお客様も迷わず来店できるよう配慮した構成です。',
      points: [
        '自家焙煎のこだわりがひと目で伝わるファーストビュー',
        'スマートフォンでも指1本でスクロールしやすいカードUI',
        '「メニュー一覧」「テイクアウト」「アクセス」への明快なナビゲーション',
        'Googleマップ連携・営業時間などの基本情報を網羅'
      ]
    },
    'modal-salon': {
      title: 'Lino hair & spa 様（美容室・サロンデモ）',
      subtitle: '業種：ヘアサロン・ヘッドスパ・プライベートサロン',
      imgSrc: 'images/samples/sample-salon.svg',
      desc: '洗練されたタイポグラフィと清潔感のある余白設計で、上質なプライベート空間を表現。WEB予約ボタンを常時押しやすい位置に配置し、新規顧客の離脱を防ぎます。',
      points: [
        '安心感を高める口コミ評価と丁寧な施術メニュー料金表',
        '押しやすいWEB予約ボタンとマンツーマン対応のアピール',
        '大人女性に好まれるナチュラルかつ清潔感のあるカラースキーム',
        '定休日・アクセス情報の見やすい整理'
      ]
    },
    'modal-seitai': {
      title: 'ひだまり整体整骨院 様（整体・治療院デモ）',
      subtitle: '業種：整体院・整骨院・鍼灸・リラクゼーション',
      imgSrc: 'images/samples/sample-seitai.svg',
      desc: '体の痛みに悩む患者様に安心感と信頼感を届けるグリーン＆ブルートーン。初めての方でも気軽に来院できるよう、「初回限定割引クーポン」と「LINE予約」をわかりやすく配置しました。',
      points: [
        '「痛くない」「国家資格者常駐」の安心感を強調',
        '初回限定クーポンの目立つレイアウトで来院の後押し',
        'スマートフォンからのワンタップLINE予約・電話発信に対応',
        '産後ケアやお子様連れ対応など、ターゲット層の不安を払拭'
      ]
    }
  };

  function openModal(modalKey) {
    const data = showcaseData[modalKey];
    if (!data || !modalBody || !showcaseModal) return;

    modalBody.innerHTML = `
      <div class="modal-img-wrap">
        <img src="${data.imgSrc}" alt="${data.title}" width="600" height="400" style="width:100%; height:auto;">
      </div>
      <div class="modal-details">
        <h3>${data.title}</h3>
        <p class="modal-subtitle">${data.subtitle}</p>
        <p>${data.desc}</p>
        <div class="modal-points">
          <h4>制作のポイント</h4>
          <ul>
            ${data.points.map(pt => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 24px; text-align: center;">
          <a href="#contact" class="btn btn-primary btn-block modal-cta-btn">
            <span>このテイストで無料デモを相談する（0円）</span>
          </a>
        </div>
      </div>
    `;

    // Bind event for modal CTA button to close modal and scroll to contact
    const modalCtaBtn = modalBody.querySelector('.modal-cta-btn');
    if (modalCtaBtn) {
      modalCtaBtn.addEventListener('click', () => {
        closeModal();
      });
    }

    showcaseModal.classList.add('is-active');
    showcaseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!showcaseModal) return;
    showcaseModal.classList.remove('is-active');
    showcaseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetKey = btn.getAttribute('data-target');
      openModal(targetKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (showcaseModal) {
    showcaseModal.addEventListener('click', (e) => {
      if (e.target === showcaseModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showcaseModal && showcaseModal.classList.contains('is-active')) {
      closeModal();
    }
  });

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
