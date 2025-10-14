// Product Model Tests

import { Product } from '../src/models/product.js';

// Mock fetch for API tests if needed
global.fetch = jest.fn();

describe('Product Model', () => {
    test('should create product with default values', () => {
        const product = new Product();
        expect(product.id).toBeNull();
        expect(product.name).toBe('');
        expect(product.price).toBe(0);
    });

    test('should create product from data', () => {
        const data = {
            id: '1',
            name: 'Test Product',
            description: 'Test Description',
            price: 29.99,
            sku: 'TEST123'
        };
        const product = new Product(data);
        expect(product.id).toBe('1');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(29.99);
    });

    test('should validate valid product', () => {
        const product = new Product({
            name: 'Valid Product',
            price: 10.00,
            sku: 'VALID123'
        });
        const validation = product.validate();
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toEqual([]);
    });

    test('should validate invalid product', () => {
        const product = new Product({
            name: '',
            price: -5,
            sku: ''
        });
        const validation = product.validate();
        expect(validation.isValid).toBe(false);
        expect(validation.errors).toContain('Name is required');
        expect(validation.errors).toContain('Price must be positive');
        expect(validation.errors).toContain('SKU is required');
    });

    test('should validate name length', () => {
        const longName = 'a'.repeat(256);
        const product = new Product({
            name: longName,
            price: 10,
            sku: 'TEST'
        });
        const validation = product.validate();
        expect(validation.isValid).toBe(false);
        expect(validation.errors).toContain('Name must be less than 255 characters');
    });

    test('should convert to API format', () => {
        const product = new Product({
            id: '1',
            name: 'API Product',
            description: 'API Desc',
            price: 15.50,
            sku: 'API123',
            typeId: 'type1'
        });
        const apiData = product.toAPI();
        expect(apiData).toEqual({
            name: 'API Product',
            description: 'API Desc',
            price: 15.50,
            sku: 'API123',
            typeId: 'type1'
        });
        expect(apiData.id).toBeUndefined(); // ID not sent in create/update
    });

    test('should create from API data', () => {
        const apiData = {
            id: '2',
            name: 'From API',
            price: 20.00
        };
        const product = Product.fromAPI(apiData);
        expect(product.id).toBe('2');
        expect(product.name).toBe('From API');
        expect(product.price).toBe(20.00);
    });
});