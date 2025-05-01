import express from 'express';
import { APIOrder } from "./APIOrder.js";
import { APIOrderItem } from "./APIOrderItem.js";
import { APIProduct } from "./APIProduct.js";
import { APIProductType } from "./APIProductType.js";
import { APIProductVariableField } from "./APIProductVariableField.js";
import { APIProductVariableFieldValue } from "./APIProductVariableFieldValue.js";
import { APIProductVariant } from "./APIProductVariant.js";
import { APIShop } from "./APIShop.js";

export const Router = {
    initialize: ({ models }) => {
        const router = express.Router()
 
        APIOrder.initialize({ app: router, models });
        APIOrderItem.initialize({ app: router, models });
        APIProduct.initialize({ app: router, models });
        APIProductType.initialize({ app: router, models });
        APIProductVariableField.initialize({ app: router, models });
        APIProductVariableFieldValue.initialize({ app: router, models });
        APIProductVariant.initialize({ app: router, models });
        APIShop.initialize({ app: router, models });
        
        return router;
    },
}
