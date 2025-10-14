# Feature Specification: Eshop CMS

**Feature Branch**: `001-use-pure-javascript`  
**Created**: 2025-10-14  
**Status**: Draft  
**Input**: User description: "use pure javascript / HTML / css to build a CMS to support CRUD of a eshop manager."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Products (Priority: P1)

As an eshop manager, I want to perform CRUD operations on products so that I can maintain the product catalog.

**Why this priority**: Product management is core to the eshop functionality and directly impacts sales.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting products, delivering value in catalog management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new product with name, description, and price, **Then** the product appears in the product list.
2. **Given** a product exists, **When** the manager views the product details, **Then** all product information is displayed.
3. **Given** a product exists, **When** the manager updates the product details, **Then** the changes are saved and reflected.
4. **Given** a product exists, **When** the manager deletes the product, **Then** the product is removed from the catalog.

---

### User Story 2 - Manage Orders (Priority: P2)

As an eshop manager, I want to view and update order status so that I can process customer orders.

**Why this priority**: Order management is essential for fulfilling customer purchases and tracking business performance.

**Independent Test**: Can be fully tested by viewing order list, updating order status, delivering value in order fulfillment.

**Acceptance Scenarios**:

1. **Given** orders exist, **When** the manager views the order list, **Then** all orders with status are displayed.
2. **Given** an order exists, **When** the manager views order details, **Then** order items, customer info, and status are shown.
3. **Given** an order exists, **When** the manager updates the order status, **Then** the status change is saved.

---

### User Story 3 - Manage Users (Priority: P3)

As an eshop manager, I want to perform CRUD operations on users so that I can manage customer accounts.

**Why this priority**: User management supports customer service and account administration.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting users, delivering value in customer management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new user account, **Then** the user appears in the user list.
2. **Given** a user exists, **When** the manager views user details, **Then** user information is displayed.
3. **Given** a user exists, **When** the manager updates user details, **Then** the changes are saved.
4. **Given** a user exists, **When** the manager deletes the user, **Then** the user is removed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow managers to create new products with name, description, price, and type.
- **FR-002**: System MUST allow managers to view a list of all products.
- **FR-003**: System MUST allow managers to view detailed information for a specific product.
- **FR-004**: System MUST allow managers to update product information.
- **FR-005**: System MUST allow managers to delete products.
- **FR-006**: System MUST allow managers to view a list of all orders.
- **FR-007**: System MUST allow managers to view detailed information for a specific order including items and status.
- **FR-008**: System MUST allow managers to update order status.
- **FR-009**: System MUST allow managers to create new user accounts.
- **FR-010**: System MUST allow managers to view a list of all users.
- **FR-011**: System MUST allow managers to view detailed information for a specific user.
- **FR-012**: System MUST allow managers to update user information.
- **FR-013**: System MUST allow managers to delete user accounts.
- **FR-014**: System MUST provide a consistent UI using UIKit components.
- **FR-015**: System MUST be built with pure JavaScript, HTML, and CSS without external frameworks except UIKit.
- **FR-016**: System MUST use sidebar navigation with collapsible menu for accessing different entity management sections.
- **FR-017**: System MUST display loading spinners during data fetching and show user-friendly error messages for API failures.### Key Entities *(include if feature involves data)*

#### Core User Management Entities
- **User**: Represents system users with authentication and profile information.
- **UserRole**: Defines roles for users (e.g., admin, manager, customer).
- **UserPermission**: Defines specific permissions that can be assigned to roles.
- **UserRolePermissionMapping**: Links roles to permissions.
- **UserCredential**: Stores user authentication credentials.
- **UserSession**: Tracks active user sessions.
- **UserContact**: Stores user contact information.
- **UserShipping**: Stores user shipping addresses.
- **UserBilling**: Stores user billing information.
- **UserPayment**: Stores user payment methods.
- **UserCartItem**: Represents items in a user's shopping cart.

#### Shop Management Entities
- **Shop**: Represents an e-commerce shop/store.
- **ShopOwnerMapping**: Links shops to their owners.
- **ShopProductMapping**: Links shops to their products.
- **ShopProductTypeMapping**: Links shops to product types.
- **ShopOrderMapping**: Links shops to orders.

#### Product Management Entities (Complete ProductVariant System)

**Core Product Entities:**
- **Product**: Base product entity with standard attributes (name, description, price, etc.).
- **ProductType**: Categorizes products (e.g., electronics, clothing) with hierarchical support via parentId.
- **ProductTypeProductMapping**: Links products to their product types (many-to-many relationship).

**ProductVariant System (Complex Product Configurations):**
- **ProductVariableField**: Defines custom variable fields for products (e.g., "Size", "Color", "Material").
  - Linked to specific products (productId).
- **ProductVariableFieldValue**: Stores possible values for variable fields (e.g., "Small", "Medium", "Large" for Size field).
  - Linked to ProductVariableField (productVariableFieldId).
- **ProductVariant**: Represents specific product variations with unique SKU, price, and inventory.
  - Contains: productId, sku, price, quantity, name, description.
  - Each variant represents a unique combination of variable field values.
- **ProductVariantVarMapping**: Junction table linking ProductVariants to ProductVariableFieldValues.
  - Defines which values make up each variant (e.g., "Large" + "Red" = "Red Large T-Shirt").

**ProductVariant Relationships:**
```
Product (1) ────→ (N) ProductVariableField
    │                      │
    │                      │
    └───→ (N) ProductVariant ←─── (N) ProductVariantVarMapping
           │                                      │
           │                                      │
           └───→ (1) OrderItem                    └───→ (1) ProductVariableFieldValue
```

**Example ProductVariant Configuration:**
For a T-Shirt product with Size and Color variants:
- ProductVariableField: "Size", "Color"
- ProductVariableFieldValue: "Small", "Medium", "Large" (Size); "Red", "Blue", "Green" (Color)
- ProductVariant: "Red Medium T-Shirt" (SKU: "TS-RM-001", price: $19.99, qty: 25)
- ProductVariantVarMapping: Links variant to "Medium" and "Red" values

#### Order Management Entities
- **Order**: Represents customer purchases with status, dates, and customer information.
- **OrderItem**: Individual items within orders, linking to both Product and ProductVariant.
- **OrderBilling**: Billing information for orders.
- **OrderShipping**: Shipping information for orders.
- **OrderPayment**: Payment information for orders.
- **OrderInvoice**: Invoices for orders.
- **OrderStatus**: Order status tracking.
- **OrderItemStatus**: Individual order item status tracking.
- **CustomerOrderMapping**: Links customers to their orders.

#### Content Management Entities
- **Lang**: Supported languages for localization.
- **Post**: Blog posts or content articles.
- **PostType**: Categorizes posts (e.g., blog, news).
- **PostTypePostMapping**: Links post types to posts.

### Data Model Relationships *(ER Diagram)*

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│     Shop        │     │ ShopProductMapping  │     │    Product      │
│                 │     │                     │     │                 │
│ • id            │◄────┤ • shopId            │────►│ • id            │
│ • name          │     │ • productId         │     │ • name          │
│ • desc          │     └─────────────────────┘     │ • desc          │
│ • ...           │                                 │ • json          │
└─────────────────┘                                 │ • ...           │
                                                   └─────────────────┘
                                                            │
                                                            │ 1:N
                                                            ▼
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  ProductType    │     │ProductTypeProduct- │     │ProductVariable- │
│                 │     │      Mapping       │     │     Field       │
│ • id            │◄────┤ • productTypeId    │     │                 │
│ • name          │     │ • productId        │     │ • id            │
│ • desc          │     └─────────────────────┘     │ • name          │
│ • parentId      │                                 │ • productId     │
└─────────────────┘                                 │ • desc          │
         ▲                                         │ • ...           │
         │                                         └─────────────────┘
         │ 1:N                                              │
         │                                                  │ 1:N
┌─────────────────┐     ┌─────────────────────┐            ▼
│ShopProductType- │     │                     │     ┌─────────────────┐
│    Mapping      │     │                     │     │ProductVariable- │
│                 │     │                     │     │ FieldValue      │
│ • shopId        │────►│                     │     │                 │
│ • productTypeId │     │                     │     │ • id            │
└─────────────────┘     │                     │     │ • name          │
                        │                     │     │ • productVar-   │
                        │                     │     │   iableFieldId  │
                        │                     │     │ • desc          │
                        │                     │     │ • ...           │
                        │                     │     └─────────────────┘
                        │                     │             │
                        │                     │             │ 1:N
                        │                     │             ▼
                        └─────────────────────┘     ┌─────────────────┐
                                                     │ProductVariant- │
                                                     │ VarMapping     │
                                                     │                │
                                                     │ • variantId    │
                                                     │ • variableField│
                                                     │   ValueId      │
                                                     └─────────────────┘
                                                               ▲
                                                               │
                                                               │ 1:N
┌─────────────────┐     ┌─────────────────────┐            ▼
│  ProductVariant │     │                     │     ┌─────────────────┐
│                 │     │                     │     │   OrderItem     │
│ • id            │◄────┤ • productVariantId  │◄────┤ • id            │
│ • productId     │     │ • productId         │     │ • orderId       │
│ • sku           │     │ • orderedItemPrice  │     │ • productId     │
│ • price         │     │ • orderedItemQty    │     │ • productVar-   │
│ • quantity      │     └─────────────────────┘     │   iantId        │
│ • name          │                                 │ • ...           │
│ • desc          │                                 └─────────────────┘
│ • ...           │                                         │
└─────────────────┘                                         │
                                                            │ 1:N
                                                            ▼
                                                     ┌─────────────────┐
                                                     │     Order       │
                                                     │                 │
                                                     │ • id            │
                                                     │ • customerId    │
                                                     │ • orderStatus   │
                                                     │ • orderDate     │
                                                     │ • ...           │
                                                     └─────────────────┘
```

### ProductVariant System Architecture

**Key Relationships:**
1. **Product → ProductVariant** (1:N): Each product can have multiple variants
2. **ProductVariant → ProductVariantVarMapping** (1:N): Each variant is defined by multiple variable field combinations
3. **ProductVariantVarMapping → ProductVariableFieldValue** (N:1): Links variants to specific values
4. **ProductVariableFieldValue → ProductVariableField** (N:1): Values belong to specific variable fields
5. **Product → ProductVariableField** (1:N): Products define their own variable fields
6. **OrderItem → ProductVariant** (N:1): Order items reference specific product variants

**Business Logic:**
- Products can be simple (no variants) or complex (with variants)
- ProductVariant represents a unique combination of ProductVariableFieldValues
- Each ProductVariant has its own SKU, price, and inventory quantity
- OrderItem references both Product and ProductVariant for complete item specification

### ProductVariant Schema Details

**ProductVariant Entity:**
```json
{
  "type": "object",
  "properties": {
    "id": {"type": "string"},
    "productId": {"type": "string"},
    "sku": {"type": "string"},
    "price": {"type": "number", "format": "double"},
    "quantity": {"type": "integer"},
    "name": {"type": "string"},
    "desc": {"type": "string"},
    "json": {"type": "object"},
    "createdAt": {"type": "string", "format": "date-time"},
    "updatedAt": {"type": "string", "format": "date-time"},
    "createdBy": {"type": "string"},
    "updatedBy": {"type": "string"}
  }
}
```

**ProductVariantVarMapping Entity:**
```json
{
  "type": "object",
  "properties": {
    "variantId": {"type": "string"},
    "variableFieldValueId": {"type": "string"},
    "createdAt": {"type": "string", "format": "date-time"},
    "updatedAt": {"type": "string", "format": "date-time"}
  }
}
```

**Example Implementation:**
For a T-Shirt with Size and Color variants:
- **ProductVariableField**: [{"name": "Size"}, {"name": "Color"}]
- **ProductVariableFieldValue**: [{"name": "Small"}, {"name": "Medium"}, {"name": "Red"}, {"name": "Blue"}]
- **ProductVariant**: {"sku": "TS-RM-001", "name": "Red Medium T-Shirt", "price": 19.99, "quantity": 25}
- **ProductVariantVarMapping**: Links variant to "Medium" and "Red" values

**Note**: This comprehensive ProductVariant system documentation was derived from analysis of the API specification in `.references/swagger.json` and represents the complete backend data model beyond the current frontend CMS implementation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Managers can create a new product in under 30 seconds.
- **SC-002**: Product list loads in under 2 seconds for up to 1000 products.
- **SC-003**: Order list loads in under 2 seconds for up to 500 orders.
- **SC-004**: User list loads in under 2 seconds for up to 1000 users.
- **SC-005**: CRUD operations complete in under 5 seconds each.
- **SC-006**: UI remains responsive during data loading with loading indicators.
- **SC-007**: 95% of managers complete primary tasks (create product, update order) successfully on first attempt.

## Clarifications

### Session 2025-10-14

- Q: Which entities should the CMS support CRUD operations for? → A: C
- Q: What navigation structure should the CMS use? → A: A
- Q: How should the CMS handle loading states and error messages? → A: A
