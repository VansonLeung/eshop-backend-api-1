import { describe, it, expect } from 'vitest';
import { Op } from 'sequelize';
import { recursiveMassageIncludeClause } from '../../src/api/utils/QueryIncludeClauseMassager.js';

describe('QueryIncludeClauseMassager', () => {
    it('should handle null/undefined include clause', () => {
        expect(() => recursiveMassageIncludeClause(null)).not.toThrow();
        expect(() => recursiveMassageIncludeClause(undefined)).not.toThrow();
    });

    it('should recursively process nested includes', () => {
        const includeClause = [
            {
                model: 'User',
                include: [
                    {
                        model: 'Profile',
                        where: { $like: 'test%' }
                    }
                ]
            }
        ];

        recursiveMassageIncludeClause(includeClause);

        // The where clause should be massaged (converted from $like to Op.like)
        expect(includeClause[0].include[0].where[Op.like]).toBe('test%');
        expect(includeClause[0].include[0].where).not.toHaveProperty('$like');
    });

    it('should handle empty include arrays', () => {
        const includeClause = [];
        expect(() => recursiveMassageIncludeClause(includeClause)).not.toThrow();
    });

    it('should handle include objects without where clauses', () => {
        const includeClause = [
            {
                model: 'User',
                include: [
                    { model: 'Profile' }
                ]
            }
        ];

        expect(() => recursiveMassageIncludeClause(includeClause)).not.toThrow();
    });
});