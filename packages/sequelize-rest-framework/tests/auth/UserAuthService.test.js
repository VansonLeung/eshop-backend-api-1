import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserAuthService } from '../../src/auth/services/UserAuthService.js';
import { User, UserCredential, UserSession } from '../../src/auth/models/index.js';

// Mock crypto
let tokenCounter = 0;
vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(() => ({
            toString: vi.fn(() => `mock-token-${++tokenCounter}`)
        }))
    }
}));

describe('UserAuthService', () => {
    let sequelize;
    let models;

    beforeAll(async () => {
        sequelize = new Sequelize('sqlite::memory:', {
            logging: false
        });

        // Initialize models
        const UserModel = sequelize.define('User', User.makeSchema());
        const UserCredentialModel = sequelize.define('UserCredential', UserCredential.makeSchema());
        const UserSessionModel = sequelize.define('UserSession', UserSession.makeSchema());

        // Set up associations (only for models that exist)
        UserCredential.makeAssociations({ User: UserModel, UserCredential: UserCredentialModel });
        UserSession.makeAssociations({ User: UserModel, UserCredential: UserCredentialModel, UserSession: UserSessionModel });

        models = {
            User: UserModel,
            UserCredential: UserCredentialModel,
            UserSession: UserSessionModel,
        };

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await UserAuthService.registerUser({ models, user: userData });

            expect(result.user).toBeDefined();
            expect(result.user.username).toBe('testuser');
            expect(result.user.email).toBe('test@example.com');
            expect(result.session).toBeDefined();
            expect(result.session.accessToken).toBe('mock-token-1');
        });

        it('should throw error for duplicate username', async () => {
            const userData = {
                username: 'testuser',
                email: 'different@example.com',
                password: 'password123'
            };

            await expect(UserAuthService.registerUser({ models, user: userData }))
                .rejects.toThrow('User with this username or email already exists');
        });
    });

    describe('loginUser', () => {
        it('should login user with correct credentials', async () => {
            const result = await UserAuthService.loginUser({
                models,
                username: 'testuser',
                password: 'password123'
            });

            expect(result.user).toBeDefined();
            expect(result.user.username).toBe('testuser');
            expect(result.session).toBeDefined();
        });

        it('should throw error for invalid credentials', async () => {
            await expect(UserAuthService.loginUser({
                models,
                username: 'testuser',
                password: 'wrongpassword'
            })).rejects.toThrow('Invalid credentials');
        });

        it('should throw error for non-existent user', async () => {
            await expect(UserAuthService.loginUser({
                models,
                username: 'nonexistent',
                password: 'password123'
            })).rejects.toThrow('User not found');
        });
    });

    describe('logoutUser', () => {
        it('should logout user successfully', async () => {
            // First login to get a session
            const loginResult = await UserAuthService.loginUser({
                models,
                username: 'testuser',
                password: 'password123'
            });

            const result = await UserAuthService.logoutUser({
                models,
                sessionId: loginResult.session.id
            });

            expect(result.message).toBe('Logged out successfully');
        });

        it('should throw error for invalid session', async () => {
            await expect(UserAuthService.logoutUser({
                models,
                sessionId: 'invalid-session-id'
            })).rejects.toThrow('Session not found');
        });
    });
});