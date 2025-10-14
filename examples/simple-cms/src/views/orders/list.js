// Order List View

import { api } from '../../api.js';
import { showLoading, showError, renderTable } from '../../ui.js';
import { Order } from '../../models/order.js';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total' },
    { key: 'createdAt', label: 'Created At' }
];

/**
 * Render order list page
 */
export default async function renderOrderList() {
    const content = document.getElementById('page-content');

    try {
        showLoading();

        const response = await api.orders.list();
        const orders = response.data || response; // Handle both {data: [...]} and [...] formats
        const orderObjects = orders.map(o => Order.fromAPI(o));

        // Add status display
        orderObjects.forEach(order => {
            order.status = order.getStatusDisplay();
        });

        const tableHtml = renderTable(orderObjects, columns);

        content.innerHTML = `
            <h1>Orders</h1>
            ${tableHtml}
        `;

        // Bind view detail buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.hash = `orders/detail/${id}`;
            });
        });

        // For update, perhaps a status dropdown in table or separate
        // For simplicity, edit button goes to detail with update option

    } catch (error) {
        showError('Failed to load orders: ' + error.message);
    }
}