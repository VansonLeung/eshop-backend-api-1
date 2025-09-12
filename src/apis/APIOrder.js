import { APIGenericCRUD } from "@vanport/sequelize-crud-express-dongle/apis/incl/index.js";

export const APIOrder = {
    initialize: ({ app, appWithMeta, models }) => {
        APIGenericCRUD.initialize({ 
            app,
            appWithMeta,
            collectionName: `Order`,
            collectionModel: models.Order,
        })
    }
}

