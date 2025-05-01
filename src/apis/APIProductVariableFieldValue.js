import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIProductVariableFieldValue = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `ProductVariableFieldValue`,
            collectionModel: models.ProductVariableFieldValue,
        })
    }
}

