# Quick Start: Using sequelize-rest-framework

**Package**: `sequelize-rest-framework`  
**Version**: 0.1.0  
**Date**: 2025-10-12

## What is sequelize-rest-framework?

A generic REST API framework for Node.js that automatically generates CRUD endpoints, authentication, and authorization for Sequelize models. Build a complete backend API in minutes by simply defining your data models.

## Installation

### Option 1: Workspace (Monorepo)

```bash
# In root package.json
{
  "workspaces": ["packages/*"],
  "dependencies": {
    "sequelize-rest-framework": "workspace:*"
  }
}

# Install dependencies
npm install
```

### Option 2: npm (when published)

```bash
npm install sequelize-rest-framework sequelize express mysql2 bcrypt
```

## Quick Start Example: Blog API

Create a complete blog API with authentication in under 10 minutes.

### Step 1: Setup Project

```bash
mkdir my-blog-api
cd my-blog-api
npm init -y
npm install sequelize-rest-framework sequelize express mysql2
```

### Step 2: Create Database Connection

```javascript
// db.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('blog_db', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});
```

### Step 3: Define Your Models

```javascript
// models.js
import { DataTypes } from 'sequelize';
import { SchemaToIndexes } from 'sequelize-rest-framework';
import { sequelize } from './db.js';

// Define Post model
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: SchemaToIndexes({
    title: { type: DataTypes.STRING, allowNull: false }
  })
});

// Define Comment model
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

// Define associations
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' });

export { Post, Comment };
```

### Step 4: Initialize Framework and Register Models

```javascript
// server.js
import express from 'express';
import { 
  modelRegistry, 
  AuthSystem,
  RequestResponseMiddleware 
} from 'sequelize-rest-framework';
import { sequelize } from './db.js';
import { Post, Comment } from './models.js';

const app = express();
app.use(express.json());
app.use(RequestResponseMiddleware.apply());

// Initialize auth system (optional but recommended)
const authSystem = new AuthSystem(sequelize);
authSystem.initialize();
app.use('/api/auth', authSystem.getAuthRoutes());

// Sync database
await sequelize.sync({ alter: true });

// Register models for auto-CRUD
modelRegistry.register('Post', Post);
modelRegistry.register('Comment', Comment);

// Initialize CRUD endpoints
const router = express.Router();
const routerWithMeta = new RouterWithMeta({ 
  router, 
  meta: {} 
});

await modelRegistry.initializeAll({ 
  app: router, 
  appWithMeta: routerWithMeta 
});

app.use(router);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
  console.log(`
Available endpoints:
  POST   /api/auth/register    - Register user
  POST   /api/auth/login       - Login
  GET    /api/auth/me          - Get current user
  
  GET    /api/Post             - List posts
  POST   /api/Post             - Create post
  GET    /api/Post/:id         - Get post
  PUT    /api/Post/:id         - Update post
  DELETE /api/Post/:id         - Delete post
  
  GET    /api/Comment          - List comments
  POST   /api/Comment          - Create comment
  GET    /api/Comment/:id      - Get comment
  PUT    /api/Comment/:id      - Update comment
  DELETE /api/Comment/:id      - Delete comment
  `);
});
```

### Step 5: Run and Test

```bash
node server.js

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"author","email":"author@blog.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"author","password":"secret123"}'

# Create a post
curl -X POST http://localhost:3000/api/Post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First Post","content":"Hello World!","published":true}'

# List all posts
curl http://localhost:3000/api/Post

# Get post with comments
curl "http://localhost:3000/api/Post/POST_ID?join={\"include\":{\"association\":\"comments\"}}"

# Filter published posts
curl "http://localhost:3000/api/Post?filter={\"published\":true}"

# Sort posts by creation date
curl "http://localhost:3000/api/Post?sort=[[\"createdAt\",\"DESC\"]]"

# Paginate posts
curl "http://localhost:3000/api/Post?limit=10&offset=0"
```

## You Now Have:

✅ Complete REST API with CRUD operations for all models  
✅ User authentication (register, login, logout)  
✅ Token-based authorization  
✅ Advanced querying (filter, sort, pagination, joins)  
✅ Automatic OpenAPI/Swagger documentation support  
✅ Consistent response format  
✅ Error handling  

**All in ~50 lines of code!**

## Advanced Usage

### Adding Custom Endpoints

```javascript
// After registering models, add custom routes
router.post('/api/Post/:id/publish', 
  authSystem.authenticate(),
  async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.sendError({ error: 'Post not found', status: 404 });
    }
    await post.update({ published: true });
    res.sendResponse({ data: post });
  }
);
```

### Adding ACL Middleware

```javascript
modelRegistry.register('Post', Post, {
  aclMiddleware: {
    create: authSystem.authenticate(),
    update: authSystem.authenticate(),
    delete: authSystem.requireLevel(5) // Admin only
  }
});
```

### Extending User Model

```javascript
// Create extended user model
const BlogUser = sequelize.define('BlogUser', {
  ...authSystem.getBaseUserSchema(),
  bio: DataTypes.TEXT,
  website: DataTypes.STRING,
  followerCount: DataTypes.INTEGER
});

// Initialize auth with extended model
authSystem.initialize({ User: BlogUser });
```

### Adding Associations Endpoints

```javascript
import { GenericAssociations } from 'sequelize-rest-framework';

GenericAssociations.initialize({
  app: router,
  appWithMeta: routerWithMeta,
  collectionName: 'Post',
  collectionModel: Post,
  associations: [
    { name: 'comments', type: 'hasMany' }
  ]
});

// Now available:
// GET    /api/Post/:id/comments
// POST   /api/Post/:id/comments
// DELETE /api/Post/:id/comments/:commentId
```

## Next Steps

1. **Add business logic**: Create custom service classes for complex operations
2. **Add validation**: Use Sequelize validators or middleware
3. **Add tests**: Use vitest for unit and integration tests
4. **Add documentation**: Generate OpenAPI/Swagger docs
5. **Deploy**: Use Docker, PM2, or cloud platforms

## E-Commerce Example

See the full e-commerce example in the source repository at `/examples/ecommerce/` for a more complex use case with:
- Product catalog management
- Shopping cart
- Order processing
- Inventory tracking
- User roles and permissions

## More Examples

### Inventory Management System

```javascript
const Warehouse = sequelize.define('Warehouse', {
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  capacity: DataTypes.INTEGER
});

const Item = sequelize.define('Item', {
  sku: DataTypes.STRING,
  name: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  warehouseId: DataTypes.UUID
});

Warehouse.hasMany(Item);
Item.belongsTo(Warehouse);

modelRegistry.register('Warehouse', Warehouse);
modelRegistry.register('Item', Item);
```

### Task Management System

```javascript
const Project = sequelize.define('Project', {
  name: DataTypes.STRING,
  status: DataTypes.ENUM('active', 'completed', 'archived')
});

const Task = sequelize.define('Task', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATE,
  priority: DataTypes.ENUM('low', 'medium', 'high'),
  projectId: DataTypes.UUID
});

Project.hasMany(Task);
Task.belongsTo(Project);

modelRegistry.register('Project', Project);
modelRegistry.register('Task', Task);
```

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module 'sequelize-rest-framework'`  
**Solution**: Ensure package is installed and in workspace if using monorepo

**Issue**: `Database connection failed`  
**Solution**: Check database credentials and ensure MySQL is running

**Issue**: `Token invalid after logout`  
**Solution**: Verify you're calling `/api/auth/logout` with valid token

**Issue**: `No CRUD endpoints generated`  
**Solution**: Ensure you're calling `modelRegistry.initializeAll()` after registering models

## Support

- **Documentation**: See `/docs` folder in package
- **Examples**: See `/examples` folder in source repository
- **Issues**: File issues on GitHub repository

## What's Next?

- Learn about [authentication and authorization](./auth-guide.md)
- Explore [advanced querying](./querying-guide.md)
- Read [API reference](./api-reference.md)
- See [migration guide](./migration-guide.md) for upgrading from previous versions
