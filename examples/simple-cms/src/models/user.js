// User Data Model

export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.email = data.email || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.role = data.role || 'customer';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Get full name
     * @returns {string}
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    /**
     * Validate user data
     * @returns {object} - {isValid, errors}
     */
    validate() {
        const errors = [];

        if (!this.email || !this.email.includes('@')) {
            errors.push('Valid email is required');
        }

        // First name and last name are optional in current API
        // if (!this.firstName || this.firstName.trim().length === 0) {
        //     errors.push('First name is required');
        // }

        // if (!this.lastName || this.lastName.trim().length === 0) {
        //     errors.push('Last name is required');
        // }

        const validRoles = ['admin', 'manager', 'customer'];
        if (!validRoles.includes(this.role)) {
            errors.push('Invalid role');
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
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role
        };
    }

    /**
     * Create from API data
     * @param {object} data
     * @returns {User}
     */
    static fromAPI(data) {
        return new User({
            id: data.id,
            email: data.email,
            firstName: data.firstName || '', // May not be provided by API
            lastName: data.lastName || '',   // May not be provided by API
            role: data.role || 'customer',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }
}