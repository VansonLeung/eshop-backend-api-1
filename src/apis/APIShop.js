import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIShop = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `Shop`,
            collectionModel: models.Shop,
        })
    }
}

