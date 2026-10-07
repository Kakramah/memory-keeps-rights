(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const chapters = all('.chapter');
  const menu = $('#reading-menu');
  const menuButton = $('#menu-toggle');
  function closeMenu(focus = false) { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); if (focus) menuButton.focus(); }
  menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(true); });
  const words = $('article').innerText.trim().split(/\s+/).length;
  $('.reading-time').textContent = new Intl.NumberFormat('ar').format(Math.ceil(words / 180)) + ' دقائق قراءة';
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('seen'); observer.unobserve(entry.target); } }); }, {threshold: .08});
  all('.chapter,.closing').forEach(el => observer.observe(el));
  let frame = false;
  function onScroll() {
    const y = window.scrollY;
    const height = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--progress', String(height > 0 ? Math.min(1, y / height) : 0));
    $('.side-nav').classList.toggle('visible', y > $('.hero').offsetHeight * .75 && $('.closing').getBoundingClientRect().top > 0);
    let current = chapters[0];
    chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top < innerHeight * .45) current = chapter; });
    all('[data-section]').forEach(link => { if (link.dataset.section === current.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    if (!motion.matches && !mobile.matches) {
      $('.hero').style.setProperty('--drift', Math.min(160, y) + 'px');
      all('.visual-column').forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.style.setProperty('--drift', Math.max(-14, Math.min(14, (innerHeight / 2 - r.top - r.height / 2) * .025)) + 'px'); });
    }
    frame = false;
  }
  function scheduleScroll() { if (!frame) { frame = true; requestAnimationFrame(onScroll); } }
  addEventListener('scroll', scheduleScroll, {passive:true}); addEventListener('resize', scheduleScroll); onScroll();
  const sources = $('#sources');
  function revealSource(hash) { if (hash.startsWith('#source-')) { sources.open = true; const target = document.getElementById(hash.slice(1)); if (target) { requestAnimationFrame(() => { target.focus({preventScroll:true}); target.scrollIntoView({behavior: motion.matches ? 'auto' : 'smooth', block:'center'}); }); } } }
  all('.reference').forEach(link => link.addEventListener('click', () => { sources.open = true; revealSource(link.hash); }));
  addEventListener('hashchange', () => revealSource(location.hash)); revealSource(location.hash);
  const explanations = ['احتفظ بالمادة الأصلية منفصلة عن نسخة النشر، كي يبقى الرجوع إليها ممكنًا.', 'اربط المادة بما تعرفه عن وقتها ومكانها ومصدرها، وصرّح بما بقي غير معلوم.', 'قارن الأدلة المستقلة، وصحّح النسبة الخاطئة علنًا. كثرة التداول لا تثبت صحة المعلومة.'];
  all('[data-evidence]').forEach(button => button.addEventListener('click', () => { all('[data-evidence]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); $('#evidence-explanation').textContent = explanations[Number(button.dataset.evidence)]; }));
  const lightbox = $('#lightbox');
  const images = all('.story-photo');
  let imageIndex = 0, imageTrigger;
  function showImage(i) { imageIndex = (i + images.length) % images.length; const image = images[imageIndex]; $('#lightbox-image').src = image.src; $('#lightbox-image').alt = image.alt; $('#lightbox-title').textContent = image.dataset.title; $('#lightbox-caption').textContent = image.dataset.desc; $('#image-position').textContent = new Intl.NumberFormat('ar').format(imageIndex + 1) + ' من ' + new Intl.NumberFormat('ar').format(images.length); }
  all('[data-image]').forEach(button => button.addEventListener('click', () => { imageTrigger = button; showImage(Number(button.dataset.image)); lightbox.showModal(); document.body.style.overflow = 'hidden'; $('#lightbox-close').focus(); }));
  $('#lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => { document.body.style.overflow = ''; imageTrigger?.focus({preventScroll:true}); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) { const r = lightbox.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) lightbox.close(); } });
  lightbox.addEventListener('keydown', e => { if (e.key === 'ArrowRight') {e.preventDefault();showImage(imageIndex - 1);} if (e.key === 'ArrowLeft') {e.preventDefault();showImage(imageIndex + 1);} });
  $('#previous-image').addEventListener('click', () => showImage(imageIndex - 1)); $('#next-image').addEventListener('click', () => showImage(imageIndex + 1));
  const canonicalURL = 'https://kakramah.github.io/memory-keeps-rights/';
  const title = 'الذاكرة عتاد الثائرين';
  const shareURL = location.hostname === 'kakramah.github.io' ? canonicalURL : location.href.split('#')[0];
  const encodedURL = encodeURIComponent(shareURL), encodedText = encodeURIComponent(title + '\n' + shareURL);
  const shareLinks = {whatsapp:'https://wa.me/?text=' + encodedText, telegram:'https://t.me/share/url?url=' + encodedURL + '&text=' + encodeURIComponent(title), x:'https://twitter.com/intent/tweet?text=' + encodedText, facebook:'https://www.facebook.com/sharer/sharer.php?u=' + encodedURL};
  all('[data-share]').forEach(a => a.href = shareLinks[a.dataset.share]);
  $('#share-button').addEventListener('click', async () => { if (navigator.share) { try { await navigator.share({title,text:'أن يبقى للضحية اسم، وللجريمة فاعل، وللبيت أصحابه.',url:shareURL}); return; } catch (e) { if (e.name === 'AbortError') return; } } $('#share-options').hidden = !$('#share-options').hidden; $('#share-button').setAttribute('aria-expanded', String(!$('#share-options').hidden)); });
  $('#copy-link').addEventListener('click', async () => { try { await navigator.clipboard.writeText(shareURL); $('#share-status').textContent = location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? 'نُسخ رابط المعاينة المحلية. المشاركة العامة تصبح متاحة بعد النشر.' : 'نُسخ الرابط. يمكنك مشاركته الآن.'; } catch { $('#share-status').textContent = 'تعذّر النسخ. يمكنك نسخ رابط الصفحة من شريط العنوان.'; } });
  addEventListener('beforeprint', () => { all('details').forEach(d => { d.dataset.wasOpen = String(d.open); d.open = true; }); });
  addEventListener('afterprint', () => { all('details').forEach(d => { d.open = d.dataset.wasOpen === 'true'; delete d.dataset.wasOpen; }); });
})();
