// Product Delete Confirmation View

import { api } from '../../api.js';
import { showLoading, showError, showSuccess } from '../../ui.js';

/**
 * Render product delete confirmation
 * @param {string} id - Product ID
 */
export default async function renderProductDelete(id) {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const productData = await api.products.get(id);

        content.innerHTML = `
            <h1>Delete Product</h1>
            <div class="uk-alert uk-alert-warning">
                <p>Are you sure you want to delete the product "${productData.name}"?</p>
                <p>This action cannot be undone.</p>
            </div>
            <button class="uk-button uk-button-danger" id="confirm-delete-btn">Delete</button>
            <button class="uk-button uk-button-default" id="cancel-delete-btn">Cancel</button>
        `;

        // Bind confirm
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            deleteProduct(id);
        });

        // Bind cancel
        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            window.location.hash = 'products';
        });

    } catch (error) {
        showError('Failed to load product: ' + error.message);
    }
}

/**
 * Delete the product
 * @param {string} id
 */
async function deleteProduct(id) {
    try {
        showLoading();
        await api.products.delete(id);
        showSuccess('Product deleted successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'products';
        }, 1000);
    } catch (error) {
        showError('Failed to delete product: ' + error.message);
    }
}