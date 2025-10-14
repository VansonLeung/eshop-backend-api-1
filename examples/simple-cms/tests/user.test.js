// User Model Tests

import { User } from '../src/models/user.js';

describe('User Model', () => {
    test('should create user with default values', () => {
        const user = new User();
        expect(user.id).toBeNull();
        expect(user.role).toBe('customer');
        expect(user.firstName).toBe('');
    });

    test('should create user from data', () => {
        const data = {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'admin'
        };
        const user = new User(data);
        expect(user.id).toBe('1');
        expect(user.email).toBe('test@example.com');
        expect(user.getFullName()).toBe('John Doe');
    });

    test('should validate valid user', () => {
        const user = new User({
            email: 'valid@email.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'manager'
        });
        const validation = user.validate();
        expect(validation.isValid).toBe(true);
    });

    test('should validate invalid user', () => {
        const user = new User({
            email: 'invalid',
            firstName: '',
            lastName: '',
            role: 'invalid'
        });
        const validation = user.validate();
        expect(validation.isValid).toBe(false);
        expect(validation.errors).toContain('Valid email is required');
        expect(validation.errors).toContain('First name is required');
        expect(validation.errors).toContain('Last name is required');
        expect(validation.errors).toContain('Invalid role');
    });

    test('should get full name', () => {
        const user = new User({ firstName: 'Alice', lastName: 'Wonder' });
        expect(user.getFullName()).toBe('Alice Wonder');

        user.firstName = '';
        expect(user.getFullName()).toBe('Wonder');
    });

    test('should convert to API format', () => {
        const user = new User({
            id: '1',
            email: 'api@example.com',
            firstName: 'API',
            lastName: 'User',
            role: 'customer'
        });
        const apiData = user.toAPI();
        expect(apiData).toEqual({
            email: 'api@example.com',
            firstName: 'API',
            lastName: 'User',
            role: 'customer'
        });
    });

    test('should create from API data', () => {
        const apiData = {
            id: '2',
            email: 'from@api.com',
            firstName: 'From',
            lastName: 'API'
        };
        const user = User.fromAPI(apiData);
        expect(user.id).toBe('2');
        expect(user.email).toBe('from@api.com');
    });
});