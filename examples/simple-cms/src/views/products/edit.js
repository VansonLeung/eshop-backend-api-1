// Product Edit View

import { api } from '../../api.js';
import { showLoading, showError, showSuccess, renderForm } from '../../ui.js';
import { Product } from '../../models/product.js';

const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'sku', label: 'SKU', type: 'text', required: true },
    { name: 'typeId', label: 'Type ID', type: 'text', required: false }
];

/**
 * Render product edit form
 * @param {string} id - Product ID from URL
 */
export default async function renderProductEdit(id) {
    console.log('renderProductEdit called with ID:', id);
    const content = document.getElementById('page-content');
    console.log('page-content element:', content);
    console.log('Editing product with ID:', id);

    try {
        showLoading();

        console.log('Calling api.products.get for ID:', id);
        const response = await api.products.get(id);
        console.log('Product response:', response);
        const productData = response.data || response; // Handle both {data: ...} and direct object formats
        console.log('Product data:', productData);
        const product = Product.fromAPI(productData);
        console.log('Product object properties:', Object.keys(product));
        console.log('Product name:', product.name);
        console.log('Product description:', product.description);

        const formHtml = renderForm(fields, product);
        console.log('Setting innerHTML with form');

        content.innerHTML = `
            <h1>Edit Product</h1>
            ${formHtml}
        `;
        console.log('innerHTML set, content.innerHTML length:', content.innerHTML.length);

        // Bind form submit
        const saveBtn = content.querySelector('#save-btn');
        saveBtn.addEventListener('click', (e) => handleSubmit(e, id));

        // Bind cancel
        content.querySelector('.cancel-btn').addEventListener('click', () => {
            window.location.hash = 'products';
        });

    } catch (error) {
        showError('Failed to load product: ' + error.message);
    }
}

/**
 * Handle form submission
 * @param {Event} e
 * @param {string} id
 */
async function handleSubmit(e, id) {
    // e.preventDefault(); // Not needed for button click

    const form = document.querySelector('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const product = new Product(data);
    const validation = product.validate();

    if (!validation.isValid) {
        showError('Validation errors: ' + validation.errors.join(', '));
        return;
    }

    try {
        showLoading();
        await api.products.update(id, product.toAPI());
        showSuccess('Product updated successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'products';
        }, 1000);
    } catch (error) {
        showError('Failed to update product: ' + error.message);
    }
}