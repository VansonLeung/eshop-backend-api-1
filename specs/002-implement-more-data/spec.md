# Feature Specification: Implement More Data Models for CMS

**Feature Branch**: `002-implement-more-data`  
**Created**: 2025-10-15  
**Status**: Specification Massively Expanded - Comprehensive Replanning Required  
**Input**: User description: "implement more data models for CMS, add as many entities as possible - comprehensive eshop management system"

## Clarifications

**Q1: Entity Integration & Relationships** → **A: Foreign key relationships** - New entities should have foreign key relationships with existing entities (Products.typeId → ProductType.id, Users.roleId → UserRole.id, etc.)

**Q2: ProductType Hierarchy Implementation** → **A: Unlimited depth, dropdown selector** - ProductType supports unlimited nesting depth with parent selection dropdown

**Q3: Shop Multi-Tenancy Model** → **A: Multi-tenant** - Shop entities implement multi-tenant architecture with shop-scoped data isolation

**Q4: UserRole Permission System** → **A: Yes** - UserRole entities have associated permission lists (create_product, delete_order, etc.)

**Q5: Edge Case Deletion Behavior** → **A: Cascade delete** - System implements cascade delete for entity dependencies

### Session 2025-10-15

- Q: What are the specific fields and data types for each new entity (ProductType, UserRole, Post, Shop, Lang)? → A: Define field schemas
- Q: What are the validation rules for each entity field (required, length limits, formats)? → A: Define validation constraints
- Q: What specific permissions should the UserRole system support? → A: Define permission list
- Q: How should the permission system integrate with existing UI access control? → A: Define permission enforcement
- Q: What are the API field mappings for the new entities? → A: Define API integration details

### Session 2025-10-16

- Q: Which additional entities should be brought into CMS scope for management? → A: Expand scope significantly
- Q: Should we include comprehensive user management entities (shipping, billing, payment, sessions)? → A: Yes, full user management
- Q: Should we include advanced product entities (variable fields, product mappings)? → A: Yes, advanced product features
- Q: Should we include complete order lifecycle entities (billing, shipping, payment, invoices)? → A: Yes, complete order management
- Q: Should we include shop management entities (owner mapping, product/order mapping)? → A: Yes, multi-shop support
- Q: Should the spec include the missing mapping/junction entities for many-to-many relationships? → A: Yes - Include all mapping entities (ShopProductMapping, ProductTypeProductMapping, ShopProductTypeMapping, ProductVariableFieldValue, ProductVariantVarMapping) for proper M:N relationships
- Q: How should managers interact with mapping/junction entities in the CMS UI? → A: Indirect only - Manage mappings through parent entities (e.g., assign product types when editing a product, assign products when editing a shop). Hide mapping tables from direct UI access.
- Q: What entity should ProductVariableField be linked to? → A: Product - Each product defines its own unique variable fields (productId foreign key)
- Q: How should ProductVariantVarMapping records be created? → A: Manual - Managers explicitly create ProductVariantVarMapping records to link variants to field values (more control but error-prone)
- Q: Should mapping entities have unique constraints on their foreign key combinations? → A: Composite unique - Enforce unique constraints on foreign key pairs (e.g., shopId + productId must be unique in ShopProductMapping) to prevent duplicates

## Planning Complete

**Implementation Plan**: `plan.md` - 8-week phased approach with risk mitigation (maximum scope expansion)
**Task Breakdown**: `tasks.md` - 80+ detailed tasks with dependencies and quality gates (needs comprehensive update)
**Data Model Validation**: Completed comprehensive field definitions, validation rules, permissions, and API mappings per data-model.md checklist for 23 entities (18 direct + 5 mapping)
**Scope Expansion**: Massive expansion from 5 to 23 entities - added comprehensive user management (shipping, billing, sessions, credentials, contacts), advanced product features (variants, variable fields, field values, variant-to-value mappings), complete order lifecycle (billing, shipping, payments), multi-shop support (owner mappings, shop-product mappings, shop-type mappings, product-type mappings)
**Mapping Entity Strategy**: All mapping/junction entities managed indirectly through parent entity interfaces (hidden from direct UI access) with composite unique constraints to prevent duplicates
**Coverage**: Now includes all major eshop system domains - User Management, Product Management, Order Management, Content Management, and Shop Management with proper many-to-many relationship support
**Next Steps**: Complete replan for 8-week timeline with 80+ tasks covering all 23 entities, then begin Phase 1 implementation

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Product Categories (Priority: P1)

As an eshop manager, I want to create and manage product categories so that I can organize products into logical groups for better navigation and search.

**Why this priority**: Product categorization is fundamental to e-commerce organization and directly impacts user experience and product discoverability.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting product categories, delivering value in product organization.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new product category with name and description, **Then** the category appears in the category list.
2. **Given** a product category exists, **When** the manager views the category details, **Then** all category information is displayed.
3. **Given** a product category exists, **When** the manager updates the category details, **Then** the changes are saved and reflected.
4. **Given** a product category exists, **When** the manager deletes the category, **Then** the category and all associated products are removed from the system.
5. **Given** the manager is creating a category, **When** they select a parent category, **Then** the category becomes a child in the hierarchy with unlimited nesting depth.

---

### User Story 2 - Manage User Roles (Priority: P1)

As an eshop manager, I want to create and manage user roles so that I can control access permissions and responsibilities within the system.

**Why this priority**: Role-based access control is essential for system security and proper user management.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting user roles, delivering value in access control management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new user role with name and description, **Then** the role appears in the role list.
2. **Given** a user role exists, **When** the manager views the role details, **Then** all role information is displayed.
3. **Given** a user role exists, **When** the manager updates the role details, **Then** the changes are saved and reflected.
4. **Given** a user role exists, **When** the manager deletes the role, **Then** the role and all associated users are removed from the system.
5. **Given** a user role exists, **When** the manager assigns permissions to the role, **Then** the permissions are saved and applied to users with that role.

---

### User Story 3 - Manage Content Posts (Priority: P2)

As an eshop manager, I want to create and manage blog posts and content so that I can publish news, announcements, and marketing content.

**Why this priority**: Content management enables marketing and communication capabilities for the eshop.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting content posts, delivering value in content publishing.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new post with title and content, **Then** the post appears in the post list.
2. **Given** a post exists, **When** the manager views the post details, **Then** all post information including content is displayed.
3. **Given** a post exists, **When** the manager updates the post details, **Then** the changes are saved and reflected.
4. **Given** a post exists, **When** the manager deletes the post, **Then** the post is removed from the system.

---

### User Story 4 - Manage Shops (Priority: P2)

As an eshop manager, I want to create and manage multiple shops so that I can support multi-shop operations or different business units.

**Why this priority**: Multi-shop support enables business expansion and segmentation.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting shops, delivering value in multi-shop management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new shop with name and description, **Then** the shop appears in the shop list.
2. **Given** a shop exists, **When** the manager views the shop details, **Then** all shop information is displayed.
3. **Given** a shop exists, **When** the manager updates the shop details, **Then** the changes are saved and reflected.
4. **Given** a shop exists, **When** the manager deletes the shop, **Then** the shop and all associated products, orders, and users are removed from the system.
5. **Given** multiple shops exist, **When** the manager switches between shops, **Then** only data belonging to the selected shop is displayed.

---

### User Story 6 - Manage User Credentials (Priority: P2)

As an eshop manager, I want to manage user authentication credentials so that I can handle password resets and account security.

**Why this priority**: User credential management is essential for account security and password reset functionality.

**Independent Test**: Can be fully tested by viewing and updating user credentials, delivering value in account security management.

**Acceptance Scenarios**:

1. **Given** a user exists, **When** the manager views the user credentials, **Then** credential information is displayed (without exposing passwords).
2. **Given** a user needs a password reset, **When** the manager initiates credential reset, **Then** the reset process is triggered.
3. **Given** user credentials exist, **When** the manager updates credential settings, **Then** the changes are saved and applied.

---

### User Story 7 - Manage User Contact Information (Priority: P2)

As an eshop manager, I want to manage user contact details so that I can maintain accurate customer communication information.

**Why this priority**: Contact information management supports customer service and communication needs.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting user contacts, delivering value in customer data management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create contact information for a user, **Then** the contact appears in the user profile.
2. **Given** user contact information exists, **When** the manager views the contact details, **Then** all contact information is displayed.
3. **Given** user contact information exists, **When** the manager updates the contact details, **Then** the changes are saved and reflected.
4. **Given** user contact information exists, **When** the manager deletes the contact, **Then** the contact is removed from the user profile.

---

### User Story 8 - Manage Product Variants (Priority: P1)

As an eshop manager, I want to create and manage product variations so that I can offer products in different sizes, colors, and configurations.

**Why this priority**: Product variants are crucial for e-commerce product offerings and inventory management.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting product variants, delivering value in product catalog expansion.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new product variant, **Then** the variant appears in the product variant list.
2. **Given** a product variant exists, **When** the manager views the variant details, **Then** all variant information is displayed.
3. **Given** a product variant exists, **When** the manager updates the variant details, **Then** the changes are saved and reflected.
4. **Given** a product variant exists, **When** the manager deletes the variant, **Then** the variant is removed from the system.

---

### User Story 9 - Manage Order Items (Priority: P1)

As an eshop manager, I want to view and manage individual order line items so that I can track product quantities and pricing within orders.

**Why this priority**: Order item management is essential for order processing and inventory tracking.

**Independent Test**: Can be fully tested by viewing order items and updating item status, delivering value in order fulfillment.

**Acceptance Scenarios**:

1. **Given** an order exists, **When** the manager views the order items, **Then** all items with quantities and prices are displayed.
2. **Given** an order item exists, **When** the manager views item details, **Then** product information, quantity, and pricing are shown.
3. **Given** an order item exists, **When** the manager updates the item status, **Then** the status change is saved.

---

### User Story 10 - Manage Content Categories (Priority: P3)

As an eshop manager, I want to create and manage content categories so that I can organize posts into logical groups for better content navigation.

**Why this priority**: Content categorization enables better content organization and discoverability.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting content categories, delivering value in content management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a new content category, **Then** the category appears in the category list.
2. **Given** a content category exists, **When** the manager views the category details, **Then** all category information is displayed.
3. **Given** a content category exists, **When** the manager updates the category details, **Then** the changes are saved and reflected.
4. **Given** a content category exists, **When** the manager deletes the category, **Then** the category is removed from the system.

---

### User Story 11 - Manage User Shipping Addresses (Priority: P2)

As an eshop manager, I want to manage customer shipping addresses so that I can maintain accurate delivery information for order fulfillment.

**Why this priority**: Shipping address management is critical for order delivery and customer service.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting shipping addresses, delivering value in delivery management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a shipping address for a user, **Then** the address appears in the user profile.
2. **Given** a shipping address exists, **When** the manager views the address details, **Then** all address information is displayed.
3. **Given** a shipping address exists, **When** the manager updates the address details, **Then** the changes are saved and reflected.
4. **Given** a shipping address exists, **When** the manager deletes the address, **Then** the address is removed from the user profile.

---

### User Story 12 - Manage User Billing Addresses (Priority: P2)

As an eshop manager, I want to manage customer billing addresses so that I can maintain accurate payment information.

**Why this priority**: Billing address management supports payment processing and financial operations.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting billing addresses, delivering value in payment management.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a billing address for a user, **Then** the address appears in the user profile.
2. **Given** a billing address exists, **When** the manager views the address details, **Then** all address information is displayed.
3. **Given** a billing address exists, **When** the manager updates the address details, **Then** the changes are saved and reflected.
4. **Given** a billing address exists, **When** the manager deletes the address, **Then** the address is removed from the user profile.

---

### User Story 13 - Manage Order Billing Information (Priority: P1)

As an eshop manager, I want to view and manage order billing information so that I can handle payment-related inquiries.

**Why this priority**: Order billing management is essential for financial operations and customer support.

**Independent Test**: Can be fully tested by viewing and updating order billing details, delivering value in payment management.

**Acceptance Scenarios**:

1. **Given** an order exists, **When** the manager views the billing information, **Then** all billing details are displayed.
2. **Given** order billing information exists, **When** the manager updates the billing details, **Then** the changes are saved.

---

### User Story 14 - Manage Order Shipping Information (Priority: P1)

As an eshop manager, I want to view and manage order shipping information so that I can track deliveries and handle shipping inquiries.

**Why this priority**: Order shipping management is critical for delivery operations and customer satisfaction.

**Independent Test**: Can be fully tested by viewing and updating order shipping details, delivering value in delivery management.

**Acceptance Scenarios**:

1. **Given** an order exists, **When** the manager views the shipping information, **Then** all shipping details are displayed.
2. **Given** order shipping information exists, **When** the manager updates the shipping details, **Then** the changes are saved.

---

### User Story 15 - Manage Order Payments (Priority: P1)

As an eshop manager, I want to view and manage order payment information so that I can track payment status and handle payment issues.

**Why this priority**: Payment management is essential for financial operations and revenue tracking.

**Independent Test**: Can be fully tested by viewing payment details and updating payment status, delivering value in financial management.

**Acceptance Scenarios**:

1. **Given** an order exists, **When** the manager views the payment information, **Then** all payment details are displayed.
2. **Given** order payment information exists, **When** the manager updates the payment status, **Then** the changes are saved.

---

### User Story 16 - Manage User Sessions (Priority: P3)

As an eshop manager, I want to view active user sessions so that I can monitor system usage and handle security concerns.

**Why this priority**: Session management supports security monitoring and user activity tracking.

**Independent Test**: Can be fully tested by viewing active sessions, delivering value in security management.

**Acceptance Scenarios**:

1. **Given** users are logged in, **When** the manager views active sessions, **Then** all session information is displayed.
2. **Given** a session exists, **When** the manager views session details, **Then** user and expiration information are shown.

---

### User Story 17 - Manage Product Variable Fields (Priority: P2)

As an eshop manager, I want to create and manage custom product attributes so that I can capture product-specific information.

**Why this priority**: Custom product fields enable flexible product catalog management for different product types.

**Independent Test**: Can be fully tested by creating, reading, updating, and deleting variable fields, delivering value in product customization.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they create a variable field for a product type, **Then** the field appears in the field list.
2. **Given** a variable field exists, **When** the manager views the field details, **Then** all field configuration is displayed.
3. **Given** a variable field exists, **When** the manager updates the field configuration, **Then** the changes are saved.

---

### User Story 18 - Manage Shop Owner Mappings (Priority: P2)

As an eshop manager, I want to manage shop ownership so that I can assign and reassign shop owners.

**Why this priority**: Shop owner management enables multi-shop operations with proper ownership tracking.

**Independent Test**: Can be fully tested by creating and deleting owner mappings, delivering value in shop administration.

**Acceptance Scenarios**:

1. **Given** the manager is logged in, **When** they assign an owner to a shop, **Then** the ownership mapping is created.
2. **Given** a shop owner mapping exists, **When** the manager removes the owner, **Then** the mapping is deleted.

---

### Edge Cases

- What happens when deleting a product category that has products assigned? → **Cascade delete**: Products are deleted when their category is deleted
- How does system handle deleting a user role that has users assigned? → **Cascade delete**: Users are deleted when their role is deleted
- What happens when deleting a shop that has products or orders? → **Cascade delete**: All shop-related products, orders, and users are deleted
- How does system handle posts with special characters or HTML content? → **Allow HTML**: Posts support rich text content with HTML formatting
- What happens when creating duplicate language codes? → **Prevent duplicates**: System validates unique language codes

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow managers to perform CRUD operations on ProductType entities (categories)
- **FR-002**: System MUST allow managers to perform CRUD operations on UserRole entities
- **FR-003**: System MUST allow managers to perform CRUD operations on Post entities (content)
- **FR-004**: System MUST allow managers to perform CRUD operations on Shop entities
- **FR-005**: System MUST allow managers to perform CRUD operations on Lang entities (languages)
- **FR-006**: System MUST allow managers to view and manage UserCredential entities
- **FR-007**: System MUST allow managers to perform CRUD operations on UserContact entities
- **FR-008**: System MUST allow managers to perform CRUD operations on ProductVariant entities
- **FR-009**: System MUST allow managers to view and manage OrderItem entities
- **FR-010**: System MUST allow managers to perform CRUD operations on PostType entities (content categories)
- **FR-011**: System MUST allow managers to perform CRUD operations on UserShipping entities (shipping addresses)
- **FR-012**: System MUST allow managers to perform CRUD operations on UserBilling entities (billing addresses)
- **FR-013**: System MUST allow managers to view and manage OrderBilling entities
- **FR-014**: System MUST allow managers to view and manage OrderShipping entities
- **FR-015**: System MUST allow managers to view and manage OrderPayment entities
- **FR-016**: System MUST allow managers to view UserSession entities
- **FR-017**: System MUST allow managers to perform CRUD operations on ProductVariableField entities
- **FR-018**: System MUST allow managers to perform CRUD operations on ProductVariableFieldValue entities
- **FR-019**: System MUST allow managers to manually create and manage ProductVariantVarMapping entities (linking variants to field values)
- **FR-020**: System MUST allow managers to manage product-shop relationships indirectly through Product edit interface (ShopProductMapping)
- **FR-021**: System MUST allow managers to manage product-type relationships indirectly through Product edit interface (ProductTypeProductMapping)
- **FR-022**: System MUST allow managers to manage shop-type relationships indirectly through ProductType edit interface (ShopProductTypeMapping)
- **FR-023**: System MUST allow managers to manage shop ownership indirectly through Shop edit interface (ShopOwnerMapping)
- **FR-024**: System MUST NOT provide direct UI access to mapping tables (hidden from sidebar navigation)
- **FR-025**: System MUST display all new entity types in the sidebar navigation (excluding mapping tables)
- **FR-026**: System MUST provide consistent UI components (UIKit) for all new entity management
- **FR-027**: System MUST handle loading states and error messages for all new entities
- **FR-009**: System MUST validate required fields for all new entity types
- **FR-010**: System MUST enforce field length limits for text fields in new entities
- **FR-011**: System MUST provide user-friendly error messages for validation failures
- **FR-012**: System MUST handle network timeouts with retry options for new entities
- **FR-013**: System MUST handle server errors (5xx) with appropriate guidance for new entities
- **FR-014**: System MUST handle validation errors (4xx) with field-level error display for new entities
- **FR-015**: System MUST maintain sub-2 second load times for new entity lists
- **FR-016**: System MUST maintain sub-5 second operation times for new entity CRUD operations
- **FR-017**: System MUST support unlimited depth ProductType hierarchy with parent selection dropdown
- **FR-018**: System MUST implement multi-tenant architecture with shop-scoped data isolation
- **FR-019**: System MUST support UserRole permission assignments (create_product, delete_order, etc.)
- **FR-020**: System MUST implement cascade delete behavior for entity dependencies
- **FR-021**: System MUST validate unique language codes to prevent duplicates
- **FR-022**: System MUST support rich text content with HTML formatting for posts
- **FR-023**: System MUST implement role-based access control with granular permissions
- **FR-024**: System MUST validate permission assignments before allowing operations
- **FR-025**: System MUST prevent circular references in ProductType hierarchy
- **FR-026**: System MUST sanitize HTML content in posts to prevent XSS attacks

### Key Entities *(include if feature involves data)*

- **ProductType**: Product categorization with hierarchical support (parent-child relationships)
  - Foreign key: Products.typeId → ProductType.id
  - Unlimited depth hierarchy with dropdown selector for parent selection
- **UserRole**: User role definitions for access control and permissions
  - Foreign key: Users.roleId → UserRole.id
  - Roles have associated permission lists (create_product, delete_order, etc.)
- **Post**: Content management for blog posts, news, and announcements
  - Foreign key: Posts.authorId → Users.id
- **Shop**: E-commerce shop/store entities for multi-shop support
  - Foreign keys: Products.shopId → Shop.id, Orders.shopId → Shop.id, Users.shopId → Shop.id
  - Multi-tenant architecture with shop-scoped data isolation
- **Lang**: Supported languages for localization and internationalization
- **UserCredential**: User authentication credentials and password management
  - Foreign key: UserCredential.userId → Users.id
- **UserContact**: User contact information and communication details
  - Foreign key: UserContact.userId → Users.id
- **ProductVariant**: Product variations (size, color, configuration options)
  - Foreign key: ProductVariant.productId → Products.id
- **OrderItem**: Individual items within customer orders
  - Foreign keys: OrderItem.orderId → Orders.id, OrderItem.productId → Products.id
- **PostType**: Content categorization for posts and articles
  - Foreign key: Posts.typeId → PostType.id
- **UserShipping**: User shipping address management
  - Foreign key: UserShipping.userId → Users.id
- **UserBilling**: User billing address management
  - Foreign key: UserBilling.userId → Users.id
- **OrderBilling**: Order-specific billing information
  - Foreign key: OrderBilling.orderId → Orders.id
- **OrderShipping**: Order-specific shipping information
  - Foreign key: OrderShipping.orderId → Orders.id
- **OrderPayment**: Order payment tracking and status
  - Foreign key: OrderPayment.orderId → Orders.id
- **UserSession**: Active user session tracking for security
  - Foreign key: UserSession.userId → Users.id
- **ProductVariableField**: Custom product attributes per product
  - Foreign key: ProductVariableField.productId → Products.id
- **ProductVariableFieldValue**: Possible values for product variable fields
  - Foreign key: ProductVariableFieldValue.productVariableFieldId → ProductVariableField.id
- **ProductVariantVarMapping**: Junction table linking product variants to variable field values
  - Foreign keys: ProductVariantVarMapping.variantId → ProductVariant.id, ProductVariantVarMapping.variableFieldValueId → ProductVariableFieldValue.id
  - Composite unique constraint on (variantId, variableFieldValueId)
  - Managed manually by managers for maximum control
- **ShopProductMapping**: Many-to-many relationship between shops and products
  - Foreign keys: ShopProductMapping.shopId → Shop.id, ShopProductMapping.productId → Products.id
  - Composite unique constraint on (shopId, productId) to prevent duplicates
  - Managed indirectly through Product edit interface (assign shops to products)
- **ShopProductTypeMapping**: Many-to-many relationship between shops and product types
  - Foreign keys: ShopProductTypeMapping.shopId → Shop.id, ShopProductTypeMapping.productTypeId → ProductType.id
  - Composite unique constraint on (shopId, productTypeId) to prevent duplicates
  - Managed indirectly through ProductType edit interface
- **ProductTypeProductMapping**: Many-to-many relationship between product types and products
  - Foreign keys: ProductTypeProductMapping.productTypeId → ProductType.id, ProductTypeProductMapping.productId → Products.id
  - Composite unique constraint on (productTypeId, productId) to prevent duplicates
  - Managed indirectly through Product edit interface (assign categories to products)
- **ShopOwnerMapping**: Multi-owner shop relationship management
  - Foreign keys: ShopOwnerMapping.shopId → Shop.id, ShopOwnerMapping.userId → Users.id
  - Composite unique constraint on (shopId, userId) to prevent duplicates
  - Managed indirectly through Shop edit interface (assign owners to shops)

### Entity Field Definitions *(mandatory)*

**ProductType Fields**:
- `id`: string (UUID) - Primary key
- `name`: string (required, max 255 chars) - Category name
- `description`: string (optional, max 1000 chars) - Category description
- `parentId`: string (optional, UUID) - Parent category ID for hierarchy
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserRole Fields**:
- `id`: string (UUID) - Primary key
- `name`: string (required, max 100 chars) - Role name
- `description`: string (optional, max 500 chars) - Role description
- `permissions`: array of strings - Permission list (create_product, delete_order, etc.)
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**Post Fields**:
- `id`: string (UUID) - Primary key
- `title`: string (required, max 255 chars) - Post title
- `content`: string (required) - Post content (supports HTML)
- `authorId`: string (required, UUID) - Author user ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**Shop Fields**:
- `id`: string (UUID) - Primary key
- `name`: string (required, max 255 chars) - Shop name
- `description`: string (optional, max 1000 chars) - Shop description
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**Lang Fields**:
- `id`: string (UUID) - Primary key
- `code`: string (required, max 10 chars, unique) - Language code (e.g., 'en', 'es')
- `name`: string (required, max 100 chars) - Language name (e.g., 'English', 'Spanish')
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserCredential Fields**:
- `id`: string (UUID) - Primary key
- `userId`: string (required, UUID) - User ID
- `passwordHash`: string (required) - Hashed password
- `salt`: string (required) - Password salt
- `lastLoginAt`: datetime - Last login timestamp
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserContact Fields**:
- `id`: string (UUID) - Primary key
- `userId`: string (required, UUID) - User ID
- `type`: string (required, max 50 chars) - Contact type (email, phone, etc.)
- `value`: string (required, max 255 chars) - Contact value
- `isPrimary`: boolean - Primary contact flag
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**ProductVariant Fields**:
- `id`: string (UUID) - Primary key
- `productId`: string (required, UUID) - Product ID
- `name`: string (required, max 255 chars) - Variant name (e.g., "Large Red")
- `sku`: string (required, max 100 chars, unique) - Variant SKU
- `price`: number - Variant-specific price
- `stock`: number - Stock quantity
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**OrderItem Fields**:
- `id`: string (UUID) - Primary key
- `orderId`: string (required, UUID) - Order ID
- `productId`: string (required, UUID) - Product ID
- `variantId`: string (optional, UUID) - Product variant ID
- `quantity`: number (required, min 1) - Item quantity
- `unitPrice`: number (required) - Price per unit
- `totalPrice`: number - Calculated total price
- `status`: string (required) - Item status (pending, shipped, delivered)
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**PostType Fields**:
- `id`: string (UUID) - Primary key
- `name`: string (required, max 100 chars) - Category name
- `description`: string (optional, max 500 chars) - Category description
- `slug`: string (required, max 100 chars, unique) - URL-friendly identifier
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserShipping Fields**:
- `id`: string (UUID) - Primary key
- `userId`: string (required, UUID) - User ID
- `name`: string (required, max 255 chars) - Recipient name
- `address`: string (required, max 500 chars) - Street address
- `city`: string (required, max 100 chars) - City
- `state`: string (required, max 100 chars) - State/province
- `zipCode`: string (required, max 20 chars) - Postal code
- `country`: string (required, max 100 chars) - Country
- `isDefault`: boolean - Default address flag
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserBilling Fields**:
- `id`: string (UUID) - Primary key
- `userId`: string (required, UUID) - User ID
- `name`: string (required, max 255 chars) - Billing name
- `address`: string (required, max 500 chars) - Street address
- `city`: string (required, max 100 chars) - City
- `state`: string (required, max 100 chars) - State/province
- `zipCode`: string (required, max 20 chars) - Postal code
- `country`: string (required, max 100 chars) - Country
- `isDefault`: boolean - Default address flag
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**OrderBilling Fields**:
- `id`: string (UUID) - Primary key
- `orderId`: string (required, UUID) - Order ID
- `name`: string (required, max 255 chars) - Billing name
- `address`: string (required, max 500 chars) - Street address
- `city`: string (required, max 100 chars) - City
- `state`: string (required, max 100 chars) - State/province
- `zipCode`: string (required, max 20 chars) - Postal code
- `country`: string (required, max 100 chars) - Country
- `createdAt`: datetime - Creation timestamp

**OrderShipping Fields**:
- `id`: string (UUID) - Primary key
- `orderId`: string (required, UUID) - Order ID
- `name`: string (required, max 255 chars) - Recipient name
- `address`: string (required, max 500 chars) - Street address
- `city`: string (required, max 100 chars) - City
- `state`: string (required, max 100 chars) - State/province
- `zipCode`: string (required, max 20 chars) - Postal code
- `country`: string (required, max 100 chars) - Country
- `trackingNumber`: string (optional, max 100 chars) - Shipping tracking number
- `carrier`: string (optional, max 100 chars) - Shipping carrier
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**OrderPayment Fields**:
- `id`: string (UUID) - Primary key
- `orderId`: string (required, UUID) - Order ID
- `method`: string (required, max 50 chars) - Payment method (credit_card, paypal, etc.)
- `amount`: number (required) - Payment amount
- `status`: string (required) - Payment status (pending, completed, failed)
- `transactionId`: string (optional, max 255 chars) - External transaction ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**UserSession Fields**:
- `id`: string (UUID) - Primary key
- `userId`: string (required, UUID) - User ID
- `token`: string (required, max 255 chars) - Session token
- `expiresAt`: datetime (required) - Session expiration time
- `ipAddress`: string (optional, max 45 chars) - User IP address
- `userAgent`: string (optional, max 500 chars) - User browser/device info
- `createdAt`: datetime - Creation timestamp

**ProductVariableField Fields**:
- `id`: string (UUID) - Primary key
- `productId`: string (required, UUID) - Product ID (each product defines its own unique variable fields)
- `name`: string (required, max 100 chars) - Field name (e.g., "Size", "Color")
- `type`: string (required, max 50 chars) - Field type (text, number, boolean)
- `required`: boolean - Required field flag
- `defaultValue`: string (optional, max 500 chars) - Default value
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**ProductVariableFieldValue Fields**:
- `id`: string (UUID) - Primary key
- `productVariableFieldId`: string (required, UUID) - Variable field ID
- `name`: string (required, max 100 chars) - Value name (e.g., "Small", "Medium", "Large")
- `description`: string (optional, max 500 chars) - Value description
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp

**ProductVariantVarMapping Fields**:
- `id`: string (UUID) - Primary key
- `variantId`: string (required, UUID) - Product variant ID
- `variableFieldValueId`: string (required, UUID) - Variable field value ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp
- Composite unique constraint: (variantId, variableFieldValueId)

**ShopProductMapping Fields**:
- `id`: string (UUID) - Primary key
- `shopId`: string (required, UUID) - Shop ID
- `productId`: string (required, UUID) - Product ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp
- Composite unique constraint: (shopId, productId)

**ShopProductTypeMapping Fields**:
- `id`: string (UUID) - Primary key
- `shopId`: string (required, UUID) - Shop ID
- `productTypeId`: string (required, UUID) - Product type ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp
- Composite unique constraint: (shopId, productTypeId)

**ProductTypeProductMapping Fields**:
- `id`: string (UUID) - Primary key
- `productTypeId`: string (required, UUID) - Product type ID
- `productId`: string (required, UUID) - Product ID
- `createdAt`: datetime - Creation timestamp
- `updatedAt`: datetime - Last update timestamp
- Composite unique constraint: (productTypeId, productId)

**ShopOwnerMapping Fields**:
- `id`: string (UUID) - Primary key
- `shopId`: string (required, UUID) - Shop ID
- `userId`: string (required, UUID) - Owner user ID
- `role`: string (optional, max 50 chars) - Owner role (primary, secondary)
- `createdAt`: datetime - Creation timestamp
- Composite unique constraint: (shopId, userId)

### Validation Rules *(mandatory)*

- **Required Fields**: All entities validate required fields on create/update
- **Field Length Limits**: Enforced for all text fields as specified above
- **Unique Constraints**: Lang.code, ProductVariant.sku, PostType.slug must be unique
- **Composite Unique Constraints**: All mapping entities enforce composite unique constraints on foreign key pairs:
  - ShopProductMapping: (shopId, productId)
  - ShopProductTypeMapping: (shopId, productTypeId)
  - ProductTypeProductMapping: (productTypeId, productId)
  - ProductVariantVarMapping: (variantId, variableFieldValueId)
  - ShopOwnerMapping: (shopId, userId)
- **Foreign Key Validation**: All foreign key references must point to valid entities
- **Data Type Validation**: UUID format for ID fields, proper datetime format, numeric validation
- **Business Rules**: OrderItem.quantity >= 1, ProductVariant.stock >= 0, UserContact.type in allowed values
- **HTML Sanitization**: Post content allows safe HTML tags only
- **Circular Reference Prevention**: ProductType hierarchy cannot create circular references
- **Manual Mapping Creation**: ProductVariantVarMapping records are created manually by managers for explicit control over variant-to-field-value relationships

### Permission System *(mandatory)*

**Available Permissions**:
- `create_product`: Create new products
- `read_product`: View products
- `update_product`: Edit existing products
- `delete_product`: Delete products
- `create_order`: Create orders
- `read_order`: View orders
- `update_order`: Update order status
- `delete_order`: Delete orders
- `create_user`: Create user accounts
- `read_user`: View users
- `update_user`: Edit user accounts
- `delete_user`: Delete users
- `manage_categories`: CRUD operations on ProductType
- `manage_roles`: CRUD operations on UserRole
- `manage_posts`: CRUD operations on Post
- `manage_shops`: CRUD operations on Shop
- `manage_languages`: CRUD operations on Lang

**Permission Enforcement**:
- UI elements are hidden/shown based on user role permissions
- API requests are validated server-side for permission checks
- Permission failures return 403 Forbidden with clear error messages

### API Field Mappings *(mandatory)*

**ProductType API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `name` ↔ API `name`
- Frontend `description` ↔ API `desc` (note: API uses 'desc' not 'description')
- Frontend `parentId` ↔ API `parentId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserRole API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `name` ↔ API `name`
- Frontend `description` ↔ API `desc`
- Frontend `permissions` ↔ API `permissions` (array)
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**Post API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `title` ↔ API `title`
- Frontend `content` ↔ API `content`
- Frontend `authorId` ↔ API `authorId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**Shop API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `name` ↔ API `name`
- Frontend `description` ↔ API `desc`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**Lang API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `code` ↔ API `code`
- Frontend `name` ↔ API `name`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserCredential API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `userId` ↔ API `userId`
- Frontend `passwordHash` ↔ API `passwordHash`
- Frontend `salt` ↔ API `salt`
- Frontend `lastLoginAt` ↔ API `lastLoginAt`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserContact API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `userId` ↔ API `userId`
- Frontend `type` ↔ API `type`
- Frontend `value` ↔ API `value`
- Frontend `isPrimary` ↔ API `isPrimary`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ProductVariant API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `productId` ↔ API `productId`
- Frontend `name` ↔ API `name`
- Frontend `sku` ↔ API `sku`
- Frontend `price` ↔ API `price`
- Frontend `stock` ↔ API `stock`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**OrderItem API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `orderId` ↔ API `orderId`
- Frontend `productId` ↔ API `productId`
- Frontend `variantId` ↔ API `variantId`
- Frontend `quantity` ↔ API `quantity`
- Frontend `unitPrice` ↔ API `unitPrice`
- Frontend `totalPrice` ↔ API `totalPrice`
- Frontend `status` ↔ API `status`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**PostType API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `name` ↔ API `name`
- Frontend `description` ↔ API `desc`
- Frontend `slug` ↔ API `slug`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserShipping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `userId` ↔ API `userId`
- Frontend `name` ↔ API `name`
- Frontend `address` ↔ API `address`
- Frontend `city` ↔ API `city`
- Frontend `state` ↔ API `state`
- Frontend `zipCode` ↔ API `zipCode`
- Frontend `country` ↔ API `country`
- Frontend `isDefault` ↔ API `isDefault`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserBilling API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `userId` ↔ API `userId`
- Frontend `name` ↔ API `name`
- Frontend `address` ↔ API `address`
- Frontend `city` ↔ API `city`
- Frontend `state` ↔ API `state`
- Frontend `zipCode` ↔ API `zipCode`
- Frontend `country` ↔ API `country`
- Frontend `isDefault` ↔ API `isDefault`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**OrderBilling API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `orderId` ↔ API `orderId`
- Frontend `name` ↔ API `name`
- Frontend `address` ↔ API `address`
- Frontend `city` ↔ API `city`
- Frontend `state` ↔ API `state`
- Frontend `zipCode` ↔ API `zipCode`
- Frontend `country` ↔ API `country`
- Frontend `createdAt` ↔ API `createdAt`

**OrderShipping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `orderId` ↔ API `orderId`
- Frontend `name` ↔ API `name`
- Frontend `address` ↔ API `address`
- Frontend `city` ↔ API `city`
- Frontend `state` ↔ API `state`
- Frontend `zipCode` ↔ API `zipCode`
- Frontend `country` ↔ API `country`
- Frontend `trackingNumber` ↔ API `trackingNumber`
- Frontend `carrier` ↔ API `carrier`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**OrderPayment API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `orderId` ↔ API `orderId`
- Frontend `method` ↔ API `method`
- Frontend `amount` ↔ API `amount`
- Frontend `status` ↔ API `status`
- Frontend `transactionId` ↔ API `transactionId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**UserSession API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `userId` ↔ API `userId`
- Frontend `token` ↔ API `token`
- Frontend `expiresAt` ↔ API `expiresAt`
- Frontend `ipAddress` ↔ API `ipAddress`
- Frontend `userAgent` ↔ API `userAgent`
- Frontend `createdAt` ↔ API `createdAt`

**ProductVariableField API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `productId` ↔ API `productId`
- Frontend `name` ↔ API `name`
- Frontend `type` ↔ API `type`
- Frontend `required` ↔ API `required`
- Frontend `defaultValue` ↔ API `defaultValue`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ProductVariableFieldValue API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `productVariableFieldId` ↔ API `productVariableFieldId`
- Frontend `name` ↔ API `name`
- Frontend `description` ↔ API `desc` (note: API uses 'desc' not 'description')
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ProductVariantVarMapping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `variantId` ↔ API `variantId`
- Frontend `variableFieldValueId` ↔ API `variableFieldValueId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ShopProductMapping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `shopId` ↔ API `shopId`
- Frontend `productId` ↔ API `productId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ShopProductTypeMapping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `shopId` ↔ API `shopId`
- Frontend `productTypeId` ↔ API `productTypeId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ProductTypeProductMapping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `productTypeId` ↔ API `productTypeId`
- Frontend `productId` ↔ API `productId`
- Frontend `createdAt` ↔ API `createdAt`
- Frontend `updatedAt` ↔ API `updatedAt`

**ShopOwnerMapping API Mapping**:
- Frontend `id` ↔ API `id`
- Frontend `shopId` ↔ API `shopId`
- Frontend `userId` ↔ API `userId`
- Frontend `role` ↔ API `role`
- Frontend `createdAt` ↔ API `createdAt`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Managers can create new entities in under 30 seconds each for all 23 entity types (18 direct + 5 mapping entities)
- **SC-002**: Entity lists load in under 2 seconds for up to 1000 items per entity type
- **SC-003**: CRUD operations complete in under 5 seconds each for all new entities
- **SC-004**: System maintains responsive UI during data loading for all new entities
- **SC-005**: 95% of managers complete primary tasks for each new entity type successfully on first attempt
- **SC-006**: All 18 direct-access entity types are accessible through sidebar navigation without performance degradation
- **SC-007**: Mapping entities (5 types) are hidden from sidebar but fully functional through parent entity interfaces
- **SC-008**: ProductType hierarchy supports unlimited nesting depth with proper parent-child relationships
- **SC-009**: Multi-tenant shop isolation prevents data leakage between shops
- **SC-010**: UserRole permission system correctly restricts access based on assigned permissions
- **SC-011**: Cascade delete operations complete successfully without orphaned records
- **SC-012**: Permission system correctly enforces access control with 100% accuracy
- **SC-013**: Field validation prevents invalid data entry in 100% of cases
- **SC-014**: HTML content in posts is properly sanitized to prevent XSS attacks
- **SC-015**: ProductType hierarchy prevents circular references with 100% accuracy
- **SC-016**: Composite unique constraints prevent duplicate mapping records with 100% accuracy
- **SC-017**: Managers can assign products to shops through Product edit interface with zero direct mapping table exposure
- **SC-018**: Error handling provides clear guidance for all failure scenarios in new entities
