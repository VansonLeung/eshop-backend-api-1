import { UserAuthDao } from "../dao/user/UserAuthDao.js";
import { _APIGenericMiddlewaresACL } from "./_APIGenericMiddlewaresACL.js";

export const APIUserAuth = {
    initialize: ({ app, models }) => {

        app.post(`/api/auth/login`, async (req, res) => {
            try {
                const { username, password } = req.body;
                const { user, session, } = await UserAuthDao.loginUser({ models, username, password, });
                res.status(200).json({ user, session });
            } catch (error) {
                res.status(400).json({ error: error.message });
                throw error;
            }
        });
        
        app.post(`/api/auth/logout`, 

            _APIGenericMiddlewaresACL.applyMiddlewareACL({ 
                models, 
                apiName: `auth`, 
                requiredPermission: `logout`, 
            }), 

            async (req, res) => {
                try {
                    const result = await UserAuthDao.logoutUser({ models, sessionId: req.session.id, })
                    res.status(200).json(result);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                    throw error;
                }
            },
        );
        
        app.post(`/api/auth/register`, async (req, res) => {
            try {
                const user = req.body;
                const { user: newUser, session, } = await UserAuthDao.registerUser({ models, user, });
                res.status(200).json({ user: newUser, session, });
            } catch (error) {
                res.status(500).json({ error: error.message });
                throw error;
            }
        });
    }
}