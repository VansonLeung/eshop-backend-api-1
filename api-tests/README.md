# API CRUD Tests

This directory contains API test files for testing CRUD operations on the main models.

## Test Files

- **test-product.js** - Tests Product model CRUD operations
- **test-order.js** - Tests Order model CRUD operations
- **test-user.js** - Tests User model CRUD operations
- **test-shop.js** - Tests Shop model CRUD operations
- **run-all.js** - Runs all test files sequentially

## Running Tests

### Prerequisites

Make sure the server is running:
```bash
npm run dev
```

### Run Individual Tests

```bash
# Test Product CRUD
node api-tests/test-product.js

# Test Order CRUD
node api-tests/test-order.js

# Test User CRUD
node api-tests/test-user.js

# Test Shop CRUD
node api-tests/test-shop.js
```

### Run All Tests

```bash
node api-tests/run-all.js
```

## Test Coverage

Each test file covers:

1. **CREATE** - POST /api/{Model}
2. **READ ALL** - GET /api/{Model}
3. **READ ONE** - GET /api/{Model}/:id
4. **UPDATE** - PUT /api/{Model}/:id
5. **DELETE** - DELETE /api/{Model}/:id
6. **Query Features** - Filtering, sorting, pagination, counting

## Expected Output

Each test will display:
- Test step number and description
- HTTP response status
- Relevant data (IDs, counts, values)
- Pass/fail indicators

Example:
```
=== Testing Product CRUD Operations ===

1. Testing CREATE Product...
   Status: 201
   Created Product ID: 123
   ✓ CREATE passed

2. Testing READ All Products...
   Status: 200
   Products count: 5
   ✓ READ ALL passed

...
```

## Notes

- Tests create temporary data and clean up after themselves
- Each test is independent and can run in isolation
- Server must be running on http://localhost:3000
- Tests use unique identifiers (timestamps) to avoid conflicts
