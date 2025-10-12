import { describe, it, expect } from 'vitest';
import { SchemaToIndexes } from '../../src/models/SchemaHelper.js';

describe('SchemaHelper', () => {
    describe('SchemaToIndexes', () => {
        it('should return empty array for empty schema', () => {
            const result = SchemaToIndexes({});
            expect(result).toEqual([]);
        });

        it('should create single field index for attribute with index: true', () => {
            const schema = {
                name: { type: 'STRING', index: true }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toEqual([
                { fields: ['name'] }
            ]);
        });

        it('should create unique index for uniqueGroups', () => {
            const schema = {
                email: {
                    type: 'STRING',
                    uniqueGroups: [{ name: 'email_unique', order: 1 }]
                },
                domain: {
                    type: 'STRING',
                    uniqueGroups: [{ name: 'email_unique', order: 2 }]
                }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toContainEqual({
                unique: true,
                fields: ['email', 'domain']
            });
        });

        it('should create composite index for indexGroups', () => {
            const schema = {
                firstName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 1 }]
                },
                lastName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 2 }]
                }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toContainEqual({
                fields: ['firstName', 'lastName']
            });
        });

        it('should handle multiple index groups', () => {
            const schema = {
                firstName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 1 }]
                },
                lastName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 2 }]
                },
                email: {
                    type: 'STRING',
                    indexGroups: [{ name: 'contact_index', order: 1 }]
                },
                phone: {
                    type: 'STRING',
                    indexGroups: [{ name: 'contact_index', order: 2 }]
                }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toContainEqual({
                fields: ['firstName', 'lastName']
            });
            expect(result).toContainEqual({
                fields: ['email', 'phone']
            });
        });

        it('should handle both single indexes and groups', () => {
            const schema = {
                id: { type: 'INTEGER', index: true },
                firstName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 1 }]
                },
                lastName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 2 }]
                }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toContainEqual({
                fields: ['firstName', 'lastName']
            });
            expect(result).toContainEqual({
                fields: ['id']
            });
        });

        it('should order fields correctly in groups', () => {
            const schema = {
                lastName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 2 }]
                },
                firstName: {
                    type: 'STRING',
                    indexGroups: [{ name: 'name_index', order: 1 }]
                }
            };
            const result = SchemaToIndexes(schema);
            const nameIndex = result.find(index => index.fields.length === 2);
            expect(nameIndex.fields).toEqual(['firstName', 'lastName']);
        });

        it('should handle attributes without index properties', () => {
            const schema = {
                name: { type: 'STRING' },
                age: { type: 'INTEGER' }
            };
            const result = SchemaToIndexes(schema);
            expect(result).toEqual([]);
        });
    });
});