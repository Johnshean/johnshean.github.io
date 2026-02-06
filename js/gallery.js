/**
 * LBH EZRA - Gallery Lightbox
 * Handles gallery display and lightbox functionality
 */

class GalleryLightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.lightbox = null;
        this.init();
    }

    init() {
        this.createLightbox();
        this.bindEvents();
    }

    createLightbox() {
        // Create lightbox HTML
        const lightboxHTML = `
      <div class="lightbox" id="gallery-lightbox">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>
        <div class="lightbox-content">
          <img src="" alt="">
          <div class="lightbox-caption">
            <h4></h4>
            <p></p>
          </div>
        </div>
        <button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('gallery-lightbox');
    }

    bindEvents() {
        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));
        });

        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());

        // Navigation
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());

        // Click outside to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
    }

    collectImages() {
        this.images = [];
        document.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');

            this.images.push({
                src: img.src,
                alt: img.alt,
                title: overlay?.querySelector('h4')?.textContent || '',
                description: overlay?.querySelector('p')?.textContent || ''
            });
        });
    }

    open(index) {
        this.collectImages();
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        const image = this.images[this.currentIndex];
        const img = this.lightbox.querySelector('.lightbox-content img');
        const caption = this.lightbox.querySelector('.lightbox-caption');

        img.src = image.src;
        img.alt = image.alt;
        caption.querySelector('h4').textContent = image.title;
        caption.querySelector('p').textContent = image.description;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-item')) {
        new GalleryLightbox();
    }
});
