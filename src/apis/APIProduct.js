import { _APIGenericCRUD } from "./_incl";

export const APIProduct = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `Product`,
            collectionModel: models.Product,
        })
    }
}

