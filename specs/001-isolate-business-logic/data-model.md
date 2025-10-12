# Data Model: Isolate Business Logic from Generic Backend Package

**Date**: 2025-10-12  
**Feature**: 001-isolate-business-logic

## Overview

This document defines the conceptual data model for the package separation. Since this is a refactoring task (not a new feature), the focus is on the **organizational structure** of code entities rather than database entities.

## Package Entities (What Goes in `packages/sequelize-rest-framework/`)

### Core Components

#### 1. ModelRegistry
**Purpose**: Central registry for auto-registering models with CRUD endpoints

**Properties**:
- `models: Map<string, ModelConfig>` - Registered models and their configurations
- `initialized: boolean` - Whether registry has been initialized

**Methods**:
- `register(collectionName, model, options)` - Register a model for auto-CRUD
- `getAll()` - Get all registered models
- `get(collectionName)` - Get specific model configuration
- `has(collectionName)` - Check if model is registered
- `initializeAll({ app, appWithMeta })` - Initialize CRUD endpoints for all models
- `clear()` - Clear all registrations (for testing)

**Relationships**:
- Used by Application Layer to register business models
- Consumes GenericCRUD to create endpoints

---

#### 2. GenericCRUD
**Purpose**: Automatic REST endpoint generation for Sequelize models

**Capabilities**:
- `POST /api/{Model}` - Create entity
- `GET /api/{Model}` - List entities (with filtering, sorting, pagination, joins)
- `GET /api/{Model}/:id` - Read single entity
- `PUT /api/{Model}/:id` - Update entity
- `DELETE /api/{Model}/:id` - Delete entity

**Query Features**:
- `filter`: WHERE clause as JSON (supports $like, $gt, $lt, $gte, $lte, $in, $not, $notIn)
- `sort`: ORDER BY clause as JSON array
- `group`: GROUP BY clause
- `join`: INCLUDE clause for associations
- `offset`: Pagination offset
- `limit`: Pagination limit
- `isCount`: Return count instead of records

**Extension Points**:
- `aclMiddleware`: Optional ACL middleware per operation (create, read, update, delete)
- `usePlugins`: Enable plugin hooks (beforeCreate, afterCreate, etc.)

**Relationships**:
- Used by ModelRegistry
- Consumes QueryIncludeClauseMassager, QueryWhereClauseMassager
- Interacts with PluginManager (optional)

---

#### 3. GenericAssociations
**Purpose**: Automatic association endpoint generation (belongs-to, has-many)

**Capabilities**:
- `GET /api/{Model}/:id/{association}` - Get associated records
- `POST /api/{Model}/:id/{association}` - Create association
- `PUT /api/{Model}/:id/{association}/:associatedId` - Update association
- `DELETE /api/{Model}/:id/{association}/:associatedId` - Remove association

**Relationships**:
- Works alongside GenericCRUD
- Uses same query massagers

---

#### 4. AuthSystem
**Purpose**: Complete authentication and authorization framework

**Components**:
- **Models**: User, UserRole, UserPermission, UserRolePermissionMapping, UserCredential, UserSession
- **Services**: UserAuthService (login, register, logout, token management), UserACLService (permission checks)
- **Middleware**: AuthMiddleware (authenticate, authorize, requireLevel)
- **Routes**: AuthRoutes (login, register, logout, refresh, change-password, verify)

**Key Features**:
- Password-based authentication with bcrypt
- Session-based token management (access + refresh tokens)
- Role-based access control (RBAC)
- Permission system with resource/action granularity
- Token expiry and refresh
- Multiple session support per user

**Extension Points**:
- Additional auth credential types (OAuth, SAML, etc.)
- Custom user fields via model composition
- Custom ACL rules

**Relationships**:
- Provides base models that Application Layer extends
- Used by Application Layer routers for protected endpoints

---

#### 5. RequestResponseMiddleware
**Purpose**: Consistent API response formatting

**Methods**:
- `sendResponse({ status, data, message })` - Send success response
- `sendError({ error, status, message })` - Send error response

**Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}

// Or for errors
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

**Relationships**:
- Applied globally via Express middleware
- Used by GenericCRUD and custom API endpoints

---

#### 6. RouterWithMeta
**Purpose**: Express router with OpenAPI/Swagger metadata support

**Features**:
- Wraps Express router methods (get, post, put, delete)
- Accepts OpenAPI specification as second parameter
- Collects metadata for Swagger documentation generation

**Usage Pattern**:
```javascript
appWithMeta.get('/api/Product', {
  parameters: [
    { in: "query", name: "filter", schema: { type: "string" } }
  ]
}, handler);
```

**Relationships**:
- Used by GenericCRUD and business APIs
- Consumed by Swagger documentation generator

---

#### 7. Query Utilities

##### QueryIncludeClauseMassager
**Purpose**: Transform join parameter into Sequelize include clause

**Capabilities**:
- Parse JSON include specifications
- Support nested associations
- Handle association aliases

##### QueryWhereClauseMassager
**Purpose**: Transform filter parameter into Sequelize WHERE clause

**Capabilities**:
- Parse JSON filter specifications
- Support Sequelize operators ($like, $gt, $in, etc.)
- Handle nested conditions ($or, $and)
- Recursive processing for complex queries

**Relationships**:
- Used by GenericCRUD for query building

---

#### 8. SchemaHelper
**Purpose**: Utilities for Sequelize schema manipulation

**Functions**:
- `SchemaToIndexes(schema)` - Extract indexes from schema definition
- `SchemaToOpenAPI(schema)` - Convert schema to OpenAPI specification
- Helper functions for common schema patterns

**Relationships**:
- Used by Application Layer when defining models
- Used by Swagger generator for documentation

---

## Application Layer Entities (What Stays in `src/`)

### Business Models

All e-commerce domain models remain in `src/models/stores/`:
- Product, ProductType, ProductVariant, ProductVariableField, ProductVariableFieldValue
- Order, OrderItem, OrderStatus, OrderItemStatus, OrderBilling, OrderShipping, OrderPayment, OrderInvoice
- Shop, ShopOwnerMapping, ShopProductMapping, ShopOrderMapping
- User (extended), UserContact, UserShipping, UserBilling, UserPayment, UserCartItem
- Post, PostType, Lang
- Various mapping tables for many-to-many relationships

**Pattern**: Each model file exports:
```javascript
export const EBProduct = {
  makeSchema: () => ({ /* Sequelize field definitions */ }),
  makeAssociations: ({ Me, OtherModels }) => { /* Define relationships */ }
};
```

### Business APIs

All e-commerce endpoints remain in `src/apis/`:
- APIOrder, APIOrderItem
- APIProduct, APIProductType, APIProductVariant, APIProductVariableField, APIProductVariableFieldValue
- APIShop
- APIUser, APIUserAuth

**Pattern**: Each API file exports:
```javascript
export const APIProduct = {
  initialize: ({ app, appWithMeta, models }) => {
    GenericCRUD.initialize({
      app,
      appWithMeta,
      collectionName: 'Product',
      collectionModel: models.Product
    });
    // Optional: Add custom endpoints
  }
};
```

### Business DAOs

Custom data access logic remains in `src/dao/`:
- UserAuthDao (if custom logic beyond package auth)
- UserACLDao (if custom ACL beyond package)
- Order processing logic
- Inventory management logic

### Database Migrations

Schema migrations remain in `src/models/migrations/`:
- Initial schema setup
- Business model additions/changes
- Data migrations

**Note**: Package should not include migrations, as it's schema-agnostic

---

## Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Business     │  │ Business     │  │ Business     │      │
│  │ Models       │  │ APIs         │  │ DAOs         │      │
│  │ (EBProduct,  │  │ (APIProduct, │  │ (custom      │      │
│  │  EBOrder,    │  │  APIOrder,   │  │  logic)      │      │
│  │  EBShop...)  │  │  APIShop...) │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         │ registers       │ uses            │ uses          │
│         ↓                 ↓                 ↓               │
├─────────────────────────────────────────────────────────────┤
│                   Generic Package Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ModelRegistry│  │ GenericCRUD  │  │ AuthSystem   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         │ uses            │ uses            │ uses          │
│         ↓                 ↓                 ↓               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ RouterWith   │  │ Query        │  │ Request      │      │
│  │ Meta         │  │ Utilities    │  │ Response     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ depends on
                          ↓
              ┌───────────────────────┐
              │   External Libraries  │
              │  (Express, Sequelize, │
              │   bcrypt, etc.)       │
              └───────────────────────┘
```

---

## Data Flow

### 1. Application Startup Flow

```
1. Application initializes Sequelize connection
   ↓
2. Application creates all business models (Product, Order, Shop...)
   ↓
3. Application registers models with ModelRegistry
   modelRegistry.register('Product', Product)
   modelRegistry.register('Order', Order)
   ↓
4. Application calls modelRegistry.initializeAll({ app, appWithMeta })
   ↓
5. ModelRegistry iterates through registered models
   ↓
6. For each model, GenericCRUD.initialize() creates endpoints
   ↓
7. Application mounts additional custom routes
   ↓
8. Server starts listening
```

### 2. API Request Flow

```
Client Request: GET /api/Product?filter={"price":{"$gt":100}}
   ↓
1. Express routes to GenericCRUD endpoint
   ↓
2. RequestResponseMiddleware attaches sendResponse/sendError
   ↓
3. Optional: AuthMiddleware validates token
   ↓
4. GenericCRUD handler receives request
   ↓
5. QueryWhereClauseMassager parses filter parameter
   ↓
6. Sequelize executes query on Product model
   ↓
7. GenericCRUD formats results
   ↓
8. RequestResponseMiddleware sends standardized response
   ↓
Client receives JSON response
```

### 3. Model Registration Flow

```
Business Layer (src/models/index.js)
   ↓
1. Define models using Sequelize
   ↓
2. Call register() on modelRegistry
   ↓
ModelRegistry (package)
   ↓
3. Store model configuration in Map
   ↓
4. On initializeAll(), iterate through registered models
   ↓
5. Call GenericCRUD.initialize() for each model
   ↓
GenericCRUD (package)
   ↓
6. Create Express routes for CRUD operations
   ↓
7. Attach to Express app
```

---

## Validation Rules

### Package Components

**Must**:
- Have zero dependencies on business models (Product, Order, Shop)
- Be usable in non-e-commerce contexts (blog, inventory, etc.)
- Have comprehensive tests with in-memory SQLite
- Export clear, documented public API
- Follow semantic versioning

**Must Not**:
- Import from `src/` directory
- Reference e-commerce domain concepts
- Include business logic
- Make assumptions about model structure (beyond Sequelize conventions)

### Application Components

**Must**:
- Import from package, never reach into package internals
- Register all models with ModelRegistry
- Extend package components via documented extension points
- Maintain backward compatibility of API contracts

**Must Not**:
- Modify package code directly
- Duplicate generic functionality from package
- Create tight coupling to package internals

---

## State Transitions

This is a refactoring task, so state transitions are about the codebase structure:

### Migration States

1. **Initial State**: All code in `src/`, generic mixed with business
2. **Package Created**: `packages/sequelize-rest-framework/` exists but not used
3. **Code Moved**: Generic code moved to package, old paths still work via aliases
4. **Imports Updated**: Business code imports from package, aliases still present
5. **Aliases Removed**: Clean imports, old `_incl/` directory deleted
6. **Tests Passing**: All API tests green, package tests green
7. **Final State**: Clean separation, package independently usable

### Rollback Plan

At each state, can rollback to previous by:
- Git revert if issues found
- Keep old code in place until new code verified
- Run full test suite before each transition

---

## Indexes & Constraints

Since this is organizational, not database schema:

### Import Constraints

**Package exports**:
```javascript
// Only these are public API
export {
  GenericCRUD,
  GenericAssociations,
  ModelRegistry,
  AuthSystem,
  RequestResponseMiddleware,
  RouterWithMeta,
  SchemaHelper,
  SchemaToIndexes
};
```

**Application imports**:
```javascript
// Always use named imports from package root
import { GenericCRUD, ModelRegistry } from 'sequelize-rest-framework';

// Never reach into internals
// ❌ BAD: import { GenericCRUD } from 'sequelize-rest-framework/src/api/GenericCRUD.js';
```

### Testing Constraints

- Package tests must run in isolation (no business models)
- Application tests can use package but not test package internals
- Integration tests verify package + application work together

---

## Summary

This data model describes the **architectural separation** between:

1. **Generic Package**: Reusable framework components (ModelRegistry, GenericCRUD, AuthSystem, utilities)
2. **Business Application**: E-commerce domain models, APIs, and custom logic

**Key Principle**: Package provides building blocks, Application composes them for e-commerce use case.

**Success Criteria**: A developer could use this package to build a completely different application (blog, inventory system) without encountering e-commerce concepts.
