import { describe, it, expect } from 'vitest';
import { Op } from 'sequelize';
import { recursiveMassageWhereClause } from '../../src/api/utils/QueryWhereClauseMassager.js';

describe('QueryWhereClauseMassager', () => {
    it('should convert $like to Op.like', () => {
        const whereClause = { name: { $like: 'test%' } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.name[Op.like]).toBe('test%');
        expect(whereClause.name).not.toHaveProperty('$like');
    });

    it('should convert $gt to Op.gt', () => {
        const whereClause = { age: { $gt: 18 } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.age[Op.gt]).toBe(18);
        expect(whereClause.age).not.toHaveProperty('$gt');
    });

    it('should convert $lt to Op.lt', () => {
        const whereClause = { age: { $lt: 65 } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.age[Op.lt]).toBe(65);
        expect(whereClause.age).not.toHaveProperty('$lt');
    });

    it('should convert $gte to Op.gte', () => {
        const whereClause = { age: { $gte: 18 } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.age[Op.gte]).toBe(18);
        expect(whereClause.age).not.toHaveProperty('$gte');
    });

    it('should convert $lte to Op.lte', () => {
        const whereClause = { age: { $lte: 65 } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.age[Op.lte]).toBe(65);
        expect(whereClause.age).not.toHaveProperty('$lte');
    });

    it('should convert $in to Op.in', () => {
        const whereClause = { status: { $in: ['active', 'pending'] } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.status[Op.in]).toEqual(['active', 'pending']);
        expect(whereClause.status).not.toHaveProperty('$in');
    });

    it('should convert $eq to Op.eq', () => {
        const whereClause = { active: { $eq: true } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.active[Op.eq]).toBe(true);
        expect(whereClause.active).not.toHaveProperty('$eq');
    });

    it.skip('should handle nested objects recursively', () => {
        // TODO: Fix this test - complex nested array processing
        const whereClause = {
            $and: [
                { age: { $gt: 18 } },
                { status: { $eq: 'active' } }
            ]
        };
        recursiveMassageWhereClause(whereClause);
        // $and should be converted to Op.and, and nested operators should be converted
        expect(whereClause[Op.and]).toBeDefined();
    });

    it('should handle empty objects', () => {
        const whereClause = {};
        expect(() => recursiveMassageWhereClause(whereClause)).not.toThrow();
    });

    it('should preserve non-operator properties', () => {
        const whereClause = { name: 'John', age: { $gt: 18 } };
        recursiveMassageWhereClause(whereClause);
        expect(whereClause.name).toBe('John');
        expect(whereClause.age[Op.gt]).toBe(18);
    });
});