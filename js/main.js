/**
 * Stuttgart Mobil - Haupt JavaScript Datei
 * Verwaltet die Navigation und grundlegende App-Funktionalität
 */

class StuttgartMobilApp {
    constructor() {
        this.currentSection = 'events';
        this.mobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupNavigation();
        this.loadInitialContent();
        
        // Smooth loading animation
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
    
    setupEventListeners() {
        // Navigation Links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });
        
        // Mobile Menu Toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (this.mobileMenuOpen && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileToggle) {
            // Initial state
            navMenu.style.maxHeight = '0';
            navMenu.style.overflow = 'hidden';
            navMenu.style.transition = 'max-height 0.3s ease-in-out';
        }
    }
    
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileToggle) {
            this.mobileMenuOpen = true;
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
            
            // Add aria attributes for accessibility
            mobileToggle.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');
        }
    }
    
    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileToggle) {
            this.mobileMenuOpen = false;
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            navMenu.style.maxHeight = '0';
            
            // Update aria attributes
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }
    
    setupNavigation() {
        // Set initial active states
        this.updateActiveNavigation('events');
    }
    
    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Add entrance animation
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                targetSection.style.transition = 'all 0.3s ease-out';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            });
            
            // Update navigation
            this.updateActiveNavigation(sectionId);
            this.currentSection = sectionId;
            
            // Update URL without page reload
            if (history.pushState) {
                history.pushState(null, null, `#${sectionId}`);
            }
            
            // Scroll to top of section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Analytics tracking (wenn implementiert)
            this.trackNavigation(sectionId);
        }
    }
    
    updateActiveNavigation(activeSection) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    loadInitialContent() {
        // Check URL hash on page load
        const hash = window.location.hash.substring(1);
        const validSections = ['events', 'news', 'services', 'dashboard'];
        
        if (hash && validSections.includes(hash)) {
            this.navigateToSection(hash);
        } else {
            // Default to events section
            this.navigateToSection('events');
        }
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1);
            if (hash && validSections.includes(hash)) {
                this.navigateToSection(hash);
            } else {
                this.navigateToSection('events');
            }
        });
    }
    
    trackNavigation(section) {
        // Placeholder für Analytics tracking
        console.log(`Navigation to section: ${section}`);
        
        // Hier könnte Google Analytics, Matomo etc. integriert werden
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'page_view', {
        //         page_title: `Stuttgart Mobil - ${section}`,
        //         page_location: window.location.href
        //     });
        // }
    }
    
    // Utility functions
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
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Schließen">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Handle close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }
    
    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Error handling
    handleError(error, context = '') {
        console.error(`Stuttgart Mobil Error ${context}:`, error);
        this.showNotification(
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
            'error'
        );
    }
}

// Notification Styles (wird dynamisch hinzugefügt)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 400px;
        border-left: 4px solid;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.hide {
        transform: translateX(100%);
    }
    
    .notification-info {
        border-left-color: var(--color-primary);
    }
    
    .notification-success {
        border-left-color: var(--color-success);
    }
    
    .notification-warning {
        border-left-color: var(--color-accent);
    }
    
    .notification-error {
        border-left-color: var(--color-error);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
    }
    
    .notification-message {
        flex: 1;
        margin-right: 12px;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 576px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
        
        .notification.hide {
            transform: translateY(-100%);
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stuttgartApp = new StuttgartMobilApp();
});

// Service Worker Registration für PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}