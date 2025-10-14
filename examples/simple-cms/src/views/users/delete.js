// User Delete Confirmation View

import { api } from '../../api.js';
import { showLoading, showError, showSuccess } from '../../ui.js';

/**
 * Render user delete confirmation
 * @param {string} id - User ID
 */
export default async function renderUserDelete(id) {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const userData = await api.users.get(id);

        content.innerHTML = `
            <h1>Delete User</h1>
            <div class="uk-alert uk-alert-warning">
                <p>Are you sure you want to delete the user "${userData.firstName} ${userData.lastName}" (${userData.email})?</p>
                <p>This action cannot be undone.</p>
            </div>
            <button class="uk-button uk-button-danger" id="confirm-delete-btn">Delete</button>
            <button class="uk-button uk-button-default" id="cancel-delete-btn">Cancel</button>
        `;

        // Bind confirm
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            deleteUser(id);
        });

        // Bind cancel
        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            window.location.hash = 'users';
        });

    } catch (error) {
        showError('Failed to load user: ' + error.message);
    }
}

/**
 * Delete the user
 * @param {string} id
 */
async function deleteUser(id) {
    try {
        showLoading();
        await api.users.delete(id);
        showSuccess('User deleted successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'users';
        }, 1000);
    } catch (error) {
        showError('Failed to delete user: ' + error.message);
    }
}