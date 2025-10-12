# Feature Specification: Isolate Business Logic from Generic Backend Package

**Feature Branch**: `001-isolate-business-logic`  
**Created**: 2025-10-12  
**Status**: Draft  
**Input**: User description: "Isolate business logic models and APIs from generic backend package"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintain Generic Backend Package (Priority: P1)

As a **package maintainer**, I want the generic backend framework to be completely separated from business-specific code, so that I can enhance the framework without being affected by e-commerce domain logic.

**Why this priority**: This is the foundation that enables all other goals. Without a clear separation, maintaining and evolving the framework becomes increasingly difficult and error-prone.

**Independent Test**: Can be fully tested by verifying that the `packages/sequelize-rest-framework` directory contains only generic, reusable components with no e-commerce-specific references (no Shop, Order, Product entities or logic).

**Acceptance Scenarios**:

1. **Given** the generic backend package exists, **When** I examine all files in `packages/sequelize-rest-framework`, **Then** I should find zero references to business entities like Shop, Order, Product, User (beyond generic auth examples)
2. **Given** the generic package is isolated, **When** I want to add a new generic feature (like audit logging), **Then** I can add it without touching any e-commerce code
3. **Given** a new developer reviews the package, **When** they read the package documentation and code, **Then** they should understand it's a generic REST framework without e-commerce context

---

### User Story 2 - Develop E-Commerce Features Independently (Priority: P2)

As a **feature developer**, I want all e-commerce-specific models, APIs, and business logic in a dedicated application directory, so that I can build and test e-commerce features without modifying the underlying framework.

**Why this priority**: This enables rapid feature development and testing. Developers can focus on business logic without framework concerns.

**Independent Test**: Can be fully tested by creating a new e-commerce model (e.g., `Wishlist`) in the application directory, verifying it works with the generic package without any package modifications.

**Acceptance Scenarios**:

1. **Given** business models are isolated in the application layer, **When** I add a new model like `CustomerReview`, **Then** I only modify files in `src/models/stores/` and register it, without touching the package
2. **Given** business APIs are isolated, **When** I create a custom order processing endpoint, **Then** I add it in `src/apis/` using the generic CRUD utilities from the package
3. **Given** business DAOs are isolated, **When** I need custom authentication logic for customers, **Then** I implement it in `src/dao/` while using the package's auth services as a base
4. **Given** the application starts, **When** all business models are registered, **Then** they automatically get CRUD endpoints through the generic package

---

### User Story 3 - Package Reusability for Other Projects (Priority: P3)

As a **new project creator**, I want to use the generic backend package for a completely different domain (e.g., blog, inventory system), so that I benefit from the framework without carrying e-commerce baggage.

**Why this priority**: This validates the true separation and reusability of the generic package. If someone can build a blog platform with this package, the separation is successful.

**Independent Test**: Can be fully tested by creating a minimal blog application that uses the package with only Post and Author models, verifying no e-commerce dependencies are required.

**Acceptance Scenarios**:

1. **Given** I start a new blog project, **When** I install the generic backend package, **Then** I should only need to create my own Post and Author models without any Shop/Order/Product schemas
2. **Given** the package is domain-agnostic, **When** I review package dependencies, **Then** I should see only generic libraries (express, sequelize, bcrypt) with no e-commerce-specific packages
3. **Given** I want to build a content management system, **When** I use the package's model registry and CRUD generators, **Then** I can create Articles, Categories, and Tags without conflicts

---

### Edge Cases

- What happens when a developer accidentally imports e-commerce models into the package? (Should fail build/lint checks)
- How does the system handle when business code tries to extend generic package classes? (Should be supported via documented extension points)
- What if the generic package needs to reference a User model for auth, but User has business-specific fields? (Should use adapter pattern or minimal interfaces)
- How are database migrations managed when package and application schemas need to coexist? (Should have separate migration directories)
- What happens when the package version is updated and business code depends on deprecated APIs? (Should have clear versioning and deprecation warnings)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST separate all e-commerce domain models (Shop, Order, Product, ProductType, ProductVariant, ProductVariableField, ProductVariableFieldValue, OrderItem, Customer, etc.) into application layer (`src/models/stores/`)
- **FR-002**: System MUST move all e-commerce-specific API definitions (APIOrder, APIOrderItem, APIProduct, APIProductType, APIProductVariableField, APIProductVariableFieldValue, APIProductVariant, APIShop, APIUser, APIUserAuth) into application layer (`src/apis/`)
- **FR-003**: System MUST relocate business-specific data access objects and logic (UserAuthDao, UserACLDao, User dao) into application layer (`src/dao/`)
- **FR-004**: System MUST move database migrations for business models into application layer (`src/models/migrations/`)
- **FR-005**: Generic package MUST provide reusable components: ModelRegistry, GenericCRUD, AuthSystem, RequestResponseMiddleware, SchemaHelper utilities
- **FR-006**: Generic package MUST expose clean extension points for business layer to register models, customize routes, and add middleware
- **FR-007**: Application layer MUST be able to register business models with the generic package's model registry without modifying package code
- **FR-008**: Application layer MUST initialize and configure the generic package through a documented public API
- **FR-009**: System MUST maintain backward compatibility - existing API endpoints should continue working after the restructure
- **FR-010**: System MUST allow business layer to override or extend generic package behavior (e.g., custom auth logic) without modifying package files

### Key Entities

**Generic Package Components** (in `packages/sequelize-rest-framework/`):
- **ModelRegistry**: Central registry for auto-registering models with CRUD endpoints
- **GenericCRUD**: Provides automatic REST endpoints (GET, POST, PUT, DELETE) for registered models
- **AuthSystem**: Generic authentication and authorization framework (UserModel, UserRoleModel, session management)
- **RequestResponseMiddleware**: Request/response utilities for consistent API responses
- **SchemaHelper**: Utilities for converting Sequelize schemas to indexes and OpenAPI specs

**Business Layer Components** (in `src/`):
- **E-commerce Models**: All domain-specific Sequelize models (Product, Order, Shop, etc.)
- **E-commerce APIs**: Custom endpoints that use GenericCRUD as a base (APIOrder, APIProduct, etc.)
- **Business DAOs**: Data access objects with domain-specific logic (order processing, inventory management)
- **Migrations**: Database migration scripts for business schema evolution

**Integration Points**:
- Application entry point (`index.js`) initializes both package and business layer
- Model registration process connects business models to generic CRUD
- Router configuration mounts business APIs alongside auth routes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Generic package directory contains zero references to e-commerce entities (Shop, Order, Product) - verifiable through code search
- **SC-002**: A developer can create a new non-e-commerce application (e.g., blog) using the package in under 2 hours with only domain-specific model definitions
- **SC-003**: Adding a new e-commerce model (e.g., ProductReview) requires changes in only the application layer (`src/` directory), with zero package modifications
- **SC-004**: All existing API endpoints continue to function correctly after restructure - verified by 100% passing rate of existing API tests
- **SC-005**: Package documentation clearly explains how to integrate business models, with at least 3 working examples (e-commerce, blog, inventory)
- **SC-006**: Package can be published to npm and installed in a separate project without carrying e-commerce dependencies
- **SC-007**: Build/test times remain within 10% of current performance after restructuring
- **SC-008**: Code review confirms that generic package exports follow semantic versioning and have stable public APIs

## Assumptions

- The current authentication system in the package (UserModel, UserSession, etc.) is generic enough to be reused across domains, though business applications may extend the User model with domain-specific fields
- The existing `sequelize-rest-framework` package structure is already partially isolated but contains business logic that needs extraction
- The project will maintain a monorepo structure with `packages/` for the framework and `src/` for the application
- Database connection configuration will remain in the application layer, allowing different projects to use different databases
- The generic package should not dictate specific HTTP server frameworks, but can provide Express.js as the default/example implementation
- Migration tooling is sufficient to handle both package schema (if any) and application schema separately
- Breaking changes to the package API are acceptable during this refactoring, but a migration guide should be provided
- Performance characteristics should remain similar, as the change is primarily structural not algorithmic

## Out of Scope

The following are explicitly not part of this feature:

- Creating a plugin system or marketplace for the generic package
- Multi-tenancy support in the generic package
- GraphQL support (currently REST-only)
- Real-time features (WebSockets, Server-Sent Events)
- Deployment automation or containerization
- Performance optimization beyond maintaining current levels
- Internationalization (i18n) beyond the existing content localization in the business layer
- Creating additional example applications beyond documentation
- Publishing the package to npm registry (can be done later)
- Creating a CLI tool for bootstrapping new projects with the package

## Technical Constraints

- Must maintain compatibility with Node.js 16+ and current dependencies
- Must continue using Sequelize ORM (no ORM replacement)
- Must preserve existing database schema and data
- Must maintain current Express.js version and middleware stack
- Must support MySQL database (primary target), though package should be database-agnostic
- Generic package should have minimal dependencies to ensure reusability
- Should follow Node.js package best practices for exports and imports (ESM modules)
- Must maintain current test coverage levels (or improve them)

## Dependencies

- Completion requires understanding current codebase structure and import dependencies
- May require updating `package.json` for both root project and the package
- Documentation updates needed for both package README and project README
- May need to update build/test scripts to handle monorepo structure properly
- Requires coordination if multiple developers are actively working on features

## Non-Functional Requirements

- **Maintainability**: Code structure should make it obvious what is generic vs. business-specific
- **Testability**: Both package and business layer should be independently testable
- **Documentation**: Package must have comprehensive documentation with integration examples
- **Performance**: API response times should not degrade after restructuring
- **Developer Experience**: Clear error messages when business code incorrectly imports package internals
- **Backward Compatibility**: Existing API contracts must be preserved during transition
