# Data Model: Eshop CMS

## Feature Scope

**CMS Focus**: This feature implements CRUD operations for Products, Orders, and Users only.
- **IN-SCOPE**: Product CRUD, Order view/update status, User CRUD
- **OUT-OF-SCOPE**: Shop management, complex entity relationships, advanced features

## Implementation Notes

**Frontend Architecture**: Pure JavaScript/HTML/CSS with UIKit 3.x for UI components (FR-015)
**API Integration**: Native fetch API for HTTP requests, no external libraries
**Authentication**: Assumes pre-authenticated manager, handles 401 redirects
**Data Management**: In-memory state for forms, fetch from API on load
**Error Handling**: User-friendly messages with retry options (FR-017, SC-006)
**Navigation**: Sidebar navigation with collapsible menu (FR-016)
**Performance**: Sub-2 second load times, sub-5 second operations (SC-002, SC-003, SC-004, SC-005)

## Complete Eshop System Entities

### User Management Domain

#### User
**Purpose**: Core user accounts supporting FR-009 through FR-013
**Actual API Fields** (from /api/User):
- id: string (UUID) - Primary identifier
- email: string - User email address
- role: string - User role (e.g., "customer")
- Additional fields may include firstName/lastName but not present in current data

#### UserRole
**Purpose**: Role definitions for access control
- id: string
- name: string (admin, manager, customer)
- description: string

#### UserPermission
**Purpose**: Individual permissions that can be assigned
- id: string
- name: string
- description: string

#### UserRolePermissionMapping
**Purpose**: Links roles to permissions
- roleId: string (foreign key to UserRole)
- permissionId: string (foreign key to UserPermission)

#### UserCredential
**Purpose**: Authentication credentials storage
- userId: string (foreign key to User)
- passwordHash: string
- salt: string
- createdAt: date

#### UserSession
**Purpose**: Active session tracking
- id: string
- userId: string (foreign key to User)
- token: string
- expiresAt: date
- createdAt: date

#### UserContact
**Purpose**: User contact information
- userId: string (foreign key to User)
- type: string (email, phone, address)
- value: string
- isPrimary: boolean

#### UserShipping
**Purpose**: Shipping addresses
- userId: string (foreign key to User)
- name: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string

#### UserBilling
**Purpose**: Billing addresses
- userId: string (foreign key to User)
- name: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string

#### UserPayment
**Purpose**: Payment methods
- userId: string (foreign key to User)
- type: string (credit_card, paypal)
- provider: string
- accountNumber: string (masked)
- expiryDate: date

#### UserCartItem
**Purpose**: Shopping cart contents
- userId: string (foreign key to User)
- productId: string (foreign key to Product)
- quantity: number
- addedAt: date

### Shop Management Domain

#### Shop
**Purpose**: E-commerce shop/store entities
- id: string
- name: string
- description: string
- ownerId: string (foreign key to User)
- createdAt: date

#### ShopOwnerMapping
**Purpose**: Links shops to owners
- shopId: string (foreign key to Shop)
- userId: string (foreign key to User)

#### ShopProductMapping
**Purpose**: Links shops to their products
- shopId: string (foreign key to Shop)
- productId: string (foreign key to Product)

#### ShopProductTypeMapping
**Purpose**: Links shops to product categories
- shopId: string (foreign key to Shop)
- productTypeId: string (foreign key to ProductType)

#### ShopOrderMapping
**Purpose**: Links shops to orders
- shopId: string (foreign key to Shop)
- orderId: string (foreign key to Order)

### Product Management Domain

#### Product
**Purpose**: Core product catalog supporting FR-001 through FR-005
**Actual API Fields** (from /api/Product):
- id: string (UUID) - Primary identifier
- seqId: number - Sequential ID
- seq: null - Reserved field
- name: string - Product name
- desc: string|null - Description (maps to 'description' in frontend)
- createdAt: string - ISO 8601 timestamp
- updatedAt: string - ISO 8601 timestamp
- createdBy: null - Audit field
- updatedBy: null - Audit field
- isDeleted: boolean - Soft delete flag
- isDisabled: boolean - Active/inactive flag
- deletedAt: null|string - Deletion timestamp
- deletedBy: null - Deletion user
- json: null - Extended data field
- baseId: null - Base entity reference
- langId: null - Language reference
- isPublished: null|boolean - Publication status
- publishedAt: null|string - Publication timestamp
- publishedBy: null - Publication user
- revision: null|number - Version control

#### ProductType
**Purpose**: Product categorization
- id: string
- name: string (electronics, clothing)
- description: string
- parentId: string (self-referencing for hierarchy)

#### ProductVariableField
**Purpose**: Custom product attributes
- id: string
- productTypeId: string (foreign key to ProductType)
- name: string
- type: string (text, number, boolean)
- required: boolean

#### ProductVariableFieldValue
**Purpose**: Values for custom product fields
- productId: string (foreign key to Product)
- fieldId: string (foreign key to ProductVariableField)
- value: string

#### ProductVariant
**Purpose**: Product variations (size, color, etc.)
- id: string
- productId: string (foreign key to Product)
- name: string (Size, Color)
- value: string (Large, Red)

#### ProductVariantVarMapping
**Purpose**: Links product variants
- variantId: string (foreign key to ProductVariant)
- relatedVariantId: string (foreign key to ProductVariant)

#### ProductTypeProductMapping
**Purpose**: Links products to categories
- productId: string (foreign key to Product)
- productTypeId: string (foreign key to ProductType)

### Content Management Domain

#### Lang
**Purpose**: Supported languages for localization
- id: string
- code: string (en, zh, ms)
- name: string (English, Chinese, Malay)
- isActive: boolean

#### Post
**Purpose**: Blog posts and content articles
- id: string
- title: string
- content: string
- authorId: string (foreign key to User)
- publishedAt: date
- status: string (draft, published)

#### PostType
**Purpose**: Content categorization
- id: string
- name: string (blog, news, announcement)
- description: string

#### PostTypePostMapping
**Purpose**: Links posts to categories
- postId: string (foreign key to Post)
- postTypeId: string (foreign key to PostType)

### Order Management Domain

#### Order
**Purpose**: Customer purchases supporting FR-006 through FR-008
**Actual API Fields** (from /api/Order):
- id: string (UUID) - Primary identifier
- status: string - Order status (pending/processing/shipped/delivered)
- createdAt: string - ISO 8601 timestamp
- Additional fields vary by implementation

#### OrderItem
**Purpose**: Individual items within orders
- orderId: string (foreign key to Order)
- productId: string (foreign key to Product)
- quantity: number
- unitPrice: number
- totalPrice: number

#### OrderBilling
**Purpose**: Billing information for orders
- orderId: string (foreign key to Order)
- name: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string

#### OrderShipping
**Purpose**: Shipping information for orders
- orderId: string (foreign key to Order)
- name: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string

#### OrderPayment
**Purpose**: Payment information for orders
- orderId: string (foreign key to Order)
- method: string
- amount: number
- status: string (pending, completed, failed)
- transactionId: string

#### OrderInvoice
**Purpose**: Invoice records for orders
- orderId: string (foreign key to Order)
- invoiceNumber: string
- issuedAt: date
- dueDate: date
- status: string

#### OrderStatus
**Purpose**: Order status tracking
- orderId: string (foreign key to Order)
- status: string
- changedAt: date
- changedBy: string (foreign key to User)

#### OrderItemStatus
**Purpose**: Individual item status tracking
- orderItemId: string (foreign key to OrderItem)
- status: string
- changedAt: date

#### CustomerOrderMapping
**Purpose**: Links customers to their orders
- userId: string (foreign key to User)
- orderId: string (foreign key to Order)

## Frontend Data Models (CMS Implementation)

### Product Model
```javascript
{
  id: string,
  name: string,
  description: string, // Maps from API 'desc'
  price: number,       // Not provided by current API
  sku: string,         // Not provided by current API
  typeId: string,
  createdAt: string,
  updatedAt: string
}
```

### Order Model
```javascript
{
  id: string,
  userId: string,      // Not provided by current API
  status: string,
  total: number,       // Not provided by current API
  createdAt: string,
  updatedAt: string
}
```

## Validation Rules
- **Name**: required, max 255 characters (Product.name)
- **Status**: one of ['pending', 'processing', 'shipped', 'delivered'] (Order.status)
- **Price**: positive number when provided (Product.price)
- **Email**: valid format when provided (User.email)
- **Role**: one of ['admin', 'manager', 'customer'] when provided (User.role)

## State Transitions
- **Order status**: pending → processing → shipped → delivered (supports FR-008)

## API Response Wrapper
All API responses are wrapped in:
```json
{
  "status": number,
  "success": boolean,
  "data": array|object
}
```

## Development Considerations
- Mock data fallback for network failures during development
- In-memory form state management (no external state libraries)
- UIKit CSS framework for responsive UI components (FR-014)
- Native fetch API for all HTTP requests
- Hash-based routing for navigation (#products, #orders, #users)
- Jest testing framework with coverage reporting
