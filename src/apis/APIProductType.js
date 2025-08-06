import { _APIGenericCRUD } from "./_incl";

export const APIProductType = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `ProductType`,
            collectionModel: models.ProductType,
        })
    }
}

