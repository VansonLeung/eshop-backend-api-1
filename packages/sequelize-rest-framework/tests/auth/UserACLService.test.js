import { describe, it, expect } from 'vitest';
import { UserACLService } from '../../src/auth/services/UserACLService.js';

describe('UserACLService', () => {
    describe('deduceAccessGranted', () => {
        it('should grant access for admin user to create products', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'admin',
                apiName: 'Product',
                requiredPermission: 'create'
            });

            expect(result).toBe(true);
        });

        it('should deny access for user role to create products', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'user',
                apiName: 'Product',
                requiredPermission: 'create'
            });

            expect(result).toBe(false);
        });

        it('should grant access for user role to read products', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'user',
                apiName: 'Product',
                requiredPermission: 'read'
            });

            expect(result).toBe(true);
        });

        it('should grant access for guest to read products', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'guest',
                apiName: 'Product',
                requiredPermission: 'read'
            });

            expect(result).toBe(true);
        });

        it('should grant access when no ACL rules exist', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'user',
                apiName: 'UnknownAPI',
                requiredPermission: 'unknown'
            });

            expect(result).toBe(true);
        });

        it('should default to guest role when no role provided', () => {
            const result = UserACLService.deduceAccessGranted({
                apiName: 'Product',
                requiredPermission: 'read'
            });

            expect(result).toBe(true);
        });

        it('should deny access for user to logout from auth', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'user',
                apiName: 'auth',
                requiredPermission: 'logout'
            });

            expect(result).toBe(true);
        });

        it('should deny access for guest to logout from auth', () => {
            const result = UserACLService.deduceAccessGranted({
                roleCode: 'guest',
                apiName: 'auth',
                requiredPermission: 'logout'
            });

            expect(result).toBe(false);
        });
    });
});