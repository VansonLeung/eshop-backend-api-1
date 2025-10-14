// Product List View

import { api } from '../../api.js';
import { showLoading, showError, renderTable } from '../../ui.js';
import { Product } from '../../models/product.js';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'sku', label: 'SKU' }
];

/**
 * Render product list page
 */
export default async function renderProductList() {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const response = await api.products.list();
        const products = response.data || response; // Handle both {data: [...]} and [...] formats
        const productObjects = products.map(p => Product.fromAPI(p));

        const tableHtml = renderTable(productObjects, columns);

        content.innerHTML = `
            <h1>Products</h1>
            <button class="uk-button uk-button-primary" id="create-product-btn">Create New Product</button>
            ${tableHtml}
        `;

        // Bind events
        document.getElementById('create-product-btn').addEventListener('click', () => {
            // Navigate to create form
            window.location.hash = 'products/create';
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.hash = `products/edit/${id}`;
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.hash = `products/delete/${id}`;
            });
        });

    } catch (error) {
        showError('Failed to load products: ' + error.message);
    }
}

/**
 * Delete a product
 * @param {string} id
 */
async function deleteProduct(id) {
    try {
        await api.products.delete(id);
        // Reload list
        renderProductList();
    } catch (error) {
        showError('Failed to delete product: ' + error.message);
    }
}