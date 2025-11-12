# Research & Technical Decisions: Implement More Data Models for CMS

**Feature**: `002-implement-more-data`
**Phase**: 0 (Research & Design)
**Date**: 2025-10-15
**Status**: In Progress

## Executive Summary

This document compiles research findings and technical decisions for the comprehensive eshop CMS expansion from 5 to 23 entities. All critical technical unknowns have been resolved to enable confident implementation of the 8-week phased approach.

## 1. Tree Traversal Algorithms for ProductType Hierarchy

### Research Findings
**Problem**: Unlimited depth ProductType hierarchy requires efficient tree traversal for performance and circular reference prevention.

**Options Evaluated**:
- **Adjacency List**: Simple parentId foreign key, but expensive recursive queries
- **Materialized Path**: Store full path as string (e.g., "1.2.3"), fast reads but complex updates
- **Nested Sets**: Left/right node numbering, efficient subtree queries but complex maintenance
- **Closure Table**: Separate table storing all ancestor-descendant relationships

**Recommended Solution**: **Materialized Path**
- **Rationale**: Balances read performance with reasonable update complexity
- **Implementation**: Store path as delimited string (e.g., "/1/2/3/") in `path` column
- **Benefits**:
  - Fast ancestor/descendant queries with LIKE operations
  - Easy circular reference prevention (check if new parent is in current path)
  - Reasonable update performance for most use cases
- **Performance**: O(log n) for typical hierarchies, acceptable for unlimited depth
- **Edge Cases**: Maximum path length limits (e.g., VARCHAR(1000))

**Alternative**: Nested Sets for read-heavy workloads with infrequent updates

## 2. Composite Unique Constraint Implementation

### Research Findings
**Problem**: 5 mapping entities require composite unique constraints on foreign key pairs to prevent duplicates.

**Options Evaluated**:
- **Database-Level Constraints**: Native DB unique indexes on FK pairs
- **Application-Level Validation**: Check existence before insert/update
- **Hybrid Approach**: DB constraints + application validation

**Recommended Solution**: **Database-Level Constraints with Application Validation**
- **Rationale**: Data integrity at the source with user-friendly error handling
- **Implementation**:
  - DB: `UNIQUE KEY (shopId, productId)` on ShopProductMapping
  - App: Try insert, catch constraint violation, return clear error message
- **Benefits**:
  - Zero duplicate risk regardless of application bugs
  - Atomic constraint checking
  - Clear error messages: "This product is already assigned to this shop"
- **Error Handling**: Map DB constraint violations to user-friendly messages

**Migration Strategy**: Add constraints after data cleanup in existing mappings

## 3. Multi-Tenant Data Isolation

### Research Findings
**Problem**: Shop-scoped data isolation across 23 entities prevents cross-shop data leakage.

**Options Evaluated**:
- **Row-Level Security (RLS)**: Database-level row filtering
- **Application-Level Filtering**: Middleware adds shopId to all queries
- **Schema Separation**: Separate databases/schemas per shop
- **Shared Schema with Views**: Filtered views per shop

**Recommended Solution**: **Application-Level Middleware Filtering**
- **Rationale**: Flexible, testable, and backend-agnostic
- **Implementation**:
  - Middleware: `shopFilter(req, res, next)` adds `WHERE shopId = ?` to queries
  - Context: `currentShopId` from user session/shop selection
  - API: All endpoints automatically filtered by current shop
- **Benefits**:
  - Works with any backend (SQL, NoSQL, REST)
  - Testable isolation (switch shop context in tests)
  - Clear separation of concerns
- **Security**: Session validation ensures users only access authorized shops

**Performance**: Minimal overhead, index on shopId columns required

## 4. Permission System Architecture (RBAC)

### Research Findings
**Problem**: 16 granular permissions across 23 entities with role-based access control.

**Options Evaluated**:
- **Bitmask Permissions**: Integer flags (read=1, write=2, delete=4)
- **Permission Table**: Many-to-many UserRole ↔ Permission
- **Role Inheritance**: Hierarchical roles with permission inheritance
- **Attribute-Based Access Control (ABAC)**: Context-aware permissions

**Recommended Solution**: **Role-Based with Permission Inheritance**
- **Rationale**: Simple to understand, scalable, and meets requirements
- **Implementation**:
  - UserRole: `permissions: ["create_product", "delete_order", ...]` (16 total)
  - Middleware: `permissionCheck("create_product")` on protected routes
  - UI: Show/hide elements based on `user.hasPermission("create_product")`
- **Permission List** (16 permissions):
  - `create_product`, `read_product`, `update_product`, `delete_product`
  - `create_order`, `read_order`, `update_order`, `delete_order`
  - `create_user`, `read_user`, `update_user`, `delete_user`
  - `manage_shops`, `manage_posts`, `manage_content`, `system_admin`
- **Benefits**:
  - Clear permission model
  - Easy UI integration
  - Scalable for future permissions

**Extension**: Consider ABAC for complex business rules in future phases

## 5. Cascade Delete Strategies

### Research Findings
**Problem**: Complex relationships across 23 entities require safe cascade delete with user confirmation.

**Options Evaluated**:
- **Database Triggers**: Automatic cascade at DB level
- **Application Logic**: Manual deletion with transaction
- **Soft Delete**: Mark as deleted, periodic cleanup
- **Hybrid**: DB cascade for simple relations, app logic for complex

**Recommended Solution**: **Application-Level Cascade with Confirmation**
- **Rationale**: User control, auditability, and complex relationship handling
- **Implementation**:
  - UI: "Delete with dependencies" confirmation dialog
  - Logic: `cascadeDelete(entity)` function with dependency analysis
  - Transaction: Wrap all deletes in database transaction
  - Audit: Log all cascade operations
- **Dependency Analysis**:
  - ProductType: Check child categories and products
  - Shop: Check all assigned products, orders, users
  - User: Check created content, orders, sessions
- **Safety**: Preview affected records before confirmation

**Performance**: Batch deletes with proper indexing

## 6. HTML Sanitization Libraries

### Research Findings
**Problem**: Post content allows HTML but requires XSS prevention.

**Options Evaluated**:
- **DOMPurify**: Comprehensive XSS prevention, whitelist approach
- **sanitize-html**: Configurable HTML sanitization
- **js-xss**: Lightweight XSS filtering
- **Trusted Types API**: Browser-native sanitization

**Recommended Solution**: **DOMPurify**
- **Rationale**: Industry standard, comprehensive protection, active maintenance
- **Implementation**:
  - Library: `npm install dompurify`
  - Configuration: Allow basic formatting tags (`<p>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`)
  - Integration: Sanitize on save, display sanitized content
- **Benefits**:
  - Prevents all XSS attacks
  - Configurable tag/attribute whitelisting
  - Fast performance
  - Browser and Node.js compatible

**Fallback**: sanitize-html if DOMPurify proves too restrictive

## 7. Session Token Generation

### Research Findings
**Problem**: UserSession tokens require secure generation and validation.

**Options Evaluated**:
- **JWT (JSON Web Tokens)**: Signed tokens with expiration
- **Opaque Tokens**: Random strings stored in database
- **Hybrid**: Short-lived JWT with database validation

**Recommended Solution**: **JWT with Database Validation**
- **Rationale**: Stateless tokens with server-side validation for revocation
- **Implementation**:
  - Generate: `jwt.sign({userId, sessionId}, secret, {expiresIn: '24h'})`
  - Store: Session record with token hash for validation
  - Validate: Check JWT signature + database session existence
  - Revoke: Delete session record to invalidate token
- **Security**:
  - Strong secret key rotation
  - HTTPS only
  - Secure token storage (httpOnly cookies)
  - Automatic expiration
- **Benefits**:
  - Stateless validation
  - Easy revocation
  - Standard implementation

**Monitoring**: Track token usage and failed validations

## 8. Data Model Architecture

### Entity Relationships Summary
**23 Entities** (18 direct-access + 5 mapping/junction):

**User Management (8 entities)**:
- UserRole, UserCredential, UserContact, UserShipping, UserBilling, UserSession
- ShopOwnerMapping (composite unique: shopId + userId)

**Product Management (8 entities)**:
- ProductType (hierarchy), ProductVariant, ProductVariableField, ProductVariableFieldValue
- ShopProductMapping (shopId + productId)
- ShopProductTypeMapping (shopId + productTypeId)
- ProductTypeProductMapping (productTypeId + productId)
- ProductVariantVarMapping (variantId + fieldValueId)

**Shop Management (4 entities)**:
- Shop (multi-tenant root)
- ShopOwnerMapping (already listed)

**Order Management (4 entities)**:
- OrderItem, OrderBilling, OrderShipping, OrderPayment

**Content Management (3 entities)**:
- Post (rich text), PostType, Lang (unique code)

### Foreign Key Strategy
- **Cascade Delete**: All FKs with CASCADE DELETE for automatic cleanup
- **Referential Integrity**: Database-level constraints prevent orphans
- **Indexing**: All FK columns indexed for performance
- **Validation**: Application-level validation with clear error messages

### Composite Unique Constraints
**5 Mapping Entities** with composite unique constraints:
1. ShopOwnerMapping: (shopId, userId) - One owner per shop per user
2. ShopProductMapping: (shopId, productId) - One assignment per shop-product
3. ShopProductTypeMapping: (shopId, productTypeId) - One assignment per shop-category
4. ProductTypeProductMapping: (productTypeId, productId) - One category per product
5. ProductVariantVarMapping: (variantId, fieldValueId) - One value per variant per field

## 9. API Design Patterns

### RESTful Endpoints
- **Standard CRUD**: `GET/POST/PUT/DELETE /api/{entities}`
- **Hierarchy Support**: `GET /api/product-types/{id}/children`
- **Shop Scoping**: Automatic `?shopId=currentShop` parameter
- **Filtering**: `GET /api/products?typeId=1&shopId=2`
- **Pagination**: `GET /api/products?page=1&limit=20`

### Error Handling
- **4xx Client Errors**: Field validation, permission denied, not found
- **5xx Server Errors**: Database errors, internal failures
- **Standard Format**: `{error: "message", code: "ERROR_CODE", details: {...}}`

### Authentication & Authorization
- **Session-Based**: JWT tokens in httpOnly cookies
- **Permission Checks**: Middleware validates required permissions
- **Shop Context**: Automatic shop filtering based on user context

## 10. UI/UX Architecture

### Component Strategy
- **UIKit 3.x**: Consistent component library
- **Indirect Mapping**: Hide junction tables, manage through parent forms
- **Progressive Disclosure**: Show advanced options on demand
- **Loading States**: Consistent loading indicators and error handling

### Navigation Pattern
- **Sidebar**: 18 direct-access entities, organized by domain
- **Breadcrumbs**: Show hierarchy context (ProductType > Product > Variant)
- **Search/Filter**: Global search with faceted filtering

### Form Validation
- **Real-time**: Field-level validation as user types
- **Server Validation**: Additional checks on submit
- **Error Display**: Clear, actionable error messages
- **Success Feedback**: Confirmation messages for all operations

## 11. Testing Strategy

### Test Coverage Targets
- **Unit Tests**: 80% coverage for all 23 entities
- **Integration Tests**: API endpoint testing with real data
- **UI Tests**: Critical user workflows
- **Performance Tests**: Large datasets (1000+ items)

### Test Categories
- **Model Tests**: CRUD operations, validation, relationships
- **API Tests**: Endpoint responses, error handling, authentication
- **UI Tests**: Form validation, navigation, permission checks
- **Integration Tests**: End-to-end workflows, data consistency

## 12. Performance Considerations

### Database Optimization
- **Indexing Strategy**: FK columns, frequently queried fields, composite indexes
- **Query Optimization**: Efficient JOINs, pagination, selective field loading
- **Connection Pooling**: Reuse database connections
- **Caching**: Consider Redis for frequently accessed data

### Frontend Performance
- **Lazy Loading**: Load components and data on demand
- **Pagination**: Limit list views to 20-50 items
- **Debounced Search**: Prevent excessive API calls
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

## 13. Security Considerations

### Data Protection
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Prevention**: HTML sanitization for rich text content
- **CSRF Protection**: Token-based CSRF prevention
- **SQL Injection**: Parameterized queries only

### Access Control
- **Multi-Tenant Isolation**: Shop-scoped data access
- **Permission System**: Granular RBAC with 16 permissions
- **Session Security**: Secure token generation and validation
- **Audit Logging**: Track all data modifications

## 14. Deployment Strategy

### Incremental Rollout
- **Feature Flags**: Enable entities in phases (User → Product → Order → Content)
- **Monitoring**: Track performance and error rates
- **Rollback Plan**: Feature flag rollback with data integrity preservation
- **Testing**: Staging environment validation before production

### Migration Strategy
- **Data Migration**: Clean existing data before constraint application
- **Zero Downtime**: Backward compatible changes where possible
- **Rollback Scripts**: Automated rollback procedures
- **Backup Strategy**: Full backups before any schema changes

## 15. Risk Assessment & Mitigation

### High Risk Items
- **Multi-Tenant Isolation**: Comprehensive testing, security audit
- **Cascade Delete Complexity**: User confirmation, transaction safety
- **Hierarchy Performance**: Efficient algorithms, depth monitoring
- **Permission System**: Thorough testing, clear documentation

### Medium Risk Items
- **Composite Constraints**: User-friendly error messages, validation UI
- **Rich Text XSS**: Sanitization testing, security review
- **Session Token Security**: Secure implementation, monitoring

### Low Risk Items
- **UI Complexity**: User testing, iterative improvements
- **API Field Mapping**: Documentation, automated mapping
- **Test Coverage**: Incremental improvement, coverage reporting

## Conclusion

All critical technical unknowns have been resolved with recommended solutions that balance performance, security, maintainability, and user experience. The research provides a solid foundation for confident implementation of the 23-entity eshop CMS expansion.

**Next Steps**:
1. Create data-model.md with complete entity schemas
2. Generate /contracts/ directory with OpenAPI specifications
3. Create quickstart.md for developer onboarding
4. Update agent context with new technologies

**Status**: Research complete, ready for design phase implementation.