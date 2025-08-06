import { _APIGenericCRUD } from "./_incl";

export const APIUser = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `User`,
            collectionModel: models.User,
        })
    }
}

