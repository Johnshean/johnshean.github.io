/**
 * LBH EZRA - Publications Loader
 * Dynamically loads and displays publications from JSON
 */

class PublicationsLoader {
    constructor(containerId, dataPath = 'data/publications.json') {
        this.container = document.getElementById(containerId);
        this.dataPath = dataPath;
        this.publications = [];
        this.filteredPublications = [];
        this.currentFilter = 'all';

        if (this.container) {
            this.init();
        }
    }

    async init() {
        this.showLoading();
        await this.loadData();
        this.render();
        this.bindFilters();
    }

    showLoading() {
        this.container.innerHTML = `
      <div class="publication-card skeleton" style="height: 350px;"></div>
      <div class="publication-card skeleton" style="height: 350px;"></div>
      <div class="publication-card skeleton" style="height: 350px;"></div>
    `;
    }

    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) throw new Error('Failed to load publications');

            const data = await response.json();
            this.publications = data.publications || [];
            this.filteredPublications = [...this.publications];
        } catch (error) {
            console.error('Error loading publications:', error);
            this.publications = [];
            this.filteredPublications = [];
        }
    }

    render() {
        if (this.filteredPublications.length === 0) {
            this.container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p>Belum ada publikasi yang tersedia.</p>
        </div>
      `;
            return;
        }

        this.container.innerHTML = this.filteredPublications.map((pub, index) => this.createCard(pub, index)).join('');
    }

    createCard(publication, index) {
        const date = this.formatDate(publication.date);
        const staggerClass = `stagger-${(index % 4) + 1}`;

        return `
      <article class="publication-card animate-fade-in-up ${staggerClass}">
        <div class="publication-image">
          <img src="${publication.thumbnail || 'images/placeholder-news.jpg'}" 
               alt="${publication.title}"
               loading="lazy">
          <span class="publication-source">${publication.source}</span>
        </div>
        <div class="publication-body">
          <time class="publication-date">${date}</time>
          <h4>${publication.title}</h4>
          <p>${publication.excerpt || ''}</p>
          <a href="${publication.url}" target="_blank" rel="noopener noreferrer" class="publication-link">
            Baca Selengkapnya 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </article>
    `;
    }

    formatDate(dateString) {
        if (!dateString) return '';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', options);
    }

    filter(category) {
        this.currentFilter = category;

        if (category === 'all') {
            this.filteredPublications = [...this.publications];
        } else {
            this.filteredPublications = this.publications.filter(
                pub => pub.category?.toLowerCase() === category.toLowerCase()
            );
        }

        this.render();
        this.updateFilterButtons();
    }

    bindFilters() {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filter(filter);
            });
        });
    }

    updateFilterButtons() {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const publicationGrid = document.getElementById('publication-grid');
    if (publicationGrid) {
        new PublicationsLoader('publication-grid');
    }
});
