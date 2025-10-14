# Data Model: Eshop CMS

## Entities

### User
- id: string (UUID)
- email: string
- firstName: string
- lastName: string
- role: string
- createdAt: date
- updatedAt: date

Relationships:
- Has many UserContact
- Has many UserShipping
- Has many UserBilling
- Has many UserPayment
- Has many UserCartItem
- Belongs to UserRole

### Product
- id: string
- name: string
- description: string
- price: number
- sku: string
- typeId: string (foreign key to ProductType)
- createdAt: date
- updatedAt: date

Relationships:
- Belongs to ProductType
- Has many ProductVariant
- Has many UserCartItem
- Has many OrderItem

### Order
- id: string
- userId: string
- status: string (enum: pending, processing, shipped, delivered)
- total: number
- createdAt: date
- updatedAt: date

Relationships:
- Belongs to User
- Has many OrderItem
- Has one OrderBilling
- Has one OrderShipping
- Has one OrderPayment

### Shop
- id: string
- name: string
- description: string
- ownerId: string
- createdAt: date

Relationships:
- Has many ShopProductMapping
- Has many ShopOrderMapping

## Validation Rules
- Email: valid email format
- Price: positive number
- Name: required, max 255 chars
- Status: one of allowed values

## State Transitions
- Order status: pending → processing → shipped → delivered
