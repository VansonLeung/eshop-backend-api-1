// Simple Router Module

// Page components (to be imported later)
const pages = {
    products: () => import('./views/products/list.js'),
    'products/create': () => import('./views/products/create.js'),
    'products/edit': () => import('./views/products/edit.js'),
    'products/delete': () => import('./views/products/delete.js'),
    orders: () => import('./views/orders/list.js'),
    'orders/detail': () => import('./views/orders/detail.js'),
    'orders/update': () => import('./views/orders/update.js'),
    users: () => import('./views/users/list.js'),
    'users/create': () => import('./views/users/create.js'),
    'users/edit': () => import('./views/users/edit.js'),
    'users/delete': () => import('./views/users/delete.js')
};

/**
 * Navigate to a page
 * @param {string} page - Page name with optional params
 */
export function navigateTo(page) {
    // Find matching route (support parameterized routes)
    let matchedRoute = null;
    let params = [];

    // Check for exact match first
    if (pages[page]) {
        matchedRoute = page;
    } else {
        // Check for parameterized routes
        const pageParts = page.split('/');
        for (let i = pageParts.length; i > 0; i--) {
            const routeCandidate = pageParts.slice(0, i).join('/');
            if (pages[routeCandidate]) {
                matchedRoute = routeCandidate;
                params = pageParts.slice(i);
                break;
            }
        }
    }

    if (matchedRoute) {
        // Update URL hash
        window.location.hash = page;

        // Load and render page
        const pageLoader = pages[matchedRoute];
        pageLoader().then(module => {
            if (module.default) {
                // Pass params if available
                if (params.length > 0) {
                    module.default(...params);
                } else {
                    module.default();
                }
            }
        }).catch(error => {
            console.error('Failed to load page:', page, error);
            showError('Failed to load page');
        });
    } else {
        showError('Page not found');
    }
}

/**
 * Initialize router
 */
export function initRouter() {
    // Handle initial load
    const hash = window.location.hash.substring(1);
    const page = hash.split('?')[0]; // Remove query parameters
    const initialPage = page || 'products';
    navigateTo(initialPage);

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        const page = hash.split('?')[0]; // Remove query parameters
        navigateTo(page);
    });

    // Handle navigation clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('#sidebar a')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateTo(page);
        }
    });
}

/**
 * Show error message
 * @param {string} message
 */
function showError(message) {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="uk-alert uk-alert-danger">${message}</div>`;
}