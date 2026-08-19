/* ============================================================
   İÇERİK YÜKLEYİCİ (content-loader.js)

   Ne işe yarar: Sayfa yüklendiğinde data/content.json dosyasını
   okuyup, mevcut HTML kartlarının içindeki metinleri ve görsel
   yollarını GÜNCELLER. Tasarıma, HTML yapısına dokunmaz — sadece
   mevcut elemanların yazısını/görselini değiştirir.

   Admin panelinden (admin/) yapılan değişiklikler bu dosya
   (data/content.json) üzerinden siteye yansır.

   NOT: Bu script her bölümdeki kart SAYISINA göre değil, HTML'de
   o an kaç kart varsa o kadarını dolduracak şekilde çalışır.
   Yani admin panelinden yeni kart EKLENEMEZ/SİLİNEMEZ — sadece
   var olan kartların metni ve görseli değiştirilebilir. Kart
   sayısını değiştirmek için index.html üzerinde elle düzenleme
   gerekir.
   ============================================================ */
(function () {
  function setText(el, val) {
    if (el && val != null) el.textContent = val;
  }
  function setImg(el, src, alt) {
    if (!el || !src) return;
    el.src = src;
    if (alt) el.alt = alt;
  }
  function fillCards(nodeList, items, fillOne) {
    if (!items) return;
    nodeList.forEach(function (el, i) {
      if (items[i]) fillOne(el, items[i]);
    });
  }

  fetch('data/content.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(function (data) {

      /* ---------- HERO ---------- */
      if (data.hero) {
        var heroSection = document.querySelector('.hero');
        if (heroSection) {
          setText(heroSection.querySelector('.eyebrow'), data.hero.eyebrow);
          setText(heroSection.querySelector('.hero-lead'), data.hero.lead);
          setImg(heroSection.querySelector('.hero-media img'), data.hero.image);
          var stats = heroSection.querySelectorAll('.hero-stat-num[data-count-to]');
          if (stats[0] && data.hero.stat_customers != null) stats[0].setAttribute('data-count-to', data.hero.stat_customers);
          if (stats[1] && data.hero.stat_years != null) stats[1].setAttribute('data-count-to', data.hero.stat_years);
          if (stats[2] && data.hero.stat_software != null) stats[2].setAttribute('data-count-to', data.hero.stat_software);
        }
      }

      /* ---------- SEKTÖRLER ---------- */
      fillCards(document.querySelectorAll('#sektorler .sector-card'), data.sektorler, function (card, item) {
        setText(card.querySelector('h3'), item.title);
        setText(card.querySelector('p'), item.desc);
      });

      /* ---------- MARKALAR ---------- */
      fillCards(document.querySelectorAll('#markalar .brand-card'), data.markalar, function (card, item) {
        setImg(card.querySelector('.brand-logo img'), item.logo, item.title ? item.title + ' logosu' : null);
        setText(card.querySelector('h3'), item.title);
        setText(card.querySelector('.brand-badge'), item.badge);
        setText(card.querySelector('p'), item.desc);
      });

      /* ---------- E-DÖNÜŞÜM ---------- */
      fillCards(document.querySelectorAll('#edonusum .service-card'), data.edonusum, function (card, item) {
        setText(card.querySelector('h3'), item.title);
        setText(card.querySelector('p'), item.desc);
      });

      /* ---------- DONANIMLAR ---------- */
      fillCards(document.querySelectorAll('#donanimlar .hw-item'), data.donanimlar, function (item, d) {
        setText(item.querySelector('.hw-item-title'), d.title);
        setImg(item.querySelector('.hw-item-media img'), d.image, d.title);
        setText(item.querySelector('.hw-item-desc'), d.desc);
      });

      /* ---------- REFERANSLAR ---------- */
      fillCards(document.querySelectorAll('#referanslar .ref-item'), data.referanslar, function (btn, item) {
        setImg(btn.querySelector('img'), item.logo, item.name ? item.name + ' logosu' : null);
        setText(btn.querySelector('span'), item.name);
        if (item.name) btn.setAttribute('data-caption', item.name);
      });

      /* ---------- HİZMETLER ---------- */
      fillCards(document.querySelectorAll('#hizmetler .service-card'), data.hizmetler, function (card, item) {
        setText(card.querySelector('h3'), item.title);
        setText(card.querySelector('p'), item.desc);
      });

      /* ---------- HAKKIMIZDA ---------- */
      if (data.hakkimizda) {
        var about = document.querySelector('#hakkimizda');
        if (about) {
          var paras = Array.prototype.slice.call(about.querySelectorAll('.about-copy p'))
            .filter(function (p) { return !p.classList.contains('eyebrow'); });
          setText(paras[0], data.hakkimizda.paragraf1);
          setText(paras[1], data.hakkimizda.paragraf2);
          setImg(about.querySelector('.about-media img'), data.hakkimizda.image);
        }
      }

      /* ---------- FOOTER ---------- */
      if (data.footer) {
        setText(document.querySelector('.footer-brand p'), data.footer.tagline);
      }

      /* ---------- GALERİ MÜŞTERİ LİSTESİ ----------
         Galeri fotoğrafları hâlâ manuel olarak
         images/galeri/<musteri-slug>/1.jpg şeklinde yükleniyor.
         Bu sadece müşteri adı/klasör eşleşme listesini CMS'ten okur. */
      if (data.galeri && data.galeri.length && window.__setGalleryCustomers) {
        window.__setGalleryCustomers(data.galeri);
      }
    })
    .catch(function (err) {
      /* Veri okunamazsa sayfa mevcut statik içerikle çalışmaya devam eder. */
      console.warn('İçerik yüklenemedi, statik içerik gösteriliyor:', err);
    });
})();
