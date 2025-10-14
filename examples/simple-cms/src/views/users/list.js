// User List View

import { api } from '../../api.js';
import { showLoading, showError, renderTable } from '../../ui.js';
import { User } from '../../models/user.js';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'role', label: 'Role' }
];

/**
 * Render user list page
 */
export default async function renderUserList() {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const response = await api.users.list();
        const users = response.data || response; // Handle both {data: [...]} and [...] formats
        const userObjects = users.map(u => User.fromAPI(u));

        const tableHtml = renderTable(userObjects, columns);

        content.innerHTML = `
            <h1>Users</h1>
            <button class="uk-button uk-button-primary" id="create-user-btn">Create New User</button>
            ${tableHtml}
        `;

        // Bind events
        document.getElementById('create-user-btn').addEventListener('click', () => {
            window.location.hash = 'users/create';
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.hash = `users/edit/${id}`;
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.hash = `users/delete/${id}`;
            });
        });

    } catch (error) {
        showError('Failed to load users: ' + error.message);
    }
}