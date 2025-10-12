import { describe, it, expect } from 'vitest';
import { RequestResponseMiddleware } from '../../src/middleware/RequestResponseMiddleware.js';

describe('RequestResponseMiddleware', () => {
    describe('apply()', () => {
        it('should return a middleware function', () => {
            const middleware = RequestResponseMiddleware.apply();
            expect(typeof middleware).toBe('function');
            expect(middleware.length).toBe(3); // Express middleware signature (req, res, next)
        });

        it('should add sendResponse method to res object', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            expect(typeof res.sendResponse).toBe('function');
        });

        it('should add sendError method to res object', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            expect(typeof res.sendError).toBe('function');
        });

        it('should call next() to continue middleware chain', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: () => ({ json: () => {} })
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            middleware(req, res, next);

            expect(nextCalled).toBe(true);
        });
    });

    describe('sendResponse()', () => {
        it('should send successful response with default status 200', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            res.sendResponse({ data: 'test data', message: 'success' });

            expect(res.statusCode).toBe(200);
            expect(res.responseData).toEqual({
                status: 200,
                success: true,
                data: 'test data',
                message: 'success'
            });
        });

        it('should send successful response with custom status', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            res.sendResponse({ status: 201, data: 'created', message: 'resource created' });

            expect(res.statusCode).toBe(201);
            expect(res.responseData).toEqual({
                status: 201,
                success: true,
                data: 'created',
                message: 'resource created'
            });
        });

        it('should handle missing data and message parameters', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            res.sendResponse({});

            expect(res.statusCode).toBe(200);
            expect(res.responseData).toEqual({
                status: 200,
                success: true,
                data: undefined,
                message: undefined
            });
        });
    });

    describe('sendError()', () => {
        it('should send error response with default status 500', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            const error = new Error('test error');
            res.sendError({ error });

            expect(res.statusCode).toBe(500);
            expect(res.responseData).toEqual({
                status: 500,
                success: false,
                message: 'test error',
                stack: error.stack
            });
        });

        it('should send error response with custom status and message', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            const error = new Error('original error');
            res.sendError({ status: 404, error, message: 'custom message' });

            expect(res.statusCode).toBe(404);
            expect(res.responseData).toEqual({
                status: 404,
                success: false,
                message: 'custom message',
                stack: error.stack
            });
        });

        it('should handle error without stack', () => {
            const middleware = RequestResponseMiddleware.apply();

            const req = {};
            const res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };
            const next = () => {};

            middleware(req, res, next);

            const error = { message: 'error without stack' };
            res.sendError({ error });

            expect(res.statusCode).toBe(500);
            expect(res.responseData).toEqual({
                status: 500,
                success: false,
                message: 'error without stack',
                stack: undefined
            });
        });
    });
});