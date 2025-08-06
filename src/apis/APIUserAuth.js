import { UserAuthDao } from "../dao/user/UserAuthDao.js";
import { _APIGenericMiddlewaresACL } from "./_incl";

export const APIUserAuth = {
    initialize: ({ app, appWithMeta, models }) => {

        appWithMeta.post(`/api/auth/login`, {}, async (req, res) => {
            try {
                const { username, password } = req.body;
                const { user, session, } = await UserAuthDao.loginUser({ models, username, password, });
                res.sendResponse({status: 200, data: { user, session } });
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });
        
        appWithMeta.post(`/api/auth/logout`, {}, 

            _APIGenericMiddlewaresACL.applyMiddlewareACL({ 
                models, 
                apiName: `auth`, 
                requiredPermission: `logout`, 
            }), 

            async (req, res) => {
                try {
                    const result = await UserAuthDao.logoutUser({ models, sessionId: req.session.id, })
                    res.sendResponse({status: 200, data: result });
                } catch (error) {
                    res.sendError({error, });
                    throw error;
                }
            },
        );
        
        appWithMeta.post(`/api/auth/register`, {}, async (req, res) => {
            try {
                const user = req.body;
                const { user: newUser, session, } = await UserAuthDao.registerUser({ models, user, });
                res.sendResponse({status: 200, data: { user: newUser, session, } });
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });
    }
}