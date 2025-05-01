import { _APIGenericCRUD } from "./_APIGenericCRUD.js";

export const APIOrderItem = {
    initialize: ({ app, models }) => {
        _APIGenericCRUD.initialize({ 
            app,
            collectionName: `OrderItem`,
            collectionModel: models.OrderItem,
        })
    }
}

