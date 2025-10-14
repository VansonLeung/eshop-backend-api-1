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

**Note**: This CMS focuses on CRUD operations for the following core entities. Other entities listed below are part of the broader eshop system but out-of-scope for this feature.

- **User**: Represents system users with authentication and profile information. (IN-SCOPE for CRUD)
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
- **Shop**: Represents an e-commerce shop/store.
- **ShopOwnerMapping**: Links shops to their owners.
- **ShopProductMapping**: Links shops to their products.
- **ShopProductTypeMapping**: Links shops to product types.
- **ShopOrderMapping**: Links shops to orders.
- **Product**: Represents items for sale with attributes like name, description, price. (IN-SCOPE for CRUD)
- **ProductType**: Categorizes products (e.g., electronics, clothing).
- **ProductVariableField**: Defines custom fields for products.
- **ProductVariableFieldValue**: Stores values for custom product fields.
- **ProductVariant**: Represents product variations (e.g., size, color).
- **ProductVariantVarMapping**: Links product variants to their mappings.
- **ProductTypeProductMapping**: Links product types to products.
- **Lang**: Represents supported languages for localization.
- **Post**: Represents blog posts or content articles.
- **PostType**: Categorizes posts (e.g., blog, news).
- **PostTypePostMapping**: Links post types to posts.
- **Order**: Represents customer purchases with items, status, billing, shipping. (IN-SCOPE for view/update status)
- **OrderItem**: Represents individual items within an order.
- **OrderBilling**: Stores billing information for orders.
- **OrderShipping**: Stores shipping information for orders.
- **OrderPayment**: Stores payment information for orders.
- **OrderInvoice**: Represents invoices for orders.
- **OrderStatus**: Tracks the status of orders.
- **OrderItemStatus**: Tracks the status of individual order items.
- **CustomerOrderMapping**: Links customers to their orders.
- **Shop**: Represents the eshop entity that owns products and orders. (OUT-OF-SCOPE for this CMS feature)

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
