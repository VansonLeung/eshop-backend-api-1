import { UserAuthService } from '../services/UserAuthService.js';
import { UserACLService } from '../services/UserACLService.js';

export class AuthMiddleware {
    static applyACL({
        models,
        apiName,
        requiredPermission,
    }) {
        return async (req, res, next) => {
            try {
                const { accesstoken: accessToken } = req.headers;

                let roleCode = 'guest';

                try {
                    const { session, user, userRole } = await UserAuthService.accessSession({ models, accessToken });
                    roleCode = userRole?.code ?? 'guest';

                    req.session = session;
                    req.user = user;
                    req.userRole = userRole;
                    req.userRoleCode = roleCode;

                } catch (e) {
                    req.userRoleCode = roleCode;
                }

                const isAccessGranted = UserACLService.deduceAccessGranted({
                    roleCode,
                    apiName,
                    requiredPermission,
                });

                if (!isAccessGranted) {
                    return res.status(403).json({ error: `Access denied: ${roleCode} -> ${apiName} -> ${requiredPermission}` });
                }

            } catch (error) {
                return res.status(500).json({ error: `Internal server error: ${error}` });
            }

            next();
        };
    }
}