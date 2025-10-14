// Order Update View (Status Update)

import { api } from '../../api.js';
import { showLoading, showError, showSuccess } from '../../ui.js';
import { Order } from '../../models/order.js';

/**
 * Render order update page
 * @param {string} id - Order ID
 */
export default async function renderOrderUpdate(id) {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const orderData = await api.orders.get(id);
        const order = Order.fromAPI(orderData);

        content.innerHTML = `
            <h1>Update Order Status</h1>
            <div class="uk-card uk-card-default uk-card-body">
                <h3>Order #${order.id}</h3>
                <p><strong>Current Status:</strong> ${order.getStatusDisplay()}</p>
                <p><strong>Total:</strong> $${order.total}</p>
            </div>

            <form class="uk-form-stacked">
                <div class="uk-margin">
                    <label class="uk-form-label" for="status">New Status:</label>
                    <div class="uk-form-controls">
                        <select class="uk-select" id="status" name="status" required>
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </div>
                </div>

                <div class="uk-margin">
                    <button type="submit" class="uk-button uk-button-primary">Update Status</button>
                    <button type="button" class="uk-button uk-button-default cancel-btn">Cancel</button>
                </div>
            </form>
        `;

        // Bind form submit
        const form = content.querySelector('form');
        form.addEventListener('submit', (e) => handleSubmit(e, id));

        // Bind cancel
        form.querySelector('.cancel-btn').addEventListener('click', () => {
            window.location.hash = 'orders';
        });

    } catch (error) {
        showError('Failed to load order: ' + error.message);
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

    try {
        showLoading();
        await api.orders.update(id, data);
        showSuccess('Order status updated successfully');
        // Redirect to list
        setTimeout(() => {
            window.location.hash = 'orders';
        }, 1000);
    } catch (error) {
        showError('Failed to update order: ' + error.message);
    }
}