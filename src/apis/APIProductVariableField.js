import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIProductVariableField = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `ProductVariableField`,
            collectionModel: models.ProductVariableField,
        })
    }
}

