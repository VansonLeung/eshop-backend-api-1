// User Edit View

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
 * Render user edit form
 * @param {string} id - User ID from URL
 */
export default async function renderUserEdit(id) {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const userData = await api.users.get(id);
        const user = User.fromAPI(userData);

        const formHtml = renderForm(fields, user);

        content.innerHTML = `
            <h1>Edit User</h1>
            ${formHtml}
        `;

        // Bind form submit
        const form = content.querySelector('form');
        form.addEventListener('submit', (e) => handleSubmit(e, id));

        // Bind cancel
        form.querySelector('.cancel-btn').addEventListener('click', () => {
            window.location.hash = 'users';
        });

    } catch (error) {
        showError('Failed to load user: ' + error.message);
    }
}

/**
 * Handle form submission
 * @param {Event} e
 * @param {string} id
 */
async function handleSubmit(e, id) {
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
        await api.users.update(id, user.toAPI());
        showSuccess('User updated successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'users';
        }, 1000);
    } catch (error) {
        showError('Failed to update user: ' + error.message);
    }
}