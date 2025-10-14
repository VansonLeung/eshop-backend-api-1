// Order Model Tests

import { Order } from '../src/models/order.js';

describe('Order Model', () => {
    test('should create order with default values', () => {
        const order = new Order();
        expect(order.id).toBeNull();
        expect(order.status).toBe('pending');
        expect(order.total).toBe(0);
    });

    test('should create order from data', () => {
        const data = {
            id: '1',
            userId: 'user123',
            status: 'shipped',
            total: 99.99
        };
        const order = new Order(data);
        expect(order.id).toBe('1');
        expect(order.userId).toBe('user123');
        expect(order.status).toBe('shipped');
        expect(order.total).toBe(99.99);
    });

    test('should validate valid order', () => {
        const order = new Order({
            userId: 'user123',
            status: 'processing',
            total: 50.00
        });
        const validation = order.validate();
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toEqual([]);
    });

    test('should validate invalid order', () => {
        const order = new Order({
            userId: '',
            status: 'invalid',
            total: -10
        });
        const validation = order.validate();
        expect(validation.isValid).toBe(false);
        expect(validation.errors).toContain('User ID is required');
        expect(validation.errors).toContain('Invalid status');
        expect(validation.errors).toContain('Total must be non-negative');
    });

    test('should convert to API format', () => {
        const order = new Order({
            id: '1',
            userId: 'user123',
            status: 'delivered',
            total: 75.50
        });
        const apiData = order.toAPI();
        expect(apiData).toEqual({
            userId: 'user123',
            status: 'delivered',
            total: 75.50
        });
    });

    test('should create from API data', () => {
        const apiData = {
            id: '2',
            userId: 'user456',
            status: 'pending',
            total: 25.00
        };
        const order = Order.fromAPI(apiData);
        expect(order.id).toBe('2');
        expect(order.userId).toBe('user456');
        expect(order.status).toBe('pending');
    });

    test('should get status display name', () => {
        const order = new Order({ status: 'processing' });
        expect(order.getStatusDisplay()).toBe('Processing');

        order.status = 'shipped';
        expect(order.getStatusDisplay()).toBe('Shipped');

        order.status = 'unknown';
        expect(order.getStatusDisplay()).toBe('unknown');
    });
});