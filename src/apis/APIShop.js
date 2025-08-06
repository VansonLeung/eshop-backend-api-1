import { _APIGenericCRUD } from "./_incl";

export const APIShop = {
    initialize: ({ app, appWithMeta, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `Shop`,
            collectionModel: models.Shop,
        })
    }
}

