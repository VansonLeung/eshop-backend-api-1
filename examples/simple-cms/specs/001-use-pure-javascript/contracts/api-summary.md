# API Contracts Summary

The CMS integrates with the existing eshop backend API at `http://localhost:3000/api/` to support CRUD operations for Products, Orders, and Users as defined in the feature specification.

## API Response Format

All API responses follow this structure:
```json
{
  "status": 200,
  "success": true,
  "data": [/* array of entities */] | {/* single entity */}
}
```

## CMS-Supported Endpoints

### Products (IN-SCOPE: Full CRUD)
- GET /api/Product - List products (supports SC-002: <2s load time)
- POST /api/Product - Create product (supports FR-001, SC-001: <30s creation)
- GET /api/Product/:id - Get product details (supports FR-003)
- PUT /api/Product/:id - Update product (supports FR-004, SC-005: <5s operation)
- DELETE /api/Product/:id - Delete product (supports FR-005, SC-005: <5s operation)

**Actual Response Fields** (based on current API):
- id: string (UUID)
- seqId: number
- seq: null
- name: string
- desc: string|null (maps to description)
- createdAt: string (ISO date)
- updatedAt: string (ISO date)
- createdBy: null
- updatedBy: null
- isDeleted: boolean
- isDisabled: boolean
- deletedAt: null
- deletedBy: null
- json: null
- baseId: null
- langId: null
- isPublished: null
- publishedAt: null
- publishedBy: null
- revision: null

### Orders (IN-SCOPE: View and Update Status)
- GET /api/Order - List orders (supports SC-003: <2s load time)
- GET /api/Order/:id - Get order details (supports FR-007)
- PUT /api/Order/:id - Update order status (supports FR-008, SC-005: <5s operation)

**Actual Response Fields** (based on current API):
- id: string (UUID)
- status: string (pending/processing/shipped/delivered)
- createdAt: string (ISO date)
- Additional fields may vary

### Users (IN-SCOPE: Full CRUD)
- GET /api/User - List users (supports SC-004: <2s load time)
- POST /api/User - Create user (supports FR-009)
- GET /api/User/:id - Get user details (supports FR-011)
- PUT /api/User/:id - Update user (supports FR-012, SC-005: <5s operation)
- DELETE /api/User/:id - Delete user (supports FR-013, SC-005: <5s operation)

## Out-of-Scope Endpoints

### Shops (OUT-OF-SCOPE for this CMS feature)
- GET /api/Shop - Shop management not included in current CMS scope
- POST /api/Shop - Create shop
- GET /api/Shop/:id - Get shop details
- PUT /api/Shop/:id - Update shop
- DELETE /api/Shop/:id - Delete shop

## Authentication
- Assumes manager is pre-authenticated via session or token
- Handle 401 responses by redirecting to login page
- No explicit authentication endpoints used in CMS

## Data Formats
- JSON request/response bodies
- Standard REST patterns (GET, POST, PUT, DELETE)
- Error responses return appropriate HTTP status codes

## Error Handling
- Network failures fall back to mock data for development
- API errors display user-friendly messages (supports FR-017)
- 401 errors redirect to login
- 404/5xx errors may return mock data in development mode
- Loading indicators during operations (supports SC-006)
