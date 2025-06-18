import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIUser = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `User`,
            collectionModel: models.User,
        })
    }
}

