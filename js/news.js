/**
 * Stuttgart Mobil - News Module
 * Verwaltet die Nachrichten-Anzeige mit Suchfunktion
 */

class NewsManager {
    constructor() {
        this.news = [];
        this.filteredNews = [];
        this.currentQuery = '';
        this.currentSort = 'date';
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadNews();
            this.setupEventListeners();
            this.renderNews();
        } catch (error) {
            console.error('Error initializing NewsManager:', error);
            this.showError('Fehler beim Laden der Nachrichten');
        }
    }
    
    async loadNews() {
        try {
            const response = await fetch('data/news.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.news = await response.json();
            this.filteredNews = [...this.news];
        } catch (error) {
            console.error('Error loading news:', error);
            this.loadMockNews();
        }
    }
    
    loadMockNews() {
        this.news = [
            {
                id: 1,
                title: "Stuttgart wird zur Smart City",
                summary: "Die Stadt Stuttgart hat ihr umfassendes Digitalisierungskonzept vorgestellt.",
                author: "Pressestelle Stadt Stuttgart",
                publishedAt: "2025-03-15T09:00:00Z",
                category: "stadtentwicklung",
                featured: true,
                readTime: 3,
                tags: ["digitalisierung", "smart-city"]
            },
            {
                id: 2,
                title: "Neuer Radweg zwischen Mitte und Vaihingen eröffnet",
                summary: "Der neue Radschnellweg verkürzt die Fahrzeit für Radfahrer erheblich.",
                author: "Amt für Stadtplanung",
                publishedAt: "2025-03-12T11:30:00Z",
                category: "verkehr",
                featured: false,
                readTime: 2,
                tags: ["radweg", "mobilität"]
            }
        ];
        this.filteredNews = [...this.news];
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('newsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', 
                this.debounce((e) => {
                    this.currentQuery = e.target.value;
                    this.applyFilters();
                }, 300)
            );
        }
        
        // Sort functionality
        const sortSelect = document.getElementById('newsSort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applySort();
            });
        }
    }
    
    applyFilters() {
        if (!this.currentQuery.trim()) {
            this.filteredNews = [...this.news];
        } else {
            const query = this.currentQuery.toLowerCase();
            this.filteredNews = this.news.filter(article => 
                article.title.toLowerCase().includes(query) ||
                article.summary.toLowerCase().includes(query) ||
                article.tags.some(tag => tag.toLowerCase().includes(query)) ||
                article.category.toLowerCase().includes(query)
            );
        }
        
        this.applySort();
    }
    
    applySort() {
        this.filteredNews.sort((a, b) => {
            switch (this.currentSort) {
                case 'date':
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                case 'relevance':
                    // Sort by featured first, then by date
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                default:
                    return 0;
            }
        });
        
        this.renderNews();
    }
    
    renderNews() {
        this.renderHighlightNews();
        this.renderNewsList();
    }
    
    renderHighlightNews() {
        const highlightContainer = document.getElementById('highlightNews');
        if (!highlightContainer) return;
        
        const featuredNews = this.filteredNews.find(article => article.featured);
        
        if (!featuredNews) {
            highlightContainer.innerHTML = '<p>Keine hervorgehobenen Nachrichten verfügbar.</p>';
            return;
        }
        
        const publishedDate = new Date(featuredNews.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        highlightContainer.innerHTML = `
            <div class="highlight-article" data-article-id="${featuredNews.id}">
                <h3 class="highlight-title">${featuredNews.title}</h3>
                <p class="highlight-summary">${featuredNews.summary}</p>
                <div class="highlight-meta">
                    <span class="highlight-date">${formattedDate}</span>
                    <span class="highlight-author">von ${featuredNews.author}</span>
                    <span class="highlight-read-time">${featuredNews.readTime} Min. Lesezeit</span>
                </div>
            </div>
        `;
    }
    
    renderNewsList() {
        const newsListContainer = document.getElementById('newsList');
        if (!newsListContainer) return;
        
        // Remove featured article from list (it's shown in highlight)
        const nonFeaturedNews = this.filteredNews.filter(article => !article.featured);
        
        if (nonFeaturedNews.length === 0) {
            newsListContainer.innerHTML = this.renderEmptyState();
            return;
        }
        
        newsListContainer.innerHTML = nonFeaturedNews
            .map(article => this.renderNewsItem(article))
            .join('');
        
        // Add click handlers
        this.addNewsItemClickHandlers();
    }
    
    renderNewsItem(article) {
        const publishedDate = new Date(article.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const categoryColors = {
            'stadtentwicklung': 'var(--color-primary)',
            'verkehr': 'var(--color-success)',
            'umwelt': 'var(--stuttgart-green)',
            'kultur': '#9c27b0',
            'sport': '#ff5722',
            'bildung': '#607d8b'
        };
        
        const categoryColor = categoryColors[article.category] || 'var(--gray-500)';
        
        return `
            <article class="news-item" data-article-id="${article.id}">
                <div class="news-item-header">
                    <span class="news-category" style="background-color: ${categoryColor};">
                        ${this.getCategoryName(article.category)}
                    </span>
                    <span class="news-date">${formattedDate}</span>
                </div>
                <h3 class="news-item-title">${article.title}</h3>
                <p class="news-item-summary">${article.summary}</p>
                <div class="news-item-meta">
                    <div class="news-item-info">
                        <span class="news-author">${article.author}</span>
                        <span class="news-read-time">${article.readTime} Min.</span>
                    </div>
                    <div class="news-tags">
                        ${article.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;
    }
    
    getCategoryName(category) {
        const names = {
            'stadtentwicklung': 'Stadtentwicklung',
            'verkehr': 'Verkehr',
            'umwelt': 'Umwelt',
            'kultur': 'Kultur',
            'sport': 'Sport',
            'bildung': 'Bildung',
            'digitalisierung': 'Digitalisierung',
            'natur': 'Natur',
            'freizeit': 'Freizeit'
        };
        
        return names[category] || 'Allgemein';
    }
    
    addNewsItemClickHandlers() {
        document.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', () => {
                const articleId = item.getAttribute('data-article-id');
                this.showArticleDetail(articleId);
            });
        });
        
        document.querySelectorAll('.highlight-article').forEach(item => {
            item.addEventListener('click', () => {
                const articleId = item.getAttribute('data-article-id');
                this.showArticleDetail(articleId);
            });
        });
    }
    
    showArticleDetail(articleId) {
        const article = this.news.find(a => a.id === parseInt(articleId));
        if (!article) return;
        
        // Create modal or navigate to detail page
        this.openArticleModal(article);
    }
    
    openArticleModal(article) {
        const publishedDate = new Date(article.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <button class="modal-close" onclick="this.closest('.article-modal').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="article-meta">
                        <span class="article-category">${this.getCategoryName(article.category)}</span>
                        <span class="article-date">${formattedDate}</span>
                    </div>
                    <h1 class="article-title">${article.title}</h1>
                    <div class="article-author-info">
                        <span class="article-author">von ${article.author}</span>
                        <span class="article-read-time">${article.readTime} Minuten Lesezeit</span>
                    </div>
                    <div class="article-content">
                        <p class="article-summary">${article.summary}</p>
                        ${article.content ? `<div class="article-body">${article.content.replace(/\n/g, '</p><p>')}</div>` : ''}
                    </div>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Prevent scroll on body
        document.body.style.overflow = 'hidden';
        
        // Remove body scroll lock when modal is closed
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                document.body.style.overflow = '';
                modal.remove();
            }
        });
        
        // ESC key support
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.style.overflow = '';
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                <h3>Keine Nachrichten gefunden</h3>
                <p>Mit den aktuellen Suchkriterien wurden keine Nachrichten gefunden.</p>
                <button class="btn btn-primary" onclick="newsManager.clearSearch()">
                    Suche zurücksetzen
                </button>
            </div>
        `;
    }
    
    clearSearch() {
        const searchInput = document.getElementById('newsSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.currentQuery = '';
        this.applyFilters();
        
        if (window.stuttgartApp) {
            window.stuttgartApp.showNotification('Suche wurde zurückgesetzt', 'info');
        }
    }
    
    showError(message) {
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="error-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <h3>Fehler beim Laden</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Seite neu laden
                    </button>
                </div>
            `;
        }
    }
    
    // Utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Modal Styles
const newsModalStyles = `
    .article-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        position: relative;
        background: var(--bg-primary);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 800px;
        max-height: 90vh;
        margin: var(--spacing-lg);
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
    }
    
    .modal-header {
        position: absolute;
        top: var(--spacing-lg);
        right: var(--spacing-lg);
        z-index: 10001;
    }
    
    .modal-close {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: var(--shadow-md);
    }
    
    .modal-close:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.1);
    }
    
    .modal-body {
        padding: var(--spacing-2xl);
        overflow-y: auto;
        max-height: 90vh;
    }
    
    .article-meta {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
        align-items: center;
    }
    
    .article-category {
        background: var(--color-primary);
        color: var(--text-inverse);
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: 600;
    }
    
    .article-date {
        color: var(--text-muted);
        font-size: var(--font-size-sm);
    }
    
    .article-title {
        font-size: var(--font-size-3xl);
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
        line-height: 1.2;
    }
    
    .article-author-info {
        display: flex;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-lg);
        border-bottom: 1px solid var(--gray-200);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
    }
    
    .article-content {
        line-height: 1.7;
        margin-bottom: var(--spacing-xl);
    }
    
    .article-summary {
        font-size: var(--font-size-lg);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
        font-style: italic;
    }
    
    .article-body p {
        margin-bottom: var(--spacing-md);
    }
    
    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
    
    .article-tags .tag {
        background: var(--gray-100);
        color: var(--text-secondary);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .modal-content {
            margin: var(--spacing-sm);
            max-height: 95vh;
        }
        
        .modal-body {
            padding: var(--spacing-lg);
        }
        
        .article-title {
            font-size: var(--font-size-2xl);
        }
        
        .article-author-info {
            flex-direction: column;
            gap: var(--spacing-sm);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = newsModalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsManager = new NewsManager();
});