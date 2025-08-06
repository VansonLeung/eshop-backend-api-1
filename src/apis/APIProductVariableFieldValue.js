import { _APIGenericCRUD } from "./_incl";

export const APIProductVariableFieldValue = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `ProductVariableFieldValue`,
            collectionModel: models.ProductVariableFieldValue,
        })
    }
}

