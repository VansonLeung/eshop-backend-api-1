# API Contracts Summary

The CMS will integrate with the existing eshop backend API at http://localhost:3000/api-docs/

## Key Endpoints for CMS

### Users
- GET /api/User - List users
- POST /api/User - Create user
- GET /api/User/:id - Get user details
- PUT /api/User/:id - Update user
- DELETE /api/User/:id - Delete user

### Products
- GET /api/Product - List products
- POST /api/Product - Create product
- GET /api/Product/:id - Get product details
- PUT /api/Product/:id - Update product
- DELETE /api/Product/:id - Delete product

### Orders
- GET /api/Order - List orders
- POST /api/Order - Create order
- GET /api/Order/:id - Get order details
- PUT /api/Order/:id - Update order
- DELETE /api/Order/:id - Delete order

### Shops
- GET /api/Shop - List shops
- POST /api/Shop - Create shop
- GET /api/Shop/:id - Get shop details
- PUT /api/Shop/:id - Update shop
- DELETE /api/Shop/:id - Delete shop

## Authentication
- Assumes Bearer token or session-based auth
- Handle 401 responses

## Data Formats
- JSON request/response
- Standard REST patterns
