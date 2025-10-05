# Sequelize REST Framework

A reusable framework for building REST APIs with Sequelize ORM, featuring automatic CRUD operations, association endpoints, and flexible query builders.

## Features

- **Automatic CRUD Operations**: Generates full REST API endpoints (GET, POST, PUT, DELETE) for your Sequelize models
- **Association Endpoints**: Automatically creates endpoints for model associations (belongsTo, hasMany, etc.)
- **Advanced Query Support**: Built-in filtering, sorting, pagination, grouping, and joining capabilities
- **Reusable Model Attributes**: Pre-built attribute sets for common patterns (timestamps, soft deletes, versioning, etc.)
- **Schema Helper**: Automatic index generation from schema definitions
- **Swagger/OpenAPI Ready**: Built-in metadata support for API documentation

## Installation

```bash
# From within your project
npm install ./packages/sequelize-rest-framework
```

## Quick Start

### 1. Define Your Model

```javascript
import { BasicAttributes, DatedStatusAttributes, ContentAttributes } from 'sequelize-rest-framework';

export const Product = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),              // id, seqId, seq, name
            ...DatedStatusAttributes(),         // createdAt, updatedAt, createdBy, updatedBy
            ...ContentAttributes(),             // desc, json, langId, etc.
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.00,
            },
        }
    },

    makeAssociations: ({Me, Category}) => {
        Me.belongsTo(Category, { foreignKey: 'categoryId' });
    }
};
```

### 2. Initialize Models with Sequelize

```javascript
import { Sequelize } from 'sequelize';
import { SchemaToIndexes } from 'sequelize-rest-framework';
import { Product } from './models/Product.js';

const sequelize = new Sequelize(/* config */);

const ProductModel = sequelize.define(
    'Product',
    Product.makeSchema(),
    { indexes: SchemaToIndexes(Product.makeSchema()) }
);

Product.makeAssociations({ Me: ProductModel, Category: CategoryModel });
```

### 3. Create API Routes

```javascript
import express from 'express';
import { GenericCRUD, RouterWithMeta, RequestResponseMiddleware } from 'sequelize-rest-framework';

const app = express();
const router = express.Router();
const meta = {};
const routerWithMeta = RouterWithMeta({ router, meta });

// Apply middleware
app.use(RequestResponseMiddleware.apply());

// Initialize CRUD endpoints for Product
GenericCRUD.initialize({
    app: router,
    appWithMeta: routerWithMeta,
    collectionName: 'Product',
    collectionModel: ProductModel,
});

app.use(router);
```

This automatically creates the following endpoints:

- `POST /api/Product` - Create a product
- `GET /api/Product` - List all products (with filtering, sorting, pagination)
- `GET /api/Product/:id` - Get a single product
- `PUT /api/Product/:id` - Update a product
- `DELETE /api/Product/:id` - Delete a product
- `POST /api/Product/bulk` - Bulk create/update products
- `DELETE /api/Product/:ids/bulk` - Bulk delete products

Plus automatic association endpoints if your model has associations!

## API Features

### Query Parameters

All GET endpoints support advanced querying:

#### Filtering
```javascript
// URL: /api/Product?filter={"where":{"price":{"$gt":100}}}
// Supported operators: $like, $gt, $lt, $gte, $lte, $in, $not, $notIn, $eq, $ne, $or, $and
```

#### Sorting
```javascript
// URL: /api/Product?sort=["price","DESC"]
// Or multiple: /api/Product?sort=[["price","DESC"],["name","ASC"]]
```

#### Pagination
```javascript
// URL: /api/Product?limit=10&offset=20
```

#### Joining (Associations)
```javascript
// URL: /api/Product?join={"include":{"association":"Category"}}
```

#### Counting
```javascript
// URL: /api/Product?isCount=true
// Returns count instead of records
```

## Reusable Model Attributes

The framework provides pre-built attribute sets:

### BasicAttributes
```javascript
BasicAttributes() // Adds: id (UUID), seqId, seq, name
```

### DatedStatusAttributes
```javascript
DatedStatusAttributes() // Adds: createdAt, updatedAt, createdBy, updatedBy
```

### DatedSoftDeleteStatusAttributes
```javascript
DatedSoftDeleteStatusAttributes() // Adds: isDeleted, isDisabled, deletedAt, deletedBy
```

### ContentAttributes
```javascript
ContentAttributes() // Adds: desc, json, baseId, langId, isPublished, publishedAt, publishedBy, revision
```

### CodeAttributes
```javascript
CodeAttributes({ length: 64 }) // Adds: code (unique string)
```

### ContactAttributes
```javascript
ContactAttributes() // Adds: firstName, lastName, email, phone, address, city, state, zip
```

### ParentChildAttributes
```javascript
ParentChildAttributes() // Adds: parentId
```

### ProductVariantAttributes
```javascript
ProductVariantAttributes() // Adds: productId, sku, price, quantity
```

### OrderAttributes
```javascript
OrderAttributes() // Adds: orderRemarks, orderStatus, orderDate, orderPickupDate, etc.
```

### OrderItemAttributes
```javascript
OrderItemAttributes() // Adds: orderedItemPrice, orderedItemQuantity
```

## Reusable Associations

### ContentAssociations
```javascript
ContentAssociations({ Me: MyModel, Lang: LangModel })
// Creates: base/derivatives (self-referencing) and lang (belongsTo Lang)
```

### ParentChildAssociations
```javascript
ParentChildAssociations({ Me: MyModel })
// Creates: parent (belongsTo self) and childs (hasMany self)
```

### ProductVariantAssociations
```javascript
ProductVariantAssociations({ Me: VariantModel, Product: ProductModel })
// Creates: product (belongsTo) and variants (hasMany)
```

## Schema Helper

Automatically generate Sequelize indexes from your schema:

```javascript
import { SchemaToIndexes } from 'sequelize-rest-framework';

const schema = {
    email: {
        type: DataTypes.STRING,
        index: true,  // Creates single-column index
    },
    userId: {
        type: DataTypes.UUID,
        indexGroups: [{ name: 'user_tenant', order: 0 }],  // Composite index
    },
    tenantId: {
        type: DataTypes.UUID,
        indexGroups: [{ name: 'user_tenant', order: 1 }],  // Composite index
    },
    code: {
        type: DataTypes.STRING,
        uniqueGroups: [{ name: 'unique_code', order: 0 }],  // Unique index
    }
};

const indexes = SchemaToIndexes(schema);
// Returns array of Sequelize index definitions
```

## Middleware

### RequestResponseMiddleware

Adds `res.sendResponse()` and `res.sendError()` helpers:

```javascript
import { RequestResponseMiddleware } from 'sequelize-rest-framework';

app.use(RequestResponseMiddleware.apply());

// In your routes:
res.sendResponse({ status: 200, data: items });
res.sendError({ status: 404, error: new Error('Not found') });
```

### RouterWithMeta

Wraps Express router to capture route metadata for Swagger/OpenAPI:

```javascript
import { RouterWithMeta } from 'sequelize-rest-framework';

const router = express.Router();
const meta = {};
const routerWithMeta = RouterWithMeta({ router, meta });

// Use routerWithMeta instead of router for routes with metadata
routerWithMeta.get('/api/users', {
    parameters: [/* OpenAPI params */],
    responses: {/* OpenAPI responses */}
}, handler);

// meta object now contains route metadata for documentation generation
```

## Configuration

### Model Settings

Configure association constraints:

```javascript
import { Settings } from 'sequelize-rest-framework';

Settings.constraints = false;  // Disable foreign key constraints (default: false)
```

## Association Endpoints

When your model has associations, the framework automatically creates additional endpoints:

For a `Product` with a `hasMany Category` association:
- `POST /api/Product/:id/Category/create` - Create associated category
- `GET /api/Product/:id/Category/getlist` - Get all categories for product
- `PATCH /api/Product/:id/Category/add/:categoryId` - Add category to product
- `PATCH /api/Product/:id/Category/remove/:categoryId` - Remove category from product
- `PATCH /api/Product/:id/Category/set/:categoryIds` - Set categories for product
- `GET /api/Product/:id/Category/countlist` - Count categories for product

## License

ISC

## Contributing

This library is designed to be extended and customized for your specific needs. Feel free to add new attribute sets, association patterns, or middleware as needed for your application.
