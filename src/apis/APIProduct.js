import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIProduct = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `Product`,
            collectionModel: models.Product,
        })
    }
}

