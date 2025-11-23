        let productsData = {};

        fetch('product.json')
            .then(res => res.json())
            .then(data => {
                productsData = data;
            })
            .catch(err => console.error('Failed to load product.json', err));

    
        // Modal functionality
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const productGallery = document.getElementById('productGallery');
        const closeBtn = document.querySelector('.close');

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Product card click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const category = this.dataset.category;
                showProductGallery(category);
            });
        });

        function showProductGallery(category) {
            const data = productsData[category];
            if (!data) return;

            modalTitle.textContent = data.name;
            productGallery.innerHTML = '';

            data.items.forEach(item => {
                const productItem = document.createElement('div');
                productItem.className = 'gallery-item';
                productItem.innerHTML = `
                    <div class="gallery-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="gallery-info">
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                        <div class="shop-links">
                            <a href="${item.tokopedia}" target="_blank" class="shop-btn tokopedia" title="Beli di Tokopedia">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                </svg>
                            </a>
                            <a href="${item.shopee}" target="_blank" class="shop-btn shopee" title="Beli di Shopee">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                </svg>
                            </a>
                            <a href="${item.tiktok}" target="_blank" class="shop-btn tiktok" title="Beli di TikTok Shop">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
                productGallery.appendChild(productItem);
            });

            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }

        closeBtn.onclick = function() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        }

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        mobileMenuBtn.click();
        mobileMenuBtn.click();