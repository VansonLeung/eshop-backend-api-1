import { describe, it, expect, beforeEach } from 'vitest';
import { RouterWithMeta } from '../../src/middleware/RouterWithMeta.js';

describe('RouterWithMeta', () => {
    let mockRouter;
    let meta;
    let routerWithMeta;

    beforeEach(() => {
        mockRouter = {
            get: function() { return 'get result'; },
            post: function() { return 'post result'; },
            put: function() { return 'put result'; },
            delete: function() { return 'delete result'; },
            patch: function() { return 'patch result'; }
        };

        meta = {};
        routerWithMeta = new RouterWithMeta({ router: mockRouter, meta });
    });

    describe('constructor', () => {
        it('should initialize with router and meta', () => {
            expect(routerWithMeta.router).toBe(mockRouter);
            expect(routerWithMeta.meta).toBe(meta);
        });

        it('should create routerWithMeta object', () => {
            expect(routerWithMeta.routerWithMeta).toBeDefined();
            expect(typeof routerWithMeta.routerWithMeta).toBe('object');
        });
    });

    describe('initializeMethods', () => {
        it('should create HTTP method functions on routerWithMeta', () => {
            expect(typeof routerWithMeta.routerWithMeta.get).toBe('function');
            expect(typeof routerWithMeta.routerWithMeta.post).toBe('function');
            expect(typeof routerWithMeta.routerWithMeta.put).toBe('function');
            expect(typeof routerWithMeta.routerWithMeta.delete).toBe('function');
        });
    });

    describe('getRouter()', () => {
        it('should return the routerWithMeta object', () => {
            const result = routerWithMeta.getRouter();
            expect(result).toBe(routerWithMeta.routerWithMeta);
        });
    });

    describe('HTTP method wrapping', () => {
        it('should wrap GET method and store metadata', () => {
            const result = routerWithMeta.routerWithMeta.get('/test', { description: 'test route' });

            expect(result).toBe('get result');
            expect(meta['GET /test']).toEqual({ description: 'test route' });
        });

        it('should wrap POST method and store metadata', () => {
            const result = routerWithMeta.routerWithMeta.post('/create', { summary: 'create item' });

            expect(result).toBe('post result');
            expect(meta['POST /create']).toEqual({ summary: 'create item' });
        });

        it('should wrap PUT method and store metadata', () => {
            const result = routerWithMeta.routerWithMeta.put('/update/:id', { parameters: [{ name: 'id' }] });

            expect(result).toBe('put result');
            expect(meta['PUT /update/:id']).toEqual({ parameters: [{ name: 'id' }] });
        });

        it('should wrap DELETE method and store metadata', () => {
            const result = routerWithMeta.routerWithMeta.delete('/remove/:id', { deprecated: false });

            expect(result).toBe('delete result');
            expect(meta['DELETE /remove/:id']).toEqual({ deprecated: false });
        });

        it('should pass correct arguments to underlying router method', () => {
            let capturedArgs = [];
            mockRouter.get = function(...args) {
                capturedArgs = args;
                return 'captured';
            };

            const handler = () => {};
            const result = routerWithMeta.routerWithMeta.get('/test', { meta: 'data' }, handler, 'extra');

            expect(result).toBe('captured');
            expect(capturedArgs).toEqual(['/test', handler, 'extra']);
        });

        it('should handle methods without metadata', () => {
            const result = routerWithMeta.routerWithMeta.get('/simple');

            expect(result).toBe('get result');
            expect(meta['GET /simple']).toEqual({});
        });

        it('should merge metadata objects correctly', () => {
            const metadata = { description: 'test', parameters: [{ name: 'id' }] };
            routerWithMeta.routerWithMeta.post('/complex', metadata);

            expect(meta['POST /complex']).toEqual(metadata);
            expect(meta['POST /complex']).not.toBe(metadata); // Should be a copy
        });
    });

    describe('metadata storage', () => {
        it('should store metadata in the provided meta object', () => {
            const externalMeta = {};
            const router = new RouterWithMeta({ router: mockRouter, meta: externalMeta });

            router.routerWithMeta.get('/external', { external: true });

            expect(externalMeta['GET /external']).toEqual({ external: true });
        });

        it('should not modify original metadata object', () => {
            const originalMeta = { description: 'original' };
            routerWithMeta.routerWithMeta.put('/modify', originalMeta);

            expect(meta['PUT /modify']).toEqual(originalMeta);
            expect(meta['PUT /modify']).not.toBe(originalMeta);
        });
    });
});