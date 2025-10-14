// Product Create View

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
 * Render product create form
 */
export default function renderProductCreate() {
    const content = document.getElementById('page-content');

    const formHtml = renderForm(fields);

    content.innerHTML = `
        <h1>Create Product</h1>
        ${formHtml}
    `;

    // Bind form submit
    const saveBtn = content.querySelector('#save-btn');
    saveBtn.addEventListener('click', handleSubmit);

    // Bind cancel
    content.querySelector('.cancel-btn').addEventListener('click', () => {
        window.location.hash = 'products';
    });
}

/**
 * Handle form submission
 * @param {Event} e
 */
async function handleSubmit(e) {
    // e.preventDefault(); // Not needed for button click

    const form = document.querySelector('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const product = new Product(data);
    const validation = product.validate();

    if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        showError('Validation errors: ' + validation.errors.join(', '));
        return;
    }

    try {
        console.log('Creating product:', product);
        showLoading();
        const result = await api.products.create(product.toAPI());
        console.log('API response:', result);
        showSuccess('Product created successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'products';
        }, 1000);
    } catch (error) {
        console.error('Error creating product:', error);
        showError('Failed to create product: ' + error.message);
    }
}