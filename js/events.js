/**
 * Stuttgart Mobil - Events Module
 * Verwaltet die Event-Anzeige mit Filterung und Suche
 */

class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilters = {
            date: '',
            category: '',
            location: ''
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadEvents();
            this.setupEventListeners();
            this.renderEvents();
        } catch (error) {
            console.error('Error initializing EventsManager:', error);
            this.showError('Fehler beim Laden der Events');
        }
    }
    
    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.events = await response.json();
            this.filteredEvents = [...this.events];
        } catch (error) {
            console.error('Error loading events:', error);
            // Fallback zu Mock-Daten wenn JSON nicht geladen werden kann
            this.loadMockEvents();
        }
    }
    
    loadMockEvents() {
        this.events = [
            {
                id: 1,
                title: "Stuttgarter Frühlingsfest 2025",
                description: "Das traditionelle Frühlingsfest auf dem Cannstatter Wasen.",
                category: "kultur",
                date: "2025-04-15",
                time: "10:00",
                location: "Cannstatter Wasen",
                price: "Eintritt frei",
                featured: true,
                tags: ["fest", "familie", "tradition"]
            },
            {
                id: 2,
                title: "VfB Stuttgart vs. Bayern München",
                description: "Bundesliga-Topspiel in der Mercedes-Benz Arena.",
                category: "sport",
                date: "2025-04-12",
                time: "15:30",
                location: "Mercedes-Benz Arena",
                price: "Ab 35€",
                featured: true,
                tags: ["fußball", "bundesliga", "sport"]
            }
        ];
        this.filteredEvents = [...this.events];
    }
    
    setupEventListeners() {
        // Filter Event Listeners
        const dateFilter = document.getElementById('dateFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.currentFilters.date = e.target.value;
                this.applyFilters();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }
        
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.currentFilters.location = e.target.value;
                this.applyFilters();
            });
        }
    }
    
    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Datum Filter
            if (this.currentFilters.date) {
                const eventDate = new Date(event.date);
                const now = new Date();
                
                switch (this.currentFilters.date) {
                    case 'today':
                        if (eventDate.toDateString() !== now.toDateString()) {
                            return false;
                        }
                        break;
                    case 'week':
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        if (eventDate < now || eventDate > weekFromNow) {
                            return false;
                        }
                        break;
                    case 'month':
                        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                        if (eventDate < now || eventDate > monthFromNow) {
                            return false;
                        }
                        break;
                }
            }
            
            // Kategorie Filter
            if (this.currentFilters.category && event.category !== this.currentFilters.category) {
                return false;
            }
            
            // Ort Filter (vereinfacht)
            if (this.currentFilters.location) {
                const locationMap = {
                    'mitte': ['Innenstadt', 'Marktplatz', 'Schlossgarten', 'Stuttgart-Mitte'],
                    'bad-cannstatt': ['Bad Cannstatt', 'Cannstatter Wasen', 'Mercedes-Benz Arena'],
                    'vaihingen': ['Vaihingen', 'Universität Stuttgart']
                };
                
                const allowedLocations = locationMap[this.currentFilters.location] || [];
                const matchesLocation = allowedLocations.some(loc => 
                    event.location.toLowerCase().includes(loc.toLowerCase())
                );
                
                if (!matchesLocation) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderEvents();
    }
    
    renderEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;
        
        // Remove loading state
        eventsGrid.classList.remove('loading');
        
        if (this.filteredEvents.length === 0) {
            eventsGrid.innerHTML = this.renderEmptyState();
            return;
        }
        
        // Sort events by date and featured status
        const sortedEvents = this.filteredEvents.sort((a, b) => {
            // Featured events first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Then by date
            return new Date(a.date) - new Date(b.date);
        });
        
        eventsGrid.innerHTML = sortedEvents.map(event => this.renderEventCard(event)).join('');
        
        // Add entrance animations
        this.animateEventCards();
    }
    
    renderEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const categoryColors = {
            'kultur': 'var(--color-primary)',
            'sport': 'var(--color-success)',
            'musik': 'var(--stuttgart-yellow)',
            'theater': '#9c27b0'
        };
        
        const categoryColor = categoryColors[event.category] || 'var(--color-primary)';
        
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image" style="background: linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd);">
                    ${this.getCategoryIcon(event.category)}
                    ${event.featured ? '<div class="featured-badge">Highlight</div>' : ''}
                </div>
                <div class="event-content">
                    <div class="event-category" style="background-color: ${categoryColor};">
                        ${this.getCategoryName(event.category)}
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div class="event-date">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${formattedDate}${event.time ? `, ${event.time}` : ''}
                        </div>
                        <div class="event-location">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${event.location}
                        </div>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-footer">
                        <span class="event-price">${event.price || 'Preis auf Anfrage'}</span>
                        <a href="#" class="event-link" data-event-id="${event.id}">
                            Mehr erfahren
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M7 17l9.2-9.2M17 17V7H7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            'kultur': '🎭',
            'sport': '⚽',
            'musik': '🎵',
            'theater': '🎪'
        };
        
        return `<span class="category-icon">${icons[category] || '📅'}</span>`;
    }
    
    getCategoryName(category) {
        const names = {
            'kultur': 'Kultur',
            'sport': 'Sport',
            'musik': 'Musik',
            'theater': 'Theater'
        };
        
        return names[category] || 'Event';
    }
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9" y2="9"></line>
                    <line x1="15" y1="9" x2="15" y2="9"></line>
                </svg>
                <h3>Keine Events gefunden</h3>
                <p>Mit den aktuellen Filtereinstellungen wurden keine Events gefunden. 
                   Versuchen Sie andere Filter oder entfernen Sie alle Filter.</p>
                <button class="btn btn-primary" onclick="eventsManager.clearFilters()">
                    Filter zurücksetzen
                </button>
            </div>
        `;
    }
    
    clearFilters() {
        // Reset filter inputs
        const dateFilter = document.getElementById('dateFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        
        if (dateFilter) dateFilter.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (locationFilter) locationFilter.value = '';
        
        // Reset internal filters
        this.currentFilters = {
            date: '',
            category: '',
            location: ''
        };
        
        // Reapply filters (which will show all events)
        this.applyFilters();
        
        // Show notification
        if (window.stuttgartApp) {
            window.stuttgartApp.showNotification('Filter wurden zurückgesetzt', 'info');
        }
    }
    
    animateEventCards() {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    showError(message) {
        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            eventsGrid.innerHTML = `
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
    
    // Public API
    getEventById(id) {
        return this.events.find(event => event.id === parseInt(id));
    }
    
    searchEvents(query) {
        const lowerQuery = query.toLowerCase();
        return this.events.filter(event => 
            event.title.toLowerCase().includes(lowerQuery) ||
            event.description.toLowerCase().includes(lowerQuery) ||
            event.location.toLowerCase().includes(lowerQuery) ||
            event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// CSS für Empty State und Error State
const eventsStyles = `
    .empty-state,
    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        text-align: center;
        color: var(--text-muted);
        grid-column: 1 / -1;
    }
    
    .empty-state svg,
    .error-state svg {
        margin-bottom: var(--spacing-lg);
        opacity: 0.5;
    }
    
    .empty-state h3,
    .error-state h3 {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
    }
    
    .featured-badge {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: var(--color-accent);
        color: var(--text-primary);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .category-icon {
        font-size: 2em;
        position: relative;
        z-index: 2;
    }
    
    .event-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--gray-200);
    }
    
    .event-price {
        font-weight: 600;
        color: var(--color-primary);
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = eventsStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventsManager = new EventsManager();
});