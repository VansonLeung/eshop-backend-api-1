import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * AuthService - Handles user authentication operations
 * Provides registration, login, logout, token verification, and refresh
 */
export class AuthService {
    constructor(models) {
        this.models = models;
        this.tokenExpiry = process.env.JWT_EXPIRY || 24 * 60 * 60 * 1000; // 24 hours default
        this.saltRounds = 10;
    }

    /**
     * Register a new user with credentials
     * @param {Object} params - Registration parameters
     * @param {string} params.username - Unique username
     * @param {string} params.email - User email
     * @param {string} params.password - Plain text password (will be hashed)
     * @param {string} params.roleId - Role UUID (optional, defaults to 'user' role)
     * @returns {Object} Created user object
     */
    async register({ username, email, password, roleId }) {
        // Find default role if not provided
        if (!roleId) {
            const defaultRole = await this.models.UserRole.findOne({
                where: { code: 'user' }
            });
            roleId = defaultRole?.id;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        
        // Create user
        const user = await this.models.User.create({
            username,
            email,
            roleId,
        });
        
        // Create credential
        await this.models.UserCredential.create({
            userId: user.id,
            password: hashedPassword,
            provider: 'local',
        });
        
        return user;
    }

    /**
     * Login user with username/password
     * @param {Object} params - Login parameters
     * @param {string} params.username - Username or email
     * @param {string} params.password - Plain text password
     * @param {string} params.ipAddress - Client IP address (optional)
     * @param {string} params.userAgent - Client user agent (optional)
     * @returns {Object} { user, accessToken, refreshToken, session }
     */
    async login({ username, password, ipAddress, userAgent }) {
        // Find user with credential and role
        const user = await this.models.User.findOne({
            where: { username },
            include: [
                {
                    model: this.models.UserCredential,
                    as: 'credentials',
                    where: { provider: 'local' },
                },
                {
                    model: this.models.UserRole,
                    as: 'role',
                }
            ],
        });
        
        if (!user || !user.credentials || user.credentials.length === 0) {
            throw new Error('Invalid credentials');
        }
        
        // Verify password
        const credential = user.credentials[0];
        const isValid = await bcrypt.compare(password, credential.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        
        // Generate tokens
        const accessToken = crypto.randomBytes(32).toString('hex');
        const refreshToken = crypto.randomBytes(32).toString('hex');
        
        // Create session
        const session = await this.models.UserSession.create({
            userId: user.id,
            accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + this.tokenExpiry),
            ipAddress,
            userAgent,
        });
        
        return { 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }, 
            accessToken, 
            refreshToken, 
            session 
        };
    }

    /**
     * Verify access token and return session with user
     * @param {string} accessToken - Access token to verify
     * @returns {Object|null} Session object with user and role, or null if invalid
     */
    async verifyToken(accessToken) {
        const session = await this.models.UserSession.findOne({
            where: { 
                accessToken,
                expiresAt: { [this.models.sequelize.Sequelize.Op.gt]: new Date() },
            },
            include: [{
                model: this.models.User,
                as: 'user',
                include: [{
                    model: this.models.UserRole,
                    as: 'role',
                }],
            }],
        });
        
        return session;
    }

    /**
     * Logout user by invalidating access token
     * @param {string} accessToken - Access token to invalidate
     */
    async logout(accessToken) {
        await this.models.UserSession.destroy({
            where: { accessToken },
        });
    }

    /**
     * Logout all sessions for a user
     * @param {string} userId - User UUID
     */
    async logoutAll(userId) {
        await this.models.UserSession.destroy({
            where: { userId },
        });
    }

    /**
     * Refresh access token using refresh token
     * @param {string} refreshToken - Refresh token
     * @returns {Object} { accessToken, refreshToken, expiresAt }
     */
    async refreshToken(refreshToken) {
        // Find session with refresh token
        const session = await this.models.UserSession.findOne({
            where: { refreshToken },
        });
        
        if (!session) {
            throw new Error('Invalid refresh token');
        }
        
        // Generate new tokens
        const newAccessToken = crypto.randomBytes(32).toString('hex');
        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + this.tokenExpiry);
        
        // Update session
        await session.update({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt,
        });
        
        return { 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken, 
            expiresAt 
        };
    }

    /**
     * Get current user by access token
     * @param {string} accessToken - Access token
     * @returns {Object|null} User object with role
     */
    async getCurrentUser(accessToken) {
        const session = await this.verifyToken(accessToken);
        return session?.user || null;
    }

    /**
     * Change user password
     * @param {string} userId - User UUID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     */
    async changePassword(userId, oldPassword, newPassword) {
        const credential = await this.models.UserCredential.findOne({
            where: { userId, provider: 'local' }
        });
        
        if (!credential) {
            throw new Error('User credential not found');
        }
        
        // Verify old password
        const isValid = await bcrypt.compare(oldPassword, credential.password);
        if (!isValid) {
            throw new Error('Invalid old password');
        }
        
        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
        await credential.update({ password: hashedPassword });
    }
}
