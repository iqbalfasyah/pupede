
const pupede = {
  web: {}
};

/* =========================
   MAIN INIT
========================= */
pupede.web.init = function () {
  pupede.web.product.init();
  pupede.web.gdrive.init();
  pupede.web.carousel.init();
  pupede.web.ui.init();
};

/* =========================
   PRODUCT MODULE
========================= */
pupede.web.product = {
  data: {},
  modal: null,
  modalTitle: null,
  gallery: null,
  closeBtn: null,

  init() {
    this.cacheDom();
    this.bindEvents();
    this.loadData();
  },

  cacheDom() {
    this.modal = document.getElementById('productModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.gallery = document.getElementById('productGallery');
    this.closeBtn = document.querySelector('.close');
  },

  bindEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        this.show(card.dataset.category);
      });
    });

    this.closeBtn.onclick = () => this.hide();

    window.onclick = (e) => {
      if (e.target === this.modal) this.hide();
    };
  },

  async loadData() {
    try {
      const res = await fetch('product.json');
      const text = await res.text();
      this.data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error('Failed load products.json', e);
      this.data = {};
    }
  },

  show(category) {
    const data = this.data[category];
    this.modalTitle.textContent = data?.name || 'Produk';
    this.gallery.innerHTML = '';
    console.log(data);
    if (!data || !data.items || data.items.length === 0) {
      this.gallery.innerHTML = `
        <div class="coming-soon">
          Akan datang, tunggu momentnya ✨
        </div>`;
    } else {
      data.items.forEach(item => {
        this.gallery.appendChild(this.createItem(item));
      });

      pupede.web.gdrive.init();

    }

    this.modal.style.display = 'block';
    setTimeout(() => this.modal.classList.add('show'), 10);
  },

  hide() {
    this.modal.classList.remove('show');
    setTimeout(() => (this.modal.style.display = 'none'), 300);
  },

  createItem(item) {
  const div = document.createElement('div');

  const price = Number(item.price);
  const markupPercent = 30;
  const priceBefore = pupede.web.ui.markupPrice(price, markupPercent);

  div.className = 'gallery-item';
  div.innerHTML = `
    <div class="gallery-image">
      <img src="${item.image}" alt="${item.name}">
    </div>

    <div class="gallery-info">
      <h3>${item.name}</h3>

      <div class="price-wrapper">
        <span class="price-before">
          Rp. ${pupede.web.ui.formatRupiah(priceBefore)}
        </span>
        <span class="price-now">
          Rp. ${pupede.web.ui.formatRupiah(price)}
        </span>
      </div>

      ${this.shopLinks(item)}
    </div>
  `;

  return div;
},

  shopLinks(item) {
    return `
      <div class="shop-links">
        <a href="https://wa.me/6285211222122?text=Halo%20Pupi,%20 Saya%20mau%20pesan%20produknya%20" target="_blank" class="shop-btn tokopedia"><i class="fab fa-whatsapp"></i></a>
        ${item.tokopedia ? `<a href="${item.tokopedia}" target="_blank" class="shop-btn tokopedia"></a>` : ''}
        ${item.shopee ? `<a href="${item.shopee}" target="_blank" class="shop-btn shopee"></a>` : ''}
        ${item.tiktok ? `<a href="${item.tiktok}" target="_blank" class="shop-btn tiktok"><i class="fab fa-tiktok"></i></a>` : ''}
      </div>`;
  }
};

/* =========================
   GOOGLE DRIVE IMAGE MODULE
========================= */
pupede.web.gdrive = {
  init(root = document) {
    this.render(root);
  },

  render(root) {
    this.renderImg(root);
    this.renderBackground(root);
  },

  /* ---------- IMG TAG ---------- */
  renderImg(root) {
    const images = root.querySelectorAll('img[src*="drive.google.com"]');

    images.forEach(img => {
      const id = this.extractId(img.src);
      if (!id) return;

      img.src = this.buildUrl(id);
      img.onerror = () => (img.src = 'placeholder.png');
    });
  },

  /* ---------- BACKGROUND IMAGE ---------- */
  renderBackground(root) {
    const elements = root.querySelectorAll('[style*="background-image"]');

    elements.forEach(el => {
      const style = el.getAttribute('style');

      const urlMatch = style.match(
        /background-image\s*:\s*url\((['"]?)(.*?)\1\)/i
      );
      if (!urlMatch) return;

      const url = urlMatch[2];
      if (!url.includes('drive.google.com')) return;

      const id = this.extractId(url);
      if (!id) return;

      el.style.backgroundImage = `url('${this.buildUrl(id, 1920)}')`;
    });
  },

  /* ---------- HELPERS ---------- */
  extractId(src) {
    return (
      src.match(/\/d\/([^/]+)/)?.[1] ||
      src.match(/id=([^&]+)/)?.[1] ||
      null
    );
  },

  buildUrl(id, size = 1200) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
  }
};

/* =========================
   CAROUSEL MODULE
========================= */
pupede.web.carousel = {
  slides: [],
  index: 0,
  timer: null,
  defaultInterval: 5000,

  init() {
    this.slides = document.querySelectorAll('.slide');
    if (!this.slides.length) return;

    this.index = 0;
    this.show(this.index);
    this.scheduleNext();
  },

  show(i) {
    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i);
    });
  },

  scheduleNext() {
    const currentSlide = this.slides[this.index];
    const interval =
      Number(currentSlide.dataset.interval) || this.defaultInterval;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.index = (this.index + 1) % this.slides.length;
      this.show(this.index);
      this.scheduleNext(); // 🔁 loop with next slide interval
    }, interval);
  }
};


/* =========================
   UI / MENU / SCROLL
========================= */
pupede.web.ui = {
  init() {
    this.smoothScroll();
    this.mobileMenu();
  },

  smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))
          ?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  },

  mobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    btn.onclick = () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };

    menu.onclick = () => (menu.style.display = 'none');
  },
  formatRupiah(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('id-ID');
  },
   markupPrice(price, percent = 30) {
    const base = Number(price.toString().replace(/\D/g, ''));
    return Math.round(base + (base * percent / 100));
  }
};

/* =========================
   DOM READY
========================= */
document.addEventListener('DOMContentLoaded', () => {
  pupede.web.init();
});