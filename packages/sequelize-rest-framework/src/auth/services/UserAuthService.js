import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * UserAuth Service
 * Provides authentication functionality for the built-in User system
 */
export class UserAuthService {
    constructor({ User, UserCredential, UserSession, UserRole }) {
        this.User = User;
        this.UserCredential = UserCredential;
        this.UserSession = UserSession;
        this.UserRole = UserRole;
        this.saltRounds = 10;
        this.tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    /**
     * Register a new user with password
     */
    async register({ username, email, password, firstName, lastName, userRoleId }) {
        // Check if user already exists
        const existingUser = await this.User.findOne({
            where: {
                $or: [{ username }, { email }]
            }
        });

        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        // Create user
        const user = await this.User.create({
            username,
            email,
            firstName,
            lastName,
            userRoleId,
            status: 'active',
        });

        // Create credential
        await this.UserCredential.create({
            userId: user.id,
            type: 'password',
            password: hashedPassword,
            status: 'active',
        });

        return user;
    }

    /**
     * Login with username/email and password
     */
    async login({ login, password, ipAddress, userAgent }) {
        // Find user by username or email
        const user = await this.User.findOne({
            where: {
                $or: [
                    { username: login },
                    { email: login }
                ],
                status: 'active',
            },
            include: [{
                model: this.UserCredential,
                as: 'credentials',
                where: { type: 'password', status: 'active' },
                required: true,
            }]
        });

        if (!user || !user.credentials || user.credentials.length === 0) {
            throw new Error('Invalid credentials');
        }

        const credential = user.credentials[0];

        // Verify password
        const isValid = await bcrypt.compare(password, credential.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const accessToken = this.generateToken();
        const refreshToken = this.generateToken();
        const expiresAt = new Date(Date.now() + this.tokenExpiry);

        // Create session
        const session = await this.UserSession.create({
            userId: user.id,
            userCredentialId: credential.id,
            accessToken,
            refreshToken,
            expiresAt,
            ipAddress,
            userAgent,
            status: 'active',
        });

        return {
            user,
            session,
            accessToken,
            refreshToken,
            expiresAt,
        };
    }

    /**
     * Verify access token and return user
     */
    async verifyToken(accessToken) {
        const session = await this.UserSession.findOne({
            where: {
                accessToken,
                status: 'active',
                expiresAt: {
                    $gt: new Date()
                }
            },
            include: [{
                model: this.User,
                as: 'user',
                where: { status: 'active' },
                include: [{
                    model: this.UserRole,
                    as: 'userRole',
                }]
            }]
        });

        if (!session) {
            throw new Error('Invalid or expired token');
        }

        return session.user;
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken, ipAddress, userAgent) {
        const session = await this.UserSession.findOne({
            where: {
                refreshToken,
                status: 'active',
            },
            include: [{
                model: this.User,
                as: 'user',
                where: { status: 'active' },
            }]
        });

        if (!session) {
            throw new Error('Invalid refresh token');
        }

        // Generate new tokens
        const newAccessToken = this.generateToken();
        const newRefreshToken = this.generateToken();
        const expiresAt = new Date(Date.now() + this.tokenExpiry);

        // Update session
        await session.update({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt,
            ipAddress,
            userAgent,
        });

        return {
            user: session.user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt,
        };
    }

    /**
     * Logout - invalidate session
     */
    async logout(accessToken) {
        const session = await this.UserSession.findOne({
            where: { accessToken }
        });

        if (session) {
            await session.update({ status: 'inactive' });
        }

        return true;
    }

    /**
     * Logout all sessions for a user
     */
    async logoutAll(userId) {
        await this.UserSession.update(
            { status: 'inactive' },
            { where: { userId, status: 'active' } }
        );

        return true;
    }

    /**
     * Change password
     */
    async changePassword(userId, oldPassword, newPassword) {
        const credential = await this.UserCredential.findOne({
            where: {
                userId,
                type: 'password',
                status: 'active',
            }
        });

        if (!credential) {
            throw new Error('Password credential not found');
        }

        // Verify old password
        const isValid = await bcrypt.compare(oldPassword, credential.password);
        if (!isValid) {
            throw new Error('Invalid old password');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

        // Update credential
        await credential.update({ password: hashedPassword });

        return true;
    }

    /**
     * Generate random token
     */
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Clean expired sessions
     */
    async cleanExpiredSessions() {
        await this.UserSession.update(
            { status: 'inactive' },
            {
                where: {
                    status: 'active',
                    expiresAt: {
                        $lt: new Date()
                    }
                }
            }
        );
    }
}
