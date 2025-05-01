import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIOrder = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `Order`,
            collectionModel: models.Order,
        })
    }
}

