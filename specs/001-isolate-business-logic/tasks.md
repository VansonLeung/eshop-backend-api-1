# Tasks: Isolate Business Logic from Generic Backend Package

**Input**: Implementation plan from `/specs/001-isolate-business-logic/plan.md`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/package-api.md, quickstart.md

**Tests**: Unit tests with Vitest for package components, integration tests for application layer

**Organization**: Tasks are grouped by PR phase to enable incremental implementation and testing of each migration step.

## Format: `[ID] [P?] [Phase] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Which PR phase this task belongs to (e.g., PR1, PR2, PR3)
- Include exact file paths in descriptions

## Path Conventions
- **Package**: `packages/sequelize-rest-framework/src/` for generic components
- **Application**: `src/` for business logic (e-commerce models, APIs, DAOs)
- **Tests**: `packages/sequelize-rest-framework/tests/` for package tests

---

## Phase 1: PR1 - Setup Package Structure

**Purpose**: Initialize the monorepo structure with package scaffolding

- [X] T001 Create `packages/sequelize-rest-framework/` directory structure
- [X] T002 Create package.json for sequelize-rest-framework with peer dependencies (Express 5.1.0, Sequelize 6.37.5, bcrypt 6.0.0, MySQL2 3.12.0)
- [X] T003 Update root package.json with workspace configuration
- [X] T004 Create vitest.config.js for package testing
- [X] T005 Create basic directory structure: src/, tests/, examples/
- [X] T006 Add .gitignore patterns for Node.js and monorepo
- [X] T007 **Validation**: `npm install` succeeds in workspace, package recognized

---

## Phase 2: PR2 - Extract Core Utilities

**Purpose**: Move generic utility functions to package with tests

- [X] T008 Move `src/apis/_incl/_APIQueryIncludeClauseMassager.js` to `packages/sequelize-rest-framework/src/api/utils/QueryIncludeClauseMassager.js`
- [X] T009 Move `src/apis/_incl/_APIQueryWhereClauseMassager.js` to `packages/sequelize-rest-framework/src/api/utils/QueryWhereClauseMassager.js`
- [X] T010 Move `src/models/_helpers/SequelizeSchemaHelper.js` to `packages/sequelize-rest-framework/src/models/SchemaHelper.js`
- [X] T011 [P] Create unit tests for QueryIncludeClauseMassager in `packages/sequelize-rest-framework/tests/utils/QueryIncludeClauseMassager.test.js`
- [X] T012 [P] Create unit tests for QueryWhereClauseMassager in `packages/sequelize-rest-framework/tests/utils/QueryWhereClauseMassager.test.js`
- [X] T013 [P] Create unit tests for SchemaHelper in `packages/sequelize-rest-framework/tests/models/SchemaHelper.test.js`
- [X] T014 Update utility imports to use new package paths
- [X] T015 **Validation**: All utility tests pass with `npm test` in package directory

---

## Phase 3: PR3 - Extract ModelRegistry

**Purpose**: Move model registration system to package

- [X] T016 Extract ModelRegistry pattern from existing code to `packages/sequelize-rest-framework/src/ModelRegistry.js`
- [X] T017 Create unit tests for ModelRegistry registration and initialization in `packages/sequelize-rest-framework/tests/ModelRegistry.test.js`
- [X] T018 Add mock model support for testing registry functionality
- [X] T019 **Validation**: Registry can register and retrieve mock models without errors

---

## Phase 4: PR4 - Extract GenericCRUD

**Purpose**: Move generic CRUD operations and associations to package

- [ ] T020 Move `src/apis/_incl/_APIGenericCRUD.js` to `packages/sequelize-rest-framework/src/api/GenericCRUD.js`
- [ ] T021 Move `src/apis/_incl/_APIGenericAssociations.js` to `packages/sequelize-rest-framework/src/api/GenericAssociations.js`
- [ ] T022 Create integration tests with SQLite for CRUD endpoints in `packages/sequelize-rest-framework/tests/integration/GenericCRUD.test.js`
- [ ] T023 Add test models for CRUD validation (User, Post, Category)
- [ ] T024 **Validation**: CRUD endpoints created and functional for test models

---

## Phase 5: PR5 - Extract Middleware

**Purpose**: Move middleware utilities to package

- [ ] T025 Move `src/apis/_incl/_APIGenericUseRequestResponse.js` to `packages/sequelize-rest-framework/src/middleware/RequestResponseMiddleware.js`
- [ ] T026 Move `src/apis/_incl/_routerWithMeta.js` to `packages/sequelize-rest-framework/src/middleware/RouterWithMeta.js`
- [ ] T027 Create unit tests for RequestResponseMiddleware in `packages/sequelize-rest-framework/tests/middleware/RequestResponseMiddleware.test.js`
- [ ] T028 Create unit tests for RouterWithMeta in `packages/sequelize-rest-framework/tests/middleware/RouterWithMeta.test.js`
- [ ] T029 **Validation**: Middleware works correctly with test routes

---

## Phase 6: PR6 - Extract AuthSystem

**Purpose**: Move authentication system to package with extension points

- [ ] T030 Extract auth models from existing code to `packages/sequelize-rest-framework/src/auth/models/`
- [ ] T031 Extract auth services to `packages/sequelize-rest-framework/src/auth/services/`
- [ ] T032 Extract auth middleware to `packages/sequelize-rest-framework/src/auth/middleware/`
- [ ] T033 Extract auth routes to `packages/sequelize-rest-framework/src/auth/routes/`
- [ ] T034 Create integration tests for complete auth flow in `packages/sequelize-rest-framework/tests/integration/AuthSystem.test.js`
- [ ] T035 Document extension points for business layer customization
- [ ] T036 **Validation**: Complete authentication flow works in isolation

---

## Phase 7: PR7 - Setup Package Exports

**Purpose**: Create clean public API with barrel exports

- [ ] T037 Create main `packages/sequelize-rest-framework/src/index.js` with barrel exports
- [ ] T038 Update package.json with proper exports field for ESM
- [ ] T039 Add TypeScript type definitions (optional) in `packages/sequelize-rest-framework/types/`
- [ ] T040 Create package README.md with usage examples
- [ ] T041 **Validation**: All exports importable via `import { ... } from 'sequelize-rest-framework'`

---

## Phase 8: PR8 - Update Application Imports (Phase 1)

**Purpose**: Gradually migrate application to use package imports

- [ ] T042 Update import statements in business APIs (`src/apis/API*.js`) to use package
- [ ] T043 Update import statements in `src/apis/router.js` to use package
- [ ] T044 Update import statements in `src/apis/index.js` to use package
- [ ] T045 Keep old `_incl` folder temporarily for rollback capability
- [ ] T046 **Validation**: Application still runs, existing API tests pass

---

## Phase 9: PR9 - Update Application Imports (Phase 2)

**Purpose**: Complete migration and remove old code

- [ ] T047 Remove old `src/apis/_incl/` folder completely
- [ ] T048 Clean up any remaining references to old utility paths
- [ ] T049 Update any missed import statements
- [ ] T050 **Validation**: No references to old `_incl` paths in codebase

---

## Phase 10: PR10 - Documentation & Polish

**Purpose**: Create comprehensive documentation and examples

- [ ] T051 Write detailed package README.md with installation and usage
- [ ] T052 Create examples directory with blog application example
- [ ] T053 Create migration guide for existing applications
- [ ] T054 Update main project README.md with package information
- [ ] T055 Add JSDoc comments to all public package APIs
- [ ] T056 **Validation**: New developer can understand and use package from documentation

---

## Phase 11: PR11 - Performance Validation

**Purpose**: Ensure migration doesn't impact performance

- [ ] T057 Benchmark API endpoints before/after migration
- [ ] T058 Compare application startup time
- [ ] T059 Run full test suite to ensure no regressions
- [ ] T060 Verify memory usage and response times
- [ ] T061 **Validation**: Performance within 10% of baseline, all tests pass

---

## Success Metrics Validation

**Purpose**: Verify implementation meets all success criteria from spec.md

- [ ] T062 **SC-001**: Code search confirms zero e-commerce references in package
- [ ] T063 **SC-002**: Quickstart test validates new app creation under 2 hours
- [ ] T064 **SC-003**: Blog example validates new model requires zero package changes
- [ ] T065 **SC-004**: Existing API tests 100% passing
- [ ] T066 **SC-005**: Multi-domain examples (blog, inventory, tasks) functional
- [ ] T067 **SC-006**: Package structure validates npm publishability
- [ ] T068 **SC-007**: Performance validation within 10% threshold
- [ ] T069 **SC-008**: Public API stable with proper semver exports