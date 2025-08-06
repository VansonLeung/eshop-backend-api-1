import { _APIGenericCRUD } from "./_incl";

export const APIProductVariant = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `ProductVariant`,
            collectionModel: models.ProductVariant,
        })
    }
}

