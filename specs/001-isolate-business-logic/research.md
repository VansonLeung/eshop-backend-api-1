# Research: Isolate Business Logic from Generic Backend Package

**Date**: 2025-10-12  
**Feature**: 001-isolate-business-logic

## Overview

This document consolidates research findings for extracting generic REST framework components from the e-commerce application into a reusable package.

## Research Questions & Findings

### 1. Testing Framework Selection

**Question**: Which testing framework should be used for the generic package - jest, mocha, or vitest?

**Decision**: **Vitest**

**Rationale**:
- Native ESM support (project uses `"type": "module"`)
- Fast execution with smart caching and watch mode
- Jest-compatible API (easy migration if needed)
- Better TypeScript support for future improvements
- Active development and modern architecture
- Excellent DX with inline test snapshots

**Alternatives Considered**:
- **Jest**: Industry standard but ESM support still experimental, slower for large projects
- **Mocha**: Mature but requires more configuration, less opinionated, no built-in assertions/mocking

**Implementation Notes**:
- Add `vitest` as dev dependency in package
- Create `vitest.config.js` for configuration
- Add test scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`

---

### 2. Package Structure & Exports

**Question**: How should the generic package structure its exports for optimal developer experience?

**Decision**: **Barrel exports with named exports at package root**

**Rationale**:
- Single import point: `import { GenericCRUD, ModelRegistry, AuthSystem } from 'sequelize-rest-framework'`
- Tree-shaking friendly (named exports)
- Clear API surface area
- Easy to document and discover

**Structure**:
```javascript
// packages/sequelize-rest-framework/src/index.js
export { GenericCRUD, GenericAssociations } from './api/index.js';
export { ModelRegistry } from './ModelRegistry.js';
export { AuthSystem } from './auth/AuthSystem.js';
export { RequestResponseMiddleware } from './middleware/RequestResponseMiddleware.js';
export { RouterWithMeta } from './middleware/RouterWithMeta.js';
export { SchemaHelper, SchemaToIndexes } from './models/SchemaHelper.js';
```

**Alternatives Considered**:
- Deep imports (`from 'sequelize-rest-framework/api/GenericCRUD'`) - more explicit but verbose
- Default exports - not tree-shakeable, less discoverable

---

### 3. Dependency Management

**Question**: How should dependencies be shared between package and application?

**Decision**: **Workspace configuration with shared peer dependencies**

**Rationale**:
- Package declares Sequelize, Express as peer dependencies
- Root workspace installs shared dependencies once
- Prevents version conflicts
- Application controls specific versions

**Package.json structure**:
```json
// packages/sequelize-rest-framework/package.json
{
  "name": "sequelize-rest-framework",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js"
  },
  "peerDependencies": {
    "sequelize": "^6.37.0",
    "express": "^5.0.0",
    "bcrypt": "^6.0.0"
  },
  "dependencies": {
    "crypto": "^1.0.1"
  }
}

// Root package.json
{
  "name": "eshop-backend-api-1",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "sequelize": "^6.37.5",
    "express": "^5.1.0",
    "bcrypt": "^6.0.0",
    "sequelize-rest-framework": "workspace:*"
  }
}
```

**Alternatives Considered**:
- Duplicate dependencies - wastes space, version conflicts
- Only dependencies (not peer) - forces specific versions on consumers

---

### 4. Import Path Migration Strategy

**Question**: How to migrate from `src/apis/_incl/` imports to package imports with minimal disruption?

**Decision**: **Phased migration with path aliases during transition**

**Rationale**:
- Use package.json `imports` field for gradual migration
- Update imports file-by-file
- Run tests continuously to catch issues
- No big-bang rewrite

**Migration Steps**:
1. Create package structure with all generic code
2. Add path alias in root package.json (temporary):
   ```json
   "imports": {
     "#sequelize-rest-framework": "./packages/sequelize-rest-framework/src/index.js"
   }
   ```
3. Update imports in business layer:
   ```javascript
   // Old
   import { _APIGenericCRUD } from "./_incl/index.js";
   
   // New
   import { GenericCRUD } from 'sequelize-rest-framework';
   ```
4. Test after each file migration
5. Remove path alias after complete migration

**Alternatives Considered**:
- All-at-once migration - risky, hard to debug
- Keep old structure as symlinks - confusing, tech debt

---

### 5. Authentication System Handling

**Question**: Should the auth system (UserModel, UserSession, etc.) be in the package or application layer?

**Decision**: **Generic auth in package, with extension points for business logic**

**Rationale**:
- Basic auth (User, Session, Role, Permission models) is generic
- Package provides base models and services
- Application extends User model with business fields (e.g., customerType, loyaltyPoints)
- Uses Sequelize's model inheritance/composition patterns

**Implementation Pattern**:
```javascript
// Package: packages/sequelize-rest-framework/src/auth/models/UserModel.js
export function createUserModel(sequelize, additionalFields = {}) {
  return sequelize.define('User', {
    // Base fields
    id: { type: DataTypes.UUID, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    // Merge additional fields
    ...additionalFields
  });
}

// Application: src/models/stores/EBUser.js
import { createUserModel } from 'sequelize-rest-framework';

export const EBUser = {
  makeSchema: () => ({
    // Business-specific fields
    customerType: DataTypes.STRING,
    loyaltyPoints: DataTypes.INTEGER,
    // Base fields added automatically
  }),
  makeModel: (sequelize) => {
    return createUserModel(sequelize, EBUser.makeSchema());
  }
};
```

**Alternatives Considered**:
- No auth in package - forces every project to rebuild auth (duplicates work)
- Fully opinionated auth - limits flexibility for business needs

---

### 6. Model Registry Pattern

**Question**: How should business models register with the generic CRUD system?

**Decision**: **Singleton registry with explicit registration**

**Rationale**:
- Clear, explicit registration in application's model initialization
- Package provides registry, application populates it
- Enables auto-generation of CRUD endpoints
- Testable in isolation

**Pattern**:
```javascript
// Package exports
export const modelRegistry = new ModelRegistry();

// Application: src/models/index.js
import { modelRegistry } from 'sequelize-rest-framework';

// After creating models
modelRegistry.register('Product', Product);
modelRegistry.register('Order', Order);
modelRegistry.register('Shop', Shop);

// Later in router
await modelRegistry.initializeAll({ app, appWithMeta });
```

**Alternatives Considered**:
- Auto-discovery via file system - magic, fragile, hard to debug
- Decorators - requires TypeScript, more complexity

---

### 7. Backward Compatibility Strategy

**Question**: How to ensure existing API endpoints continue working?

**Decision**: **Maintain identical endpoint structure and response format**

**Rationale**:
- GenericCRUD creates same routes: `/api/{Model}`, `/api/{Model}/:id`
- RequestResponseMiddleware maintains same response format
- Model registry preserves same model names
- Zero breaking changes to API contracts

**Validation Strategy**:
- Run existing API tests after migration
- Compare endpoint lists before/after (using express-list-routes)
- Test sample requests to verify response structure
- Document any changes in migration guide

**Testing Checklist**:
- [ ] GET /api/Product returns same structure
- [ ] POST /api/Order accepts same request body
- [ ] Query parameters (filter, sort, join) work identically
- [ ] Error responses maintain same format
- [ ] Auth headers handled correctly

---

### 8. Performance Considerations

**Question**: Will the refactoring impact performance?

**Decision**: **No significant performance impact expected**

**Rationale**:
- Code movement only, no algorithmic changes
- Same middleware chain execution
- Import resolution happens at startup, not per-request
- Modern Node.js handles ESM imports efficiently

**Monitoring Plan**:
- Benchmark key endpoints before/after
- Monitor startup time
- Watch for memory usage changes
- Use `perf_hooks` for critical paths

**Acceptable Thresholds** (from spec):
- API response times: within 10% of current (<110ms for simple CRUD)
- Startup time: within 10% of current
- Memory usage: within 10% of current

---

### 9. Documentation Requirements

**Question**: What documentation is needed for the package?

**Decision**: **Comprehensive README with examples in multiple domains**

**Required Sections**:
1. **Quick Start**: Minimal example in 5 minutes
2. **Installation**: npm/yarn/workspace setup
3. **Core Concepts**: ModelRegistry, GenericCRUD, AuthSystem
4. **API Reference**: All exported functions/classes
5. **Examples**: 
   - E-commerce (Product, Order)
   - Blog (Post, Comment)
   - Inventory (Item, Warehouse)
6. **Extension Guide**: How to customize/extend
7. **Migration Guide**: Upgrading from previous version

**Format**: Markdown with code samples, diagrams for architecture

**Alternatives Considered**:
- Full JSDoc API docs - overkill for initial version
- Wiki-only - hard to version control
- Video tutorials - time-consuming, hard to maintain

---

### 10. Testing Strategy

**Question**: How to test the package independently from the application?

**Decision**: **Layered testing approach**

**Test Levels**:

1. **Unit Tests** (Package internal)
   - Each utility function (query massagers, schema helpers)
   - Model registry operations
   - Middleware behavior
   - Auth service methods

2. **Integration Tests** (Package with real DB)
   - GenericCRUD with in-memory SQLite
   - Auth flow end-to-end
   - Model registration → endpoint creation

3. **Contract Tests** (Package API surface)
   - Verify exports are available
   - Check function signatures
   - Validate return types

4. **Application Tests** (Business layer)
   - Existing API tests continue to work
   - Business logic correctness
   - E-commerce workflows

**Test Database**:
- Use SQLite in-memory for package tests (fast, isolated)
- Use MySQL for application tests (matches production)

---

## Migration Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing APIs | High | Medium | Comprehensive API testing before/after |
| Import path errors | Medium | High | Gradual migration with tests per file |
| Dependency version conflicts | Medium | Low | Use workspace with peer dependencies |
| Performance degradation | Medium | Low | Benchmark critical endpoints |
| Lost business logic in extraction | High | Medium | Careful code review of what moves where |
| Auth system too rigid | Medium | Medium | Provide extension points and examples |

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Design data-model.md and contracts
3. → Create quickstart.md with example usage
4. → Update agent context with new technology decisions
