# Implementation Plan: Isolate Business Logic from Generic Backend Package

**Branch**: `001-isolate-business-logic` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-isolate-business-logic/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Separate generic REST framework components from e-commerce business logic to create a reusable `sequelize-rest-framework` package.

**Technical Approach**: 
1. Extract generic components (GenericCRUD, ModelRegistry, AuthSystem, middleware utilities) from `src/apis/_incl/` into a new `packages/sequelize-rest-framework/` structure
2. Keep e-commerce models (Shop, Order, Product, etc.) in `src/models/stores/`
3. Keep e-commerce APIs (APIOrder, APIProduct, etc.) in `src/apis/` as business layer
4. Move custom DAOs to application layer `src/dao/`
5. Establish clear import boundaries and extension points
6. Maintain backward compatibility through model registry pattern

## Technical Context

**Language/Version**: Node.js 18+ (ESM modules)
**Primary Dependencies**: Express 5.1.0, Sequelize 6.37.5, bcrypt 6.0.0, MySQL2 3.12.0
**Storage**: MySQL (primary), with database-agnostic Sequelize layer
**Testing**: Manual API tests in `api-tests/` directory, needs unit test framework (NEEDS CLARIFICATION: jest, mocha, or vitest?)
**Target Platform**: Node.js server (Linux/macOS)
**Project Type**: Monorepo (package + web application)
**Performance Goals**: Maintain current API response times (<100ms for simple CRUD), support 1000+ req/s
**Constraints**: Must preserve existing API contracts, zero downtime migration, ESM module compatibility
**Scale/Scope**: ~40 models, ~10 custom APIs, 8 generic utilities to extract

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Constitution file is template-only, no project-specific principles defined yet.

**Status**: ✅ PASS (No constitution violations - this is a refactoring for better separation of concerns)

**Justification**: 
- This refactoring aligns with standard architectural principles (separation of concerns, DRY, reusability)
- No new complexity introduced - extracting existing generic code into a package
- Improves testability by creating clear boundaries
- No constitution-specific gates to evaluate

## Project Structure

### Documentation (this feature)

```
specs/001-isolate-business-logic/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```
# Current Structure (before refactoring)
src/
├── apis/
│   ├── _incl/                    # Generic utilities (TO BE MOVED)
│   │   ├── _APIGenericCRUD.js
│   │   ├── _APIGenericAssociations.js
│   │   ├── _APIGenericMiddlewaresACL.js
│   │   ├── _APIGenericUseRequestResponse.js
│   │   ├── _APIQueryIncludeClauseMassager.js
│   │   ├── _APIQueryWhereClauseMassager.js
│   │   └── _routerWithMeta.js
│   ├── APIOrder.js               # Business APIs (STAY HERE)
│   ├── APIProduct.js
│   ├── APIShop.js
│   ├── APIUser.js
│   ├── APIUserAuth.js
│   └── ...
├── dao/
│   └── user/                     # Business DAOs (STAY HERE)
│       ├── User.js
│       ├── UserAuthDao.js
│       └── UserACLDao.js
└── models/
    ├── stores/                   # Business models (STAY HERE)
    │   ├── EBProduct.js
    │   ├── EBOrder.js
    │   ├── EBShop.js
    │   └── ...
    ├── migrations/               # Business migrations (STAY HERE)
    └── index.js

# Target Structure (after refactoring)
packages/
└── sequelize-rest-framework/     # NEW: Generic package
    ├── package.json
    ├── README.md
    ├── src/
    │   ├── index.js              # Package exports
    │   ├── ModelRegistry.js      # Moved from patterns
    │   ├── api/
    │   │   ├── GenericCRUD.js    # Moved from _APIGenericCRUD
    │   │   ├── GenericAssociations.js
    │   │   └── utils/
    │   │       ├── QueryIncludeClauseMassager.js
    │   │       └── QueryWhereClauseMassager.js
    │   ├── middleware/
    │   │   ├── RequestResponseMiddleware.js
    │   │   └── RouterWithMeta.js
    │   ├── auth/                 # Auth system (if generic enough)
    │   │   ├── AuthSystem.js
    │   │   ├── models/
    │   │   ├── services/
    │   │   ├── middleware/
    │   │   └── routes/
    │   └── models/
    │       └── SchemaHelper.js
    └── examples/
        └── quickstart.js

src/                              # Application layer (business logic)
├── apis/
│   ├── APIOrder.js               # Business-specific APIs
│   ├── APIProduct.js
│   ├── APIShop.js
│   ├── APIUser.js
│   ├── APIUserAuth.js
│   ├── index.js
│   └── router.js
├── dao/
│   └── user/                     # Business-specific DAOs
│       ├── User.js
│       ├── UserAuthDao.js
│       └── UserACLDao.js
└── models/
    ├── stores/                   # E-commerce domain models
    │   ├── EBProduct.js
    │   ├── EBOrder.js
    │   ├── EBShop.js
    │   └── ...
    ├── migrations/               # Business schema migrations
    │   └── index.js
    └── index.js                  # Model initialization + registry

index.js                          # App entry point (uses package)
package.json                      # Root package with workspace config
```

**Structure Decision**: Selected monorepo with `packages/` for the generic framework and `src/` for business application. This enables:
- Independent versioning and publishing of the framework package
- Clear import boundaries (business code imports from package, not vice versa)
- Easy testing of package in isolation
- Ability to use the package in other projects via npm link or publication

## Complexity Tracking

*No complexity violations - this is a standard refactoring to improve code organization.*

---

## Phase Completion Status

### Phase 0: Research ✅ COMPLETE

**Artifact**: [research.md](./research.md)

**Key Decisions**:
- ✅ Testing framework: Vitest (ESM-native, fast, Jest-compatible)
- ✅ Package exports: Barrel exports with named exports
- ✅ Dependencies: Workspace with peer dependencies
- ✅ Migration strategy: Phased with path aliases
- ✅ Auth handling: Generic in package with extension points
- ✅ Model registry: Singleton with explicit registration
- ✅ Backward compatibility: Maintain identical endpoint structure
- ✅ Performance: No significant impact expected
- ✅ Documentation: Comprehensive README with multi-domain examples
- ✅ Testing strategy: Layered (unit, integration, contract, application)

**Unknowns Resolved**: All NEEDS CLARIFICATION items resolved

---

### Phase 1: Design ✅ COMPLETE

**Artifacts**:
- ✅ [data-model.md](./data-model.md) - Package vs. application entity organization
- ✅ [contracts/package-api.md](./contracts/package-api.md) - Public API contracts and REST endpoints
- ✅ [quickstart.md](./quickstart.md) - Quick start guide with blog example
- ✅ Agent context updated: `.github/copilot-instructions.md`

**Design Highlights**:
- Clear separation between package components (ModelRegistry, GenericCRUD, AuthSystem) and business models
- REST endpoint contracts documented for auto-generated CRUD
- Authentication endpoint contracts defined
- Extension points identified for business layer customization
- Three working examples documented (blog, inventory, task management)

---

## Next Steps

**Command**: `/speckit.tasks`

This will generate `tasks.md` with:
1. Detailed PR breakdown for implementation
2. Step-by-step migration tasks
3. Testing checkpoints
4. Rollback procedures

**Ready to proceed**: ✅ All research complete, design artifacts generated, no blockers

---

## Implementation Preview

Based on the design, implementation will follow this sequence:

### PR 1: Setup Package Structure
- Create `packages/sequelize-rest-framework/` directory
- Add package.json with peer dependencies
- Setup workspace configuration in root package.json
- Add vitest configuration
- **Validation**: Package structure exists, workspace recognized

### PR 2: Extract Core Utilities
- Move query massagers to package
- Move SchemaHelper to package
- Add unit tests for utilities
- **Validation**: Utilities testable in isolation

### PR 3: Extract ModelRegistry
- Move ModelRegistry to package
- Add tests for registration and initialization
- **Validation**: Registry can register mock models

### PR 4: Extract GenericCRUD
- Move GenericCRUD to package
- Move GenericAssociations to package
- Add integration tests with SQLite
- **Validation**: CRUD endpoints created for test models

### PR 5: Extract Middleware
- Move RequestResponseMiddleware to package
- Move RouterWithMeta to package
- Add tests for middleware behavior
- **Validation**: Middleware works with test routes

### PR 6: Extract AuthSystem
- Move auth models, services, middleware, routes to package
- Add auth integration tests
- Document extension points
- **Validation**: Complete auth flow works in isolation

### PR 7: Setup Package Exports
- Create main index.js with barrel exports
- Add TypeScript type definitions (optional)
- Update package.json exports field
- **Validation**: All exports importable

### PR 8: Update Application Imports (Phase 1)
- Update import statements in business APIs
- Update import statements in router
- Keep old _incl folder temporarily
- **Validation**: Application still runs, tests pass

### PR 9: Update Application Imports (Phase 2)
- Remove old _incl folder
- Clean up any remaining old imports
- **Validation**: No references to old paths

### PR 10: Documentation & Polish
- Write package README
- Add examples directory
- Create migration guide
- Update main project README
- **Validation**: New developer can use package

### PR 11: Performance Validation
- Benchmark API endpoints before/after
- Compare startup time
- Verify test suite passes
- **Validation**: Performance within 10% threshold

---

## Success Metrics

From spec.md, implementation will be validated against:

1. ✅ **SC-001**: Zero e-commerce references in package (code search)
2. ✅ **SC-002**: New app creation time under 2 hours (quickstart test)
3. ✅ **SC-003**: New model requires zero package changes (blog example validates)
4. ⏳ **SC-004**: Existing API tests 100% passing (validate in PR 11)
5. ✅ **SC-005**: Multi-domain examples (blog, inventory, tasks in quickstart)
6. ⏳ **SC-006**: Package publishable to npm (validate structure exists)
7. ⏳ **SC-007**: Performance within 10% (validate in PR 11)
8. ⏳ **SC-008**: Stable public API with semver (validate exports in PR 7)
