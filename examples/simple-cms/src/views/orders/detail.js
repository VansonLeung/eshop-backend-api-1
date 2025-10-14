// Order Detail View

import { api } from '../../api.js';
import { showLoading, showError, showSuccess } from '../../ui.js';
import { Order } from '../../models/order.js';

/**
 * Render order detail page
 * @param {string} id - Order ID
 */
export default async function renderOrderDetail(id) {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const orderData = await api.orders.get(id);
        const order = Order.fromAPI(orderData);

        content.innerHTML = `
            <h1>Order Details</h1>
            <div class="uk-card uk-card-default uk-card-body">
                <h3>Order #${order.id}</h3>
                <p><strong>User ID:</strong> ${order.userId}</p>
                <p><strong>Status:</strong> <span id="status-display">${order.getStatusDisplay()}</span></p>
                <p><strong>Total:</strong> $${order.total}</p>
                <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> ${new Date(order.updatedAt).toLocaleString()}</p>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label" for="status-select">Update Status:</label>
                <div class="uk-form-controls">
                    <select class="uk-select" id="status-select">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </div>
            </div>

            <button class="uk-button uk-button-primary" id="update-status-btn">Update Status</button>
            <button class="uk-button uk-button-default" id="back-btn">Back to Orders</button>
        `;

        // Bind update
        document.getElementById('update-status-btn').addEventListener('click', () => {
            updateOrderStatus(id);
        });

        // Bind back
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.hash = 'orders';
        });

    } catch (error) {
        showError('Failed to load order: ' + error.message);
    }
}

/**
 * Update order status
 * @param {string} id
 */
async function updateOrderStatus(id) {
    const newStatus = document.getElementById('status-select').value;

    try {
        showLoading();
        await api.orders.update(id, { status: newStatus });
        showSuccess('Order status updated successfully');
        // Update display
        document.getElementById('status-display').textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    } catch (error) {
        showError('Failed to update order status: ' + error.message);
    }
}