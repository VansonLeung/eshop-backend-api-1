# Model Auto-Registration System

The application now uses an **automatic model registration system** that eliminates the need for individual API files.

## How It Works

### 1. Models Auto-Register
All models are automatically registered in `src/models/index.js`:

```javascript
import { modelRegistry } from 'sequelize-rest-framework';

// After sequelize.sync()
const modelsToRegister = {
    User, Product, Order, Shop, ...
};

Object.entries(modelsToRegister).forEach(([name, model]) => {
    if (model) {
        modelRegistry.register(name, model);
    }
});
```

### 2. Router Uses Registry
The router automatically initializes all registered models:

```javascript
import { modelRegistry } from 'sequelize-rest-framework';

export const Router = {
    initialize: ({ app, models, authSystem }) => {
        // ...

        // Initialize all auto-registered models
        modelRegistry.initializeAll({
            app: router,
            appWithMeta: routerWithMeta
        });

        // ...
    }
}
```

### 3. No API Files Needed!
Each model automatically gets full CRUD endpoints:

- `POST /api/{Model}` - Create
- `GET /api/{Model}` - Read all
- `GET /api/{Model}/:id` - Read one
- `PUT /api/{Model}/:id` - Update
- `DELETE /api/{Model}/:id` - Delete
- Plus bulk operations and associations

## Benefits

✅ **No boilerplate** - No need to create API*.js files
✅ **Less code** - Removed 9 API files
✅ **Automatic** - New models get endpoints automatically
✅ **Consistent** - All models follow the same pattern
✅ **Maintainable** - Central registration in one place

## What Was Removed

The following files are no longer needed:
- ~~`src/apis/APIProduct.js`~~
- ~~`src/apis/APIOrder.js`~~
- ~~`src/apis/APIUser.js`~~
- ~~`src/apis/APIShop.js`~~
- ~~`src/apis/APIProductType.js`~~
- ~~`src/apis/APIProductVariableField.js`~~
- ~~`src/apis/APIProductVariableFieldValue.js`~~
- ~~`src/apis/APIProductVariant.js`~~
- ~~`src/apis/APIOrderItem.js`~~

## How to Add a New Model

1. Create model file in `src/models/stores/EBNewModel.js`
2. Add to `src/models/index.js`:
   ```javascript
   import { EBNewModel } from './stores/EBNewModel.js';

   // In initializeModels():
   const NewModel = sequelize.define('NewModel', EBNewModel.makeSchema());

   // In modelsToRegister:
   const modelsToRegister = {
       // ...
       NewModel,  // Add here
   };
   ```
3. Done! Endpoints are automatically created

## Server Output

```
Initializing 36 auto-registered models...
✓ Auto-registered 36 models with CRUD endpoints
Server is running on http://localhost:3000
```

## Testing

All CRUD operations work perfectly:
```bash
node api-tests/test-product.js
# ✓ All tests pass
```
