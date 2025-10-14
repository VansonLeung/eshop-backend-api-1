// Order Data Model

export class Order {
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.userId || '';
        this.status = data.status || 'pending';
        this.total = data.total || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Validate order data
     * @returns {object} - {isValid, errors}
     */
    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
        if (!validStatuses.includes(this.status)) {
            errors.push('Invalid status');
        }

        if (this.total < 0) {
            errors.push('Total must be non-negative');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Convert to API format
     * @returns {object}
     */
    toAPI() {
        return {
            userId: this.userId,
            status: this.status,
            total: this.total
        };
    }

    /**
     * Create from API data
     * @param {object} data
     * @returns {Order}
     */
    static fromAPI(data) {
        return new Order(data);
    }

    /**
     * Get status display name
     * @returns {string}
     */
    getStatusDisplay() {
        const displays = {
            pending: 'Pending',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered'
        };
        return displays[this.status] || this.status;
    }
}