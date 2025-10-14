// Eshop CMS Main Application

import { initRouter } from './src/router.js';

console.log('Eshop CMS loaded');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing CMS...');

    // Initialize router
    initRouter();
});