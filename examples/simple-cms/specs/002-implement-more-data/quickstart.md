# Quickstart Guide: Eshop CMS Development

**Feature**: `002-implement-more-data`
**Last Updated**: 2025-10-15
**Target Audience**: Developers joining the eshop CMS project

## Overview

Welcome to the eshop CMS project! This guide will help you get started with the comprehensive 23-entity content management system. The project has been massively expanded to include full eshop functionality with multi-tenant architecture, advanced product management, and comprehensive user systems.

## Project Structure

```
examples/simple-cms/
├── specs/
│   └── 002-implement-more-data/
│       ├── plan.md              # Implementation plan (8 weeks, 109 tasks)
│       ├── tasks.md             # Detailed task breakdown
│       ├── spec.md              # Feature specifications
│       ├── research.md          # Technical research & decisions
│       ├── data-model.md        # Entity schemas & relationships
│       └── contracts/
│           └── openapi.yaml     # API specifications
├── src/
│   ├── models/                  # Data models (23 entities)
│   ├── views/                   # UI components (18 direct-access)
│   ├── api.js                   # API client (50+ methods)
│   ├── router.js                # Client-side routing
│   └── ui.js                    # UI framework integration
├── tests/                       # Test suites (80+ tests)
├── package.json                 # Dependencies & scripts
└── index.html                   # Main application
```

## Prerequisites

### System Requirements
- **Node.js**: 18.x or later
- **npm**: 8.x or later
- **Git**: 2.30 or later
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Development Tools
- **Code Editor**: VS Code recommended (with GitHub Copilot)
- **Terminal**: Modern terminal with shell integration
- **API Testing**: Postman, Insomnia, or curl
- **Database**: Backend API with PostgreSQL/MySQL

## Getting Started

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/VansonLeung/eshop-backend-api-1.git
cd eshop-backend-api-1

# Switch to the feature branch
git checkout 002-implement-more-data

# Navigate to the simple-cms example
cd examples/simple-cms

# Install dependencies
npm install
```

### 2. Development Server
```bash
# Start the development server
npm start
# or
npx live-server --port=3000

# Open in browser
# http://localhost:3000
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/userRole.test.js
```

### 4. Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check (if applicable)
npm run type-check
```

## Architecture Overview

### Technology Stack
- **Frontend**: Pure JavaScript ES6+, HTML5, CSS3
- **UI Framework**: UIKit 3.x (WCAG 2.1 AA compliant)
- **API Client**: Native fetch API with RESTful backend
- **State Management**: Component-level state (no external libraries)
- **Routing**: Client-side routing via History API
- **Testing**: Jest with 80% coverage target
- **Build Tool**: None (ES6 modules, no transpilation)

### Key Architectural Patterns

#### 1. Multi-Tenant Shop Isolation
```javascript
// All API calls automatically filtered by current shop
const products = await api.getProducts(); // Only returns current shop's products

// Shop context managed globally
window.currentShopId = getCurrentShopFromSession();
```

#### 2. Indirect Mapping Entity Management
```javascript
// Mapping entities managed through parent forms
// Instead of direct ShopProductMapping CRUD, use:
await api.assignProductToShop(productId, shopId); // Creates mapping
await api.removeProductFromShop(productId, shopId); // Deletes mapping
```

#### 3. Permission-Based UI Rendering
```javascript
// UI elements show/hide based on permissions
if (user.hasPermission('create_product')) {
    showCreateButton();
}
```

#### 4. Composite Unique Constraints
```javascript
// Database prevents duplicate mappings
// ShopProductMapping: UNIQUE(shopId, productId)
// Automatic constraint violation handling with user-friendly errors
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/add-product-variants

# Make changes following the plan
# - Update models, API, UI components
# - Add comprehensive tests
# - Update documentation

# Commit changes
git add .
git commit -m "feat: add product variant management

- Add ProductVariant model with CRUD operations
- Implement variant-to-field-value mappings
- Add UI components for variant management
- Add comprehensive test coverage"

# Push and create PR
git push origin feature/add-product-variants
```

### 2. Code Standards
- **ESLint**: Follow Airbnb JavaScript style guide
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Imports**: Group by type (standard libs, local modules, relative imports)
- **Error Handling**: Use try/catch with meaningful error messages
- **Documentation**: JSDoc comments for all public functions

### 3. Testing Standards
- **Coverage**: Minimum 80% for all new code
- **Types**: Unit tests, integration tests, UI tests
- **Naming**: `*.test.js` or `*.spec.js`
- **Structure**: Arrange-Act-Assert pattern

```javascript
describe('ProductType Model', () => {
    test('should create product type with valid data', () => {
        // Arrange
        const validData = { name: 'Electronics', description: 'Electronic devices' };

        // Act
        const productType = new ProductType(validData);

        // Assert
        expect(productType.name).toBe('Electronics');
        expect(productType.validate()).toBe(true);
    });
});
```

## Entity Development Guide

### Adding a New Entity

#### 1. Create Model (`src/models/`)
```javascript
// src/models/exampleEntity.js
export class ExampleEntity {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    validate() {
        if (!this.name || this.name.length < 1) {
            throw new Error('Name is required');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
```

#### 2. Add API Methods (`src/api.js`)
```javascript
// Add to api.js
export const exampleEntityApi = {
    async getList(params = {}) {
        const query = new URLSearchParams(params);
        const response = await fetch(`/api/example-entities?${query}`);
        return handleResponse(response);
    },

    async getById(id) {
        const response = await fetch(`/api/example-entities/${id}`);
        return handleResponse(response);
    },

    async create(data) {
        const response = await fetch('/api/example-entities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async update(id, data) {
        const response = await fetch(`/api/example-entities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async delete(id) {
        const response = await fetch(`/api/example-entities/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    }
};
```

#### 3. Create UI Components (`src/views/`)
```
src/views/example-entities/
├── list.js          # List view with pagination
├── create.js        # Create form
├── edit.js          # Edit form
└── delete.js        # Delete confirmation
```

#### 4. Add Tests (`tests/`)
```javascript
// tests/exampleEntity.test.js
import { ExampleEntity } from '../src/models/exampleEntity.js';

describe('ExampleEntity Model', () => {
    test('should create valid entity', () => {
        const entity = new ExampleEntity({
            name: 'Test Entity',
            description: 'Test description'
        });

        expect(entity.name).toBe('Test Entity');
        expect(entity.validate()).toBe(true);
    });

    test('should reject invalid entity', () => {
        const entity = new ExampleEntity({
            name: '' // Invalid: empty name
        });

        expect(() => entity.validate()).toThrow('Name is required');
    });
});
```

#### 5. Update Navigation (`src/ui.js`)
```javascript
// Add to navigation
const navigationItems = [
    // ... existing items
    {
        id: 'example-entities',
        label: 'Example Entities',
        icon: 'icon-list',
        href: '#/example-entities'
    }
];
```

#### 6. Add Routing (`src/router.js`)
```javascript
// Add routes
const routes = {
    // ... existing routes
    '/example-entities': () => import('./views/example-entities/list.js'),
    '/example-entities/create': () => import('./views/example-entities/create.js'),
    '/example-entities/:id/edit': () => import('./views/example-entities/edit.js')
};
```

## Common Patterns

### Error Handling
```javascript
try {
    const result = await api.createEntity(data);
    showSuccess('Entity created successfully');
    redirectToList();
} catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
        showFieldErrors(error.details);
    } else if (error.code === 'DUPLICATE_ERROR') {
        showError('Entity already exists');
    } else {
        showError('An unexpected error occurred');
    }
}
```

### Loading States
```javascript
async function loadData() {
    setLoading(true);
    try {
        const data = await api.getList();
        setData(data);
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}
```

### Form Validation
```javascript
function validateForm(data) {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (data.name?.length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
```

### Permission Checks
```javascript
function canCreateEntity() {
    return window.currentUser?.hasPermission('create_example_entity') || false;
}

function canEditEntity(entity) {
    return window.currentUser?.hasPermission('update_example_entity') ||
           (window.currentUser?.hasPermission('update_own_example_entity') &&
            entity.createdBy === window.currentUser.id);
}
```

## Backend Integration

### API Endpoints
The frontend expects a RESTful API with the following patterns:
- `GET /api/entities` - List with pagination
- `GET /api/entities/:id` - Get by ID
- `POST /api/entities` - Create
- `PUT /api/entities/:id` - Update
- `DELETE /api/entities/:id` - Delete

### Authentication
- JWT tokens in `Authorization: Bearer <token>` header
- Session cookies for web interface
- Automatic token refresh on expiration

### Multi-Tenant Filtering
All API endpoints automatically filter by `shopId` from user context:
```javascript
// Backend middleware
app.use((req, res, next) => {
    req.shopId = getShopIdFromToken(req);
    next();
});

// Query filtering
const entities = await Entity.findAll({
    where: { shopId: req.shopId }
});
```

## Troubleshooting

### Common Issues

#### 1. API Connection Issues
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check CORS configuration
# Ensure backend allows requests from http://localhost:3000
```

#### 2. Permission Errors
```javascript
// Check user permissions
console.log('Current user:', window.currentUser);
console.log('Permissions:', window.currentUser?.permissions);

// Verify role assignment
const userRole = await api.getUserRole(window.currentUser.roleId);
console.log('Role permissions:', userRole.permissions);
```

#### 3. Shop Context Issues
```javascript
// Check current shop
console.log('Current shop ID:', window.currentShopId);

// Verify shop access
const shops = await api.getShops();
console.log('Available shops:', shops);
```

#### 4. Test Failures
```bash
# Run specific test
npm test -- tests/exampleEntity.test.js

# Debug test
npm test -- --verbose tests/exampleEntity.test.js

# Check coverage
npm run test:coverage
```

### Getting Help

1. **Check Documentation**:
   - `specs/002-implement-more-data/plan.md` - Implementation plan
   - `specs/002-implement-more-data/research.md` - Technical decisions
   - `specs/002-implement-more-data/data-model.md` - Entity schemas

2. **Review Code Examples**:
   - Existing models in `src/models/`
   - Existing views in `src/views/`
   - Existing tests in `tests/`

3. **Ask for Help**:
   - Create an issue in the repository
   - Tag with `question` and `002-implement-more-data`
   - Include error messages and steps to reproduce

## Next Steps

1. **Read the Plan**: Start with `specs/002-implement-more-data/plan.md`
2. **Understand the Architecture**: Review `specs/002-implement-more-data/research.md`
3. **Explore the Codebase**: Look at existing models, views, and tests
4. **Begin Implementation**: Start with Phase 1, Week 2 (User & Shop domain)
5. **Write Tests**: Ensure 80% coverage for all new code

Welcome aboard! The eshop CMS is a comprehensive system that will provide powerful content management capabilities. Let's build something amazing together! 🚀