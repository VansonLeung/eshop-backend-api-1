// User Create View

import { api } from '../../api.js';
import { showLoading, showError, showSuccess, renderForm } from '../../ui.js';
import { User } from '../../models/user.js';

const fields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'role', label: 'Role', type: 'select', options: ['admin', 'manager', 'customer'], required: true }
];

/**
 * Render user create form
 */
export default function renderUserCreate() {
    const content = document.getElementById('page-content');

    const formHtml = renderForm(fields);

    content.innerHTML = `
        <h1>Create User</h1>
        ${formHtml}
    `;

    // Bind form submit
    const form = content.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    // Bind cancel
    form.querySelector('.cancel-btn').addEventListener('click', () => {
        window.location.hash = 'users';
    });
}

/**
 * Handle form submission
 * @param {Event} e
 */
async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const user = new User(data);
    const validation = user.validate();

    if (!validation.isValid) {
        showError('Validation errors: ' + validation.errors.join(', '));
        return;
    }

    try {
        showLoading();
        await api.users.create(user.toAPI());
        showSuccess('User created successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'users';
        }, 1000);
    } catch (error) {
        showError('Failed to create user: ' + error.message);
    }
}