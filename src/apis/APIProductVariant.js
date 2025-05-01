import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIProductVariant = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `ProductVariant`,
            collectionModel: models.ProductVariant,
        })
    }
}

