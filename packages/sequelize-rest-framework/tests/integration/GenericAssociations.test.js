import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import { GenericAssociations } from '../../src/api/GenericAssociations.js';

// Mock response methods
const mockResponse = () => {
    const res = {};
    res.sendResponse = function(data) {
        this.responseData = data;
        return this;
    };
    res.sendError = function(data) {
        this.errorData = data;
        return this;
    };
    return res;
};

// Mock request
const mockRequest = (params = {}, query = {}, body = {}) => ({
    params,
    query,
    body
});

describe('GenericAssociations Integration Tests', () => {
    let sequelize;
    let UserModel;
    let PostModel;
    let CommentModel;
    let app;
    let routeHandlers;

    beforeAll(async () => {
        // Create in-memory SQLite database for testing
        sequelize = new Sequelize('sqlite::memory:', {
            logging: false
        });

        // Define models with associations
        UserModel = sequelize.define('User', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false }
        });

        PostModel = sequelize.define('Post', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, allowNull: false },
            content: { type: DataTypes.TEXT, allowNull: false }
        });

        CommentModel = sequelize.define('Comment', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            text: { type: DataTypes.TEXT, allowNull: false }
        });

        // Define associations
        UserModel.hasMany(PostModel, { foreignKey: 'userId', as: 'posts' });
        PostModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'author' });

        UserModel.hasMany(CommentModel, { foreignKey: 'userId', as: 'comments' });
        CommentModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'author' });

        PostModel.hasMany(CommentModel, { foreignKey: 'postId', as: 'comments' });
        CommentModel.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' });

        // Sync models
        await sequelize.sync();

        // Create Express app
        app = express();
        app.use(express.json());

        // Create a map to store route handlers
        routeHandlers = {};

        // Mock appWithMeta that stores handlers
        const appWithMeta = {
            get: (path, schema, handler) => {
                routeHandlers[`GET ${path}`] = handler;
            },
            post: (path, schema, handler) => {
                routeHandlers[`POST ${path}`] = handler;
            },
            put: (path, schema, handler) => {
                routeHandlers[`PUT ${path}`] = handler;
            },
            patch: (path, schema, handler) => {
                routeHandlers[`PATCH ${path}`] = handler;
            },
            delete: (path, schema, handler) => {
                routeHandlers[`DELETE ${path}`] = handler;
            }
        };

        // Initialize associations for User model
        GenericAssociations.initialize({
            app,
            appWithMeta,
            collectionName: 'users',
            collectionModel: UserModel
        });

        // Initialize associations for Post model
        GenericAssociations.initialize({
            app,
            appWithMeta,
            collectionName: 'posts',
            collectionModel: PostModel
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('User-Post Associations', () => {
        let user;
        let post1;
        let post2;

        beforeAll(async () => {
            // Create test data
            user = await UserModel.create({
                name: 'John Doe',
                email: 'john@example.com'
            });

            post1 = await PostModel.create({
                title: 'First Post',
                content: 'Content of first post',
                userId: user.id
            });

            post2 = await PostModel.create({
                title: 'Second Post',
                content: 'Content of second post',
                userId: user.id
            });
        });

        describe('GET /api/users/:id/posts/get', () => {
            it('should get all posts for a user', async () => {
                const req = mockRequest({ id: user.id });
                const res = mockResponse();

                await routeHandlers['GET /api/users/:id/posts/get'](req, res);

                expect(res.responseData.status).toBe(200);
                expect(Array.isArray(res.responseData.data)).toBe(true);
                expect(res.responseData.data).toHaveLength(2);
                expect(res.responseData.data[0].title).toBe('First Post');
                expect(res.responseData.data[1].title).toBe('Second Post');
            });

            it('should return 404 for non-existent user', async () => {
                const req = mockRequest({ id: 999 });
                const res = mockResponse();

                await routeHandlers['GET /api/users/:id/posts/get'](req, res);

                expect(res.errorData.status).toBe(404);
                expect(res.errorData.error.message).toBe('users 999 not found');
            });
        });

        describe('POST /api/users/:id/posts/create', () => {
            it('should create a new post for a user', async () => {
                const req = mockRequest({ id: user.id }, {}, {
                    title: 'New Post',
                    content: 'New post content'
                });
                const res = mockResponse();

                await routeHandlers['POST /api/users/:id/posts/create'](req, res);

                expect(res.responseData.status).toBe(201);
                expect(res.responseData.data.title).toBe('New Post');
                expect(res.responseData.data.content).toBe('New post content');
                expect(res.responseData.data.userId).toBe(user.id);
            });
        });

        describe('PATCH /api/users/:id/posts/add/:targetIds', () => {
            it('should add an existing post to a user', async () => {
                // Create a post without a user first
                const orphanPost = await PostModel.create({
                    title: 'Orphan Post',
                    content: 'This post has no user initially'
                });

                const req = mockRequest({ id: user.id, targetIds: orphanPost.id.toString() });
                const res = mockResponse();

                await routeHandlers['PATCH /api/users/:id/posts/add/:targetIds'](req, res);

                expect(res.responseData.status).toBe(201);

                // Verify the post is now associated with the user
                const updatedPost = await PostModel.findByPk(orphanPost.id);
                expect(updatedPost.userId).toBe(user.id);
            });
        });

        describe('PATCH /api/users/:id/posts/remove/:targetIds', () => {
            it('should remove a post from a user', async () => {
                const req = mockRequest({ id: user.id, targetIds: post1.id.toString() });
                const res = mockResponse();

                await routeHandlers['PATCH /api/users/:id/posts/remove/:targetIds'](req, res);

                expect(res.responseData.status).toBe(201);

                // Verify the post is no longer associated with the user
                const updatedPost = await PostModel.findByPk(post1.id);
                expect(updatedPost.userId).toBeNull();
            });
        });
    });

    describe('Post-Comment Associations', () => {
        let post;
        let comment1;
        let comment2;

        beforeAll(async () => {
            // Create test data
            const user = await UserModel.create({
                name: 'Jane Doe',
                email: 'jane@example.com'
            });

            post = await PostModel.create({
                title: 'Post with Comments',
                content: 'This post will have comments',
                userId: user.id
            });

            comment1 = await CommentModel.create({
                text: 'First comment',
                userId: user.id,
                postId: post.id
            });

            comment2 = await CommentModel.create({
                text: 'Second comment',
                userId: user.id,
                postId: post.id
            });
        });

        describe('GET /api/posts/:id/comments/get', () => {
            it('should get all comments for a post', async () => {
                const req = mockRequest({ id: post.id });
                const res = mockResponse();

                await routeHandlers['GET /api/posts/:id/comments/get'](req, res);

                expect(res.responseData.status).toBe(200);
                expect(Array.isArray(res.responseData.data)).toBe(true);
                expect(res.responseData.data).toHaveLength(2);
                expect(res.responseData.data[0].text).toBe('First comment');
                expect(res.responseData.data[1].text).toBe('Second comment');
            });
        });

        describe('POST /api/posts/:id/comments/create', () => {
            it('should create a new comment for a post', async () => {
                const user = await UserModel.create({
                    name: 'Commenter',
                    email: 'commenter@example.com'
                });

                const req = mockRequest({ id: post.id }, {}, {
                    text: 'New comment',
                    userId: user.id
                });
                const res = mockResponse();

                await routeHandlers['POST /api/posts/:id/comments/create'](req, res);

                expect(res.responseData.status).toBe(201);
                expect(res.responseData.data.text).toBe('New comment');
                expect(res.responseData.data.postId).toBe(post.id);
                expect(res.responseData.data.userId).toBe(user.id);
            });
        });
    });

    describe('BelongsTo Associations', () => {
        let user;
        let post;

        beforeAll(async () => {
            user = await UserModel.create({
                name: 'BelongsTo User',
                email: 'belongsto@example.com'
            });

            post = await PostModel.create({
                title: 'Post with Author',
                content: 'This post belongs to a user',
                userId: user.id
            });
        });

        describe('GET /api/posts/:id/author/get', () => {
            it('should get the author of a post', async () => {
                const req = mockRequest({ id: post.id });
                const res = mockResponse();

                await routeHandlers['GET /api/posts/:id/author/get'](req, res);

                expect(res.responseData.status).toBe(200);
                expect(res.responseData.data.name).toBe('BelongsTo User');
                expect(res.responseData.data.email).toBe('belongsto@example.com');
            });
        });

        describe('PATCH /api/posts/:id/author/set/:userId', () => {
            it('should set the author of a post', async () => {
                const newUser = await UserModel.create({
                    name: 'New Author',
                    email: 'newauthor@example.com'
                });

                // First create a post without an author
                const orphanPost = await PostModel.create({
                    title: 'Orphan Post',
                    content: 'This post needs an author'
                });

                const req = mockRequest({ id: orphanPost.id, targetIds: newUser.id });
                const res = mockResponse();

                await routeHandlers['PATCH /api/posts/:id/author/set/:targetIds'](req, res);

                expect(res.responseData.status).toBe(201);

                // Verify the post now has the new author
                const updatedPost = await PostModel.findByPk(orphanPost.id);
                expect(updatedPost.userId).toBe(newUser.id);
            });
        });
    });
});