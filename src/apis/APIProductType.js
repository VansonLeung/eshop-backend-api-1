import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIProductType = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `ProductType`,
            collectionModel: models.ProductType,
        })
    }
}

