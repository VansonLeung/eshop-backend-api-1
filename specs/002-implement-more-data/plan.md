# Implementation Plan: Implement More Data Models for CMS

**Feature**: `002-implement-more-data`
**Status**: Planning - Comprehensive Scope Expansion
**Estimated Effort**: 8 weeks
**Priority**: High
**Entity Count**: 23 entities (18 direct-access + 5 mapping/junction entities)

## Overview

This feature massively extends the existing CMS with 23 data models covering all major eshop domains:
- **User Management** (8 entities): UserRole, UserCredential, UserContact, UserShipping, UserBilling, UserSession, + existing User
- **Product Management** (8 entities): ProductType, ProductVariant, ProductVariableField, ProductVariableFieldValue, ProductTypeProductMapping, + existing Product
- **Shop Management** (4 entities): Shop, ShopOwnerMapping, ShopProductMapping, ShopProductTypeMapping
- **Order Management** (4 entities): OrderItem, OrderBilling, OrderShipping, OrderPayment + existing Order
- **Content Management** (3 entities): Post, PostType, Lang

The implementation includes:
- Foreign key relationships with cascade delete
- Many-to-many relationships via junction tables
- Unlimited hierarchy support (ProductType)
- Multi-tenant architecture (shop-scoped data isolation)
- Role-based permission system (16 granular permissions)
- Composite unique constraints on all mapping entities
- Indirect mapping entity management (hidden from direct UI)
- Manual ProductVariantVarMapping creation
- Product-specific variable fields

## Constitution Check

### Code Quality Compliance
✅ **Met**: Pure JavaScript/HTML/CSS architecture maintains readability
✅ **Met**: Consistent coding conventions with UIKit framework
⚠️ **Risk**: 23 entities increase complexity - mitigate with modular design patterns
✅ **Met**: ESLint integration planned for code quality enforcement

### Testing Standards Compliance
✅ **Met**: Comprehensive test suite planned (80+ tests for 23 entities)
✅ **Met**: Unit tests for each entity model and API method
✅ **Met**: Integration tests for relationship operations
⚠️ **Risk**: Achieving 80% coverage with expanded scope - prioritize critical paths
✅ **Met**: CI/CD pipeline integration for automated testing

### User Experience Consistency Compliance
✅ **Met**: UIKit components ensure consistent UI/UX
✅ **Met**: Sidebar navigation maintains familiar patterns
✅ **Met**: Loading states and error handling standardized
✅ **Met**: Indirect mapping management simplifies UX (no exposed junction tables)
✅ **Met**: Accessibility compliance (WCAG 2.1 AA) via UIKit

### Performance Requirements Compliance
✅ **Met**: SC-002 specifies sub-2 second list loads for 1000+ items
✅ **Met**: SC-003 specifies sub-5 second CRUD operations
⚠️ **Risk**: ProductType unlimited hierarchy depth - mitigate with efficient tree traversal
⚠️ **Risk**: 23 entities increase database complexity - requires indexing strategy
✅ **Met**: Performance monitoring planned for key metrics

### Security & Data Integrity
✅ **Met**: Composite unique constraints prevent duplicate mappings
✅ **Met**: Multi-tenant shop isolation prevents data leakage (SC-009)
✅ **Met**: Role-based permissions with 16 granular permissions
✅ **Met**: Cascade delete with proper scoping
✅ **Met**: HTML sanitization for XSS prevention (SC-014)
✅ **Met**: Password hashing for UserCredential

**Overall Assessment**: Constitution requirements met with identified risks mitigated through architecture decisions and testing strategy.

## Architecture Decisions

### Data Model Integration
- **Foreign Key Relationships**: All 23 entities properly linked with foreign keys
- **Many-to-Many Relationships**: 5 mapping entities (ShopProductMapping, ShopProductTypeMapping, ProductTypeProductMapping, ProductVariantVarMapping, ProductVariableFieldValue)
- **Composite Unique Constraints**: All mapping entities prevent duplicates via composite unique constraints on FK pairs
- **Multi-Tenant Shops**: Shop-scoped data isolation with shopId fields on related entities
- **ProductType Hierarchy**: Unlimited depth parent-child relationships with dropdown selectors
- **ProductVariableField Strategy**: Linked to Product (not ProductType) for per-product flexibility
- **UserRole Permissions**: Role-based permission system with 16 granular permissions
- **Cascade Delete**: Automatic cleanup of dependent records across all relationships
- **Manual Mapping Creation**: ProductVariantVarMapping created manually for maximum control

### Mapping Entity Management Strategy
**Critical Design Decision**: All mapping/junction entities are hidden from direct UI access and managed indirectly through parent entity interfaces:
- **ShopProductMapping**: Managed via Product edit form (multi-select shops)
- **ShopProductTypeMapping**: Managed via ProductType edit form (multi-select shops)
- **ProductTypeProductMapping**: Managed via Product edit form (multi-select categories)
- **ProductVariantVarMapping**: Managed via ProductVariant edit form (manual field value assignment)
- **ShopOwnerMapping**: Managed via Shop edit form (multi-select owners)

**Rationale**: Reduces cognitive load, prevents direct junction table errors, maintains data integrity

### API Design
- RESTful endpoints following existing patterns (`/api/product-types`, `/api/user-roles`, etc.)
- Consistent error handling and validation (4xx field-level, 5xx guidance)
- Support for advanced filtering, sorting, and pagination
- Shop-scoped queries for multi-tenant data access
- API field mappings documented (note: API uses 'desc' vs frontend 'description')
- Composite unique constraint enforcement at API layer

### UI/UX Design
- Sidebar navigation integration for 18 direct-access entities (mapping entities hidden)
- Consistent UIKit components and styling
- Loading states and error handling for all operations
- Form validation with field-level error display
- Embedded relationship management (no exposed junction tables)
- Permission-based UI element visibility

### Technical Context
- **Language**: Pure JavaScript ES6+ (no transpilation)
- **Styling**: CSS3 with UIKit 3.x framework
- **Markup**: HTML5 semantic elements
- **API Integration**: Native fetch API, RESTful backend
- **State Management**: Local component state (no external state library)
- **Routing**: Client-side routing via existing router
- **Testing**: Jest unit/integration tests
- **Development Server**: live-server with hot reload
- **Version Control**: Git with feature branch workflow
- **CI/CD**: Automated testing gates before merge

## Implementation Phases

### Phase 0: Research & Design (Week 1)
**Objective**: Resolve technical unknowns and finalize architecture

**Research Tasks**:
1. Research efficient tree traversal algorithms for unlimited ProductType hierarchy
2. Investigate composite unique constraint implementation patterns in backend
3. Research best practices for multi-tenant data isolation
4. Evaluate permission system architecture patterns (RBAC)
5. Research cascade delete strategies for complex relationships
6. Investigate HTML sanitization libraries for Post content
7. Research performance optimization for many-to-many relationships
8. Evaluate session token generation best practices

**Design Tasks**:
1. Create comprehensive data-model.md with all 23 entities
2. Design API contracts for all endpoints (OpenAPI spec)
3. Design embedded relationship management UI patterns
4. Create quickstart.md for development setup
5. Update agent context with technology stack

**Deliverables**:
- `research.md` with all technical decisions documented
- `data-model.md` with complete entity schemas
- `/contracts/` directory with OpenAPI specifications
- `quickstart.md` for developer onboarding
- Updated `.github/copilot-instructions.md`

### Phase 1: Core Foundation (Weeks 2-3)
**Objective**: Implement core entities, API layer, and data models

**Week 2 - User & Shop Domain**:
1. Create UserRole model with permission system
2. Create UserCredential model with password hashing
3. Create UserContact model
4. Create UserShipping model
5. Create UserBilling model
6. Create UserSession model
7. Create Shop model with multi-tenant logic
8. Create ShopOwnerMapping model with composite unique constraint
9. Implement API endpoints for User domain entities
10. Implement API endpoints for Shop domain entities
11. Add composite unique constraint validation

**Week 3 - Product & Order Domain**:
1. Create ProductType model with hierarchy support
2. Create ProductVariant model
3. Create ProductVariableField model (product-linked)
4. Create ProductVariableFieldValue model
5. Create ProductVariantVarMapping model (manual creation)
6. Create ShopProductMapping model with composite unique constraint
7. Create ShopProductTypeMapping model with composite unique constraint
8. Create ProductTypeProductMapping model with composite unique constraint
9. Create OrderItem model
10. Create OrderBilling, OrderShipping, OrderPayment models
11. Implement API endpoints for Product domain entities
12. Implement API endpoints for Order domain entities
13. Add foreign key relationships to existing models
14. Implement cascade delete logic

**Deliverables**:
- 23 new data model files in `src/models/`
- API client methods in `src/api.js` (50+ new methods)
- Updated existing models with foreign keys
- Composite unique constraint enforcement
- Cascade delete implementation

### Phase 2: Content & Localization (Week 4)
**Objective**: Complete content management and localization features

**Tasks**:
1. Create Post model with rich text support
2. Create PostType model
3. Create Lang model with unique code constraint
4. Implement API endpoints for content entities
5. Implement HTML sanitization for Post content
6. Add permission-based API access control
7. Implement shop-scoped data filtering middleware
8. Complete API integration testing

**Deliverables**:
- 3 content/localization models
- HTML sanitization implementation
- Permission middleware
- Multi-tenant filtering middleware
- API integration test suite (30+ tests)
### Phase 3: UI Components - User & Shop Domain (Week 5)
**Objective**: Build CRUD interfaces for User and Shop entities

**Tasks**:
1. Create UserRole management views (list, create, edit, delete)
2. Implement permission assignment UI (multi-select checkboxes)
3. Create UserCredential management views (view, reset password)
4. Create UserContact management views
5. Create UserShipping management views
6. Create UserBilling management views
7. Create UserSession viewing interface (read-only)
8. Create Shop management views with multi-tenant context
9. Implement shop owner assignment UI (embedded in Shop edit form)
10. Add shop context switching UI component
11. Update sidebar navigation for User/Shop entities

**Deliverables**:
- 8 new view directories in `src/views/`
- Embedded owner assignment interface
- Shop context switcher component
- Updated sidebar navigation

### Phase 4: UI Components - Product & Order Domain (Week 6)
**Objective**: Build CRUD interfaces for Product and Order entities

**Tasks**:
1. Create ProductType management views with hierarchy selector
2. Implement unlimited depth parent dropdown selector
3. Create ProductVariant management views
4. Create ProductVariableField management views
5. Create ProductVariableFieldValue management views
6. Implement manual ProductVariantVarMapping creation UI
7. Implement product-to-shop assignment UI (multi-select in Product form)
8. Implement product-to-category assignment UI (multi-select in Product form)
9. Implement category-to-shop assignment UI (multi-select in ProductType form)
10. Create OrderItem viewing interface (embedded in Order view)
11. Create OrderBilling/OrderShipping/OrderPayment views
12. Update sidebar navigation for Product/Order entities

**Deliverables**:
- 10 new view directories
- Embedded relationship management UIs
- Hierarchy selector component
- Manual mapping creation interface

### Phase 5: UI Components - Content & Polish (Week 7)
**Objective**: Complete content management UI and polish all interfaces

**Tasks**:
1. Create Post management views with rich text editor
2. Create PostType management views
3. Create Lang management views with unique validation
4. Integrate rich text editor library (TinyMCE or CKEditor)
5. Implement permission-based UI element visibility
6. Add loading states for all operations
7. Implement field-level validation errors
8. Add confirmation dialogs for cascade deletes
9. Update all existing views to display related entities
10. Implement shop-scoped data filtering in all views
11. Add circular reference prevention for ProductType hierarchy
12. Cross-browser compatibility testing

**Deliverables**:
- 3 content management views
- Rich text editor integration
- Permission-based UI rendering
- Comprehensive validation UI
- Updated existing views with relationships

### Phase 6: Integration, Testing & Documentation (Week 8)
**Objective**: Integration testing, performance optimization, and documentation

**Tasks**:
1. Comprehensive integration testing (all entity relationships)
2. Performance testing with large datasets (1000+ items)
3. Security review of permission system
4. Multi-tenant isolation testing (prevent data leakage)
5. Cascade delete testing (verify no orphans)
6. Composite unique constraint testing (prevent duplicates)
7. ProductType hierarchy performance optimization
8. Database indexing strategy implementation
9. API documentation updates
10. User guide creation for all 23 entities
11. Developer documentation for mapping entity patterns
12. Final UAT and bug fixes

**Deliverables**:
- Comprehensive test suite (80+ tests, 80% coverage)
- Performance optimization report
- Security audit report
- Complete API documentation
- User guides and developer documentation
- Deployment-ready codebase

### Phase 3: Integration & Testing (Week 3)
**Objective**: Integrate features and ensure system stability

**Tasks**:
1. Update existing Product/Order/User views to show related entities
2. Implement shop-scoped data filtering
3. Add permission-based UI restrictions
4. Update form validations for foreign key relationships
5. Implement cascade delete confirmations
6. Add comprehensive unit tests
7. Performance optimization for hierarchy operations
8. Cross-browser testing and bug fixes

**Deliverables**:
- Updated existing views with relationship displays
- Comprehensive test suite (30+ tests)
- Performance optimizations

### Phase 4: Documentation & Deployment (Week 4)
**Objective**: Finalize and deploy the feature

**Tasks**:
1. Update API documentation
2. Create user guides for new features
3. Performance testing with large datasets
4. Security review of permission system
5. Final integration testing
6. Deployment preparation
7. User acceptance testing

**Deliverables**:
- Updated documentation
- Deployment package
- Test reports

## Risk Assessment

### High Risk
- **Multi-tenant data isolation**: Incorrect implementation could cause data leakage between shops (23 entities × shop scoping = high complexity)
  - *Mitigation*: Comprehensive testing suite for shop isolation (SC-009), middleware-level filtering, security audit
- **Cascade delete operations**: Accidental data loss across 23 entities with complex relationships
  - *Mitigation*: Confirmation dialogs, soft delete consideration, comprehensive delete testing, scope validation
- **Mapping entity data integrity**: Duplicate mappings or orphaned records in 5 junction tables
  - *Mitigation*: Composite unique constraints at DB level (SC-016), cascade delete, referential integrity enforcement
- **ProductType unlimited hierarchy depth**: Deep nesting could cause performance degradation or infinite loops
  - *Mitigation*: Efficient tree traversal algorithms, circular reference prevention (SC-015), depth limit warnings
- **Permission system complexity**: 16 granular permissions across 23 entities impacts performance and UX
  - *Mitigation*: Permission caching, efficient middleware, clear permission inheritance rules

### Medium Risk
- **Manual ProductVariantVarMapping creation**: User error in linking variants to field values
  - *Mitigation*: Clear UI guidance, validation rules, preview before save
- **API field mapping discrepancy**: Frontend 'description' vs API 'desc' confusion across 23 entities
  - *Mitigation*: Comprehensive field mapping documentation, automated mapping layer, unit tests
- **UI complexity**: Embedded relationship management in parent forms increases cognitive load
  - *Mitigation*: Progressive disclosure, clear UI patterns, user testing, tooltips/help text
- **Foreign key validation**: Complex validation logic for 50+ foreign key relationships
  - *Mitigation*: Server-side validation, clear error messages, referential integrity at DB level
- **Composite unique constraint violations**: User confusion when duplicate mappings are blocked
  - *Mitigation*: Preventive UI (disable duplicate selections), clear error messages (SC-016)

### Low Risk
- **Rich text XSS vulnerabilities**: Post content allows HTML
  - *Mitigation*: HTML sanitization library (SC-014), whitelist approach, security testing
- **Session token security**: UserSession token generation and storage
  - *Mitigation*: Cryptographically secure token generation, proper expiration, HTTPS enforcement
- **Test coverage targets**: 80% coverage across 23 entities with 80+ tests
  - *Mitigation*: Prioritize critical paths, automated coverage reports, incremental improvement

### Mitigation Strategies
1. Implement strict data access controls with shopId filtering middleware
2. Add confirmation dialogs for all destructive cascade delete operations
3. Use efficient tree traversal algorithms (e.g., materialized path, nested sets) for hierarchy
4. Implement comprehensive validation at both client and server levels
5. Conduct thorough security audit focusing on multi-tenant isolation
6. Performance testing with realistic datasets (1000+ items per entity type)
7. Incremental rollout with feature flags per entity group
8. Comprehensive integration testing for all 50+ foreign key relationships
9. Database indexing strategy for all foreign keys and frequently queried fields
10. Clear developer documentation for mapping entity management patterns

## Success Metrics

### Performance Metrics
- All CRUD operations complete in under 5 seconds (SC-003)
- Entity lists load in under 2 seconds for up to 1000 items (SC-002)
- ProductType hierarchy queries complete in under 2 seconds regardless of depth
- Shop context switching completes in under 1 second
- No performance degradation on existing features

### Data Integrity Metrics
- Zero data leakage between shops (SC-009, 100% multi-tenant isolation)
- Zero orphaned records after cascade deletes (SC-011)
- Zero duplicate mapping records (SC-016, composite unique constraints enforced)
- 100% referential integrity across all 50+ foreign key relationships
- Zero circular references in ProductType hierarchy (SC-015)

### Quality Metrics
- 80%+ test coverage for all 23 entities (constitution requirement)
- All 80+ tests passing in CI/CD pipeline
- 95% first-attempt success rate for primary tasks (SC-005)
- Zero XSS vulnerabilities in Post content (SC-014, HTML sanitization)
- 100% permission system accuracy (SC-012)

### User Experience Metrics
- All 18 direct-access entities accessible via sidebar navigation (SC-006)
- Mapping entities (5 types) successfully hidden from direct UI (SC-007)
- Embedded relationship management works in 100% of parent forms (SC-017)
- Entity creation completes in under 30 seconds (SC-001)
- Field validation prevents invalid data entry in 100% of cases (SC-013)

### Coverage Metrics
- All 23 entities implemented with full CRUD operations
- All 16 permissions implemented and enforced
- All 5 mapping entities managed indirectly through parent interfaces
- All acceptance criteria from spec.md met (18 user stories)
- All functional requirements (FR-001 through FR-027) implemented

## Dependencies

### Technical Dependencies
- Existing CMS infrastructure (API client, router, UI components)
- UIKit 3.x component library for consistent UI
- Jest testing framework for unit/integration tests
- live-server development environment with hot reload
- Native fetch API for HTTP requests
- HTML sanitization library (DOMPurify or similar) for Post content
- Rich text editor library (TinyMCE or CKEditor) for Post editing

### Backend API Dependencies
- RESTful API endpoints for all 23 entities
- Composite unique constraint support at database level
- Cascade delete functionality for foreign key relationships
- Multi-tenant data filtering middleware (shopId scoping)
- Permission-based access control middleware
- Session token generation and validation
- Password hashing for UserCredential
- Field mapping layer (desc ↔ description)

### Development Dependencies
- Git version control with feature branch workflow
- CI/CD pipeline for automated testing
- ESLint for code quality enforcement
- Code review process (at least one reviewer per PR)
- Performance monitoring tools
- Security scanning tools for vulnerability detection

### Documentation Dependencies
- OpenAPI/Swagger specification for API contracts
- Entity relationship diagrams for data model
- User guides for all 23 entities
- Developer documentation for mapping entity patterns
- Architecture decision records (ADRs) for key choices

## Rollback Plan

### Pre-Deployment Safeguards
1. **Feature Flags**: Implement feature flags for each entity group (User, Product, Shop, Order, Content) to enable incremental rollout
2. **Database Backup**: Full database backup before any migration or deployment
3. **Staging Environment Testing**: Complete UAT in staging environment mirroring production
4. **Code Review Gates**: All 23 entities require code review and approval
5. **Automated Test Gates**: All 80+ tests must pass before deployment

### Incremental Rollout Strategy
1. **Week 8 - Phase 1**: Deploy User & Shop domain entities (8 entities + 1 mapping)
2. **Week 8 - Phase 2**: Deploy Product domain entities (5 entities + 3 mappings) after monitoring Phase 1
3. **Week 8 - Phase 3**: Deploy Order & Content domain entities (7 entities) after monitoring Phase 2
4. **Monitoring Period**: 24-48 hours between each phase with active monitoring

### Rollback Triggers
- Data leakage detected between shops (SC-009 violation)
- Performance degradation exceeding 20% on existing features
- Cascade delete creating orphaned records (SC-011 violation)
- Permission system failures (SC-012 violation)
- Test coverage dropping below 70%
- Critical security vulnerabilities discovered

### Rollback Procedures
1. **Immediate Rollback**: Toggle feature flags to disable affected entity groups
2. **Code Rollback**: Git revert to last stable commit with automated deployment
3. **Database Rollback**: Restore from pre-deployment backup (coordinate with backend team)
4. **Data Migration Rollback**: Execute rollback scripts for any data migrations
5. **Monitoring**: Verify system stability post-rollback (all existing features functional)

### Communication Plan
- Notify stakeholders within 15 minutes of rollback decision
- Post-mortem within 24 hours to identify root cause
- Remediation plan within 48 hours with timeline for re-deployment
- Transparent status updates every 4 hours during rollback/recovery

### Recovery Validation
- All existing features operational (Products, Orders, Users CRUD)
- Performance metrics returned to baseline
- No data loss or corruption detected
- All automated tests passing
- User acceptance verification in staging before re-attempting deployment

---

## Implementation Summary

**Total Effort**: 8 weeks (60% increase from initial 3-4 week estimate due to 360% scope expansion from 5 to 23 entities)

**Entity Breakdown**:
- 18 direct-access entities with full CRUD UI
- 5 mapping/junction entities managed indirectly
- 50+ foreign key relationships
- 16 granular permissions
- 5 composite unique constraints

**Key Architectural Innovations**:
- Indirect mapping entity management (UX simplification)
- Product-specific variable fields (maximum flexibility)
- Manual ProductVariantVarMapping creation (explicit control)
- Composite unique constraints (data integrity)
- Multi-tenant shop isolation (security)

**Critical Success Factors**:
1. Comprehensive testing (80+ tests, 80% coverage)
2. Performance optimization for hierarchy and mappings
3. Security audit for multi-tenant isolation
4. Clear documentation for mapping entity patterns
5. Incremental rollout with monitoring

**Next Steps After Planning**:
1. Begin Phase 0: Research & Design (Week 1)
2. Generate research.md, data-model.md, API contracts
3. Update agent context and quickstart documentation
4. Proceed to Phase 1 implementation (Weeks 2-3)

**Status**: Plan complete, ready for Phase 0 execution 🚀
