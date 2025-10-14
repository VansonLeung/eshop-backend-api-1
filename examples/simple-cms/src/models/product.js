// Product Data Model

export class Product {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.price = data.price || 0;
        this.sku = data.sku || '';
        this.typeId = data.typeId || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Validate product data
     * @returns {object} - {isValid, errors}
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Name is required');
        }
        if (this.name.length > 255) {
            errors.push('Name must be less than 255 characters');
        }

        if (this.price < 0) {
            errors.push('Price must be positive');
        }

        if (!this.sku || this.sku.trim().length === 0) {
            errors.push('SKU is required');
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
            name: this.name,
            description: this.description,
            price: this.price,
            sku: this.sku,
            typeId: this.typeId
        };
    }

    /**
     * Create from API data
     * @param {object} data
     * @returns {Product}
     */
    static fromAPI(data) {
        return new Product(data);
    }
}