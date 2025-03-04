import {writeFileSync} from 'fs';
import { Sequelize, Op } from "sequelize";
import sequelizeErd from 'sequelize-erd';
import { EBUser } from "./EBUser.js";
import { EBUserRole } from "./EBUserRole.js";
import { EBUserSession } from "./EBUserSession.js";
import { EBUserPermission } from "./EBUserPermission.js";
import { EBUserRolePermissionMapping } from "./EBUserRolePermissionMapping.js";
import { EBUserContact } from "./EBUserContact.js";
import { EBUserCredential } from "./EBUserCredential.js";
import { EBShop } from "./EBShop.js";
import { EBShopOwnerMapping } from "./EBShopOwnerMapping.js";
import { EBProduct } from "./EBProduct.js";
import { EBProductType } from "./EBProductType.js";
import { EBShopProductMapping } from "./EBShopProductMapping.js";
import { EBProductTypeProductMapping } from "./EBProductTypeProductMapping.js";
import { EBLang } from "./EBLang.js";
import { EBPost } from "./EBPost.js";
import { EBUserShipping } from "./EBUserShipping.js";
import { EBUserBilling } from "./EBUserBilling.js";
import { EBUserPayment } from "./EBUserPayment.js";
import { EBUserCartItem } from "./EBUserCartItem.js";
import { EBPostType } from "./EBPostType.js";
import { EBPostTypePostMapping } from './EBPostTypePostMapping.js';
import { EBOrder } from "./EBOrder.js";
import { EBOrderItem } from "./EBOrderItem.js";
import { EBOrderBilling } from "./EBOrderBilling.js";
import { EBOrderShipping } from "./EBOrderShipping.js";
import { EBOrderPayment } from "./EBOrderPayment.js";
import { EBOrderInvoice } from "./EBOrderInvoice.js";
import { EBOrderStatus } from "./EBOrderStatus.js";
import { EBOrderItemStatus } from "./EBOrderItemStatus.js";
import { EBShopProductTypeMapping } from "./EBShopProductTypeMapping.js";
import { EBShopOrderMapping } from "./EBShopOrderMapping.js";
import { EBCustomerOrderMapping } from './EBCustomerOrderMapping.js';
import { SchemaToIndexes } from './_helpers/SequelizeSchemaHelper.js';


export const initializeModels = async () => 
{
    const sequelize = new Sequelize('eshopcms1_dev', 'root', 'password', {
        dialect: 'mysql',
        host: "127.0.0.1",
        dialectOptions: {
          // Your mysql2 options here
        //   socketPath: '/tmp/mysql.sock',
        },
    });
    
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const UserPermission = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserPermission', EBUserPermission.makeSchema());
        const UserRole = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserRole', EBUserRole.makeSchema());
        const UserRolePermissionMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserRolePermissionMapping', EBUserRolePermissionMapping.makeSchema());
    
        const User = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('User', EBUser.makeSchema());
        const UserCredential = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserCredential', EBUserCredential.makeSchema());
        const UserSession = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserSession', EBUserSession.makeSchema());
        const UserContact = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserContact', EBUserContact.makeSchema());
        const UserShipping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserShipping', EBUserShipping.makeSchema());
        const UserBilling = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserBilling', EBUserBilling.makeSchema());
        const UserPayment = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserPayment', EBUserPayment.makeSchema());
        const UserCartItem = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('UserCartItem', EBUserCartItem.makeSchema());
    
        const Shop = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('Shop', EBShop.makeSchema());
        const ShopOwnerMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ShopOwnerMapping', EBShopOwnerMapping.makeSchema());
        
        const Product = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('Product', EBProduct.makeSchema());
        const ProductType = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ProductType', EBProductType.makeSchema(), { indexes: SchemaToIndexes(EBProductType.makeSchema()), });
    
        const ShopProductMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ShopProductMapping', EBShopProductMapping.makeSchema());
        
        const ProductTypeProductMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ProductTypeProductMapping', EBProductTypeProductMapping.makeSchema());

        const ShopProductTypeMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ShopProductTypeMapping', EBShopProductTypeMapping.makeSchema());

        const Lang = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('Lang', EBLang.makeSchema());

        const Post = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('Post', EBPost.makeSchema());
        const PostType = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('PostType', EBPostType.makeSchema());
        const PostTypePostMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('PostTypePostMapping', EBPostTypePostMapping.makeSchema());
        
        const Order = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('Order', EBOrder.makeSchema());
        const OrderItem = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderItem', EBOrderItem.makeSchema());
        
        const OrderBilling = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderBilling', EBOrderBilling.makeSchema());
        const OrderShipping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderShipping', EBOrderShipping.makeSchema());
        const OrderPayment = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderPayment', EBOrderPayment.makeSchema());
        const OrderInvoice = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderInvoice', EBOrderInvoice.makeSchema());

        const OrderStatus = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderStatus', EBOrderStatus.makeSchema());
        const OrderItemStatus = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('OrderItemStatus', EBOrderItemStatus.makeSchema());

        const ShopOrderMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('ShopOrderMapping', EBShopOrderMapping.makeSchema());

        const CustomerOrderMapping = ((tableName, schema) => { return sequelize.define(tableName, schema, { indexes: SchemaToIndexes(schema), }); })('CustomerOrderMapping', EBCustomerOrderMapping.makeSchema());

    
        EBUserPermission.makeAssociations({Me: UserPermission, });
        EBUserRole.makeAssociations({Me: UserRole, });
        EBUserRolePermissionMapping.makeAssociations({Me: UserRolePermissionMapping, UserPermission, UserRole, });
    
        EBUser.makeAssociations({Me: User, UserRole, });
        EBUserCredential.makeAssociations({Me: UserCredential, User, });
        EBUserSession.makeAssociations({Me: UserSession, User, UserCredential, });
        EBUserContact.makeAssociations({Me: UserContact, User, });
        EBUserShipping.makeAssociations({Me: UserShipping, User, });
        EBUserBilling.makeAssociations({Me: UserBilling, User, });
        EBUserPayment.makeAssociations({Me: UserPayment, User, });
        EBUserCartItem.makeAssociations({Me: UserCartItem, User, Product, });
    
        EBShop.makeAssociations({Me: Shop, Lang, });
        EBShopOwnerMapping.makeAssociations({Me: ShopOwnerMapping, Shop, User, });
        
        EBProduct.makeAssociations({Me: Product, Lang, });
        EBProductType.makeAssociations({Me: ProductType, Lang, });
    
        EBShopProductMapping.makeAssociations({Me: ShopProductMapping, Shop, Product, });
    
        EBProductTypeProductMapping.makeAssociations({Me: ProductTypeProductMapping, ProductType, Product, });

        EBShopProductTypeMapping.makeAssociations({Me: ShopProductTypeMapping, Shop, ProductType, });
    
        EBLang.makeAssociations({Me: Lang, });

        EBPost.makeAssociations({Me: Post, Lang, });
        EBPostType.makeAssociations({Me: PostType, Lang, });
        EBPostTypePostMapping.makeAssociations({Me: PostTypePostMapping, PostType, Post, });

        EBOrder.makeAssociations({Me: Order, Customer: User, });
        EBOrderItem.makeAssociations({Me: OrderItem, Order, Product, });

        EBOrderBilling.makeAssociations({Me: OrderBilling, Order, });
        EBOrderShipping.makeAssociations({Me: OrderShipping, Order, });
        EBOrderPayment.makeAssociations({Me: OrderPayment, Order, });
        EBOrderInvoice.makeAssociations({Me: OrderInvoice, Order, });
        EBOrderStatus.makeAssociations({Me: OrderStatus, Order, });
        EBOrderItemStatus.makeAssociations({Me: OrderItemStatus, OrderItem, });

        EBShopOrderMapping.makeAssociations({Me: ShopOrderMapping, Shop, Order, });

        EBCustomerOrderMapping.makeAssociations({Me: CustomerOrderMapping, Customer: User, Order, });

        await sequelize.sync({
            force: true,
            alter: true,
        });


        (async function(){
          
            let output = await sequelizeErd({ source: sequelize, format: 'dot', }); // sequelizeErd() returns a Promise
            output = output
            .replace(/rankdir=LR,/, "rankdir=TB,")
            .replace(/ranksep=2/, "ranksep=1")
            writeFileSync('./doc/erd.dot', output);
          
            // Writes erd.svg to local path with SVG file from your Sequelize models
        })();


        

        const role1 = await UserRole.create({
            code: 'admin',
        });
        const role2 = await UserRole.create({
            code: 'user',
        });


        const u1 = await User.create({
            email: 'abc@abc.com',
            username: 'admin',
            userRoleId: role1.id,
        });
        const u2 = await User.create({
            email: 'sss',
            username: 'user',
            userRoleId: role2.id,
        });


        const pmsn1 = await UserPermission.create({
            code: 'admin - manage users',
        });
        const pmsn2 = await UserPermission.create({
            code: 'user - manage profile',
        });
        const pmsn3 = await UserPermission.create({
            code: 'user - manage cart',
        });
        const pmsn4 = await UserPermission.create({
            code: 'user - manage order',
        });


        const role_pmsn_1 = await UserRolePermissionMapping.create({
            userRoleId: role1.id,
            userPermissionId: pmsn1.id,
        });
        const role_pmsn_2 = await UserRolePermissionMapping.create({
            userRoleId: role2.id,
            userPermissionId: pmsn2.id,
        });
        const role_pmsn_3 = await UserRolePermissionMapping.create({
            userRoleId: role2.id,
            userPermissionId: pmsn3.id,
        });
        const role_pmsn_4 = await UserRolePermissionMapping.create({
            userRoleId: role2.id,
            userPermissionId: pmsn4.id,
        });



        const shop1 = await Shop.create({
            name: 'shop1',
        });

        const shopOwner1 = await ShopOwnerMapping.create({
            shopId: shop1.id,
            userId: u1.id,
        });




        

        try {
            // const userRole = await UserRole.findByPk(role2.id, {
            //     include: [{
            //         model: UserPermission,
            //         as: 'userPermissions',
            //     }],
            // });
    
            const userRole = await UserRole.findByPk(role2.id);
            const userPermissions = await userRole.getUserPermissions();

            if (!userRole) {
                console.log('User role not found');
                return [];
            }
    
            // const permissions = userRole.userPermissions.map(permission => permission.toJSON());
            const permissions = userPermissions.map(permission => permission.toJSON());
            console.log(permissions)
        } catch (error) {
            console.error('Error querying permissions by user role ID:', error);
        }



        try {

        
            const results = await sequelize.transaction(async t => {

                const product1 = await Product.create({
                    name: 'product1',
                    variants_json: {"colors": {"red": 1, "blue": 1, "green": 1, }, },
                });
    
                const shopProduct1 = await ShopProductMapping.create({
                    shopId: shop1.id,
                    productId: product1.id,
                });

                const qProductResultsByColors = await Product.findAndCountAll({
                    where: {
                        [Op.or]: [
                            {'variants_json.colors.red': 1,},
                            {'variants_json.colors.blue': 1,},
                        ],
                    },
                    include: [
                        {
                            model: Shop,
                            as: 'shops',
                        },
                    ]
                });

                return [product1, shopProduct1, qProductResultsByColors, qProductResultsByColors.rows]
            });
    
            console.log(results);

        } catch (e) {
            console.error(e);
        }



        try {

        
            const results = await sequelize.transaction(async t => {

                const pt1 = await ProductType.create({
                    name: 'pt1',
                });
    
                const shopPt1 = await ShopProductTypeMapping.create({
                    shopId: shop1.id,
                    productTypeId: pt1.id,
                });

                const qResults = await ProductType.findAndCountAll({
                    where: {
                        name: 'pt1',
                    },
                    include: [
                        {
                            model: Shop,
                            as: 'shops',
                        },
                    ]
                });

                return [pt1, shopPt1, qResults, qResults.rows]
            });
    
            console.log(results);

        } catch (e) {
            console.error(e);
        }





        try {

        
            const results = await sequelize.transaction(async t => {

                const pt1 = await ProductType.findOne({
                    name: 'pt1',
                });
    
                const p1 = await Product.findAll({
                    shopId: shop1.id,
                });

                for (var itm of p1) {
                    console.log("AAAXXX", itm.setProductTypes)
                    await itm.setProductTypes([pt1.id]);
                    await itm.addProductTypes([pt1.id]);
                    await itm.removeProductTypes([pt1.id]);
                    await itm.addProductTypes([pt1.id]);
                    console.log("XXX", itm.setProductTypes, itm.addProductTypes, itm.removeProductTypes)
                }

                return [pt1, p1]
            });
    
            console.log("SSS", results);

        } catch (e) {
            console.error(e);
        }




        const lang_zh_HK = await Lang.create({
            code: "zh_HK",
        })

        



        try {

            const results = await sequelize.transaction(async t => {

                const pt1 = await ProductType.findOne({
                    where: {
                        name: 'pt1',
                    }
                });

                await pt1.addChild(await ProductType.create({
                    name: 'pt1_a',
                }))

                return pt1;
            });
    
            console.log("SSSXXX", results);

        } catch (e) {
            console.error(e);
        }


        try {

            const results = await sequelize.transaction(async t => {

                const pt1_a = await ProductType.findOne({
                    where: {
                        parentId: {[Op.ne]: null},
                    },
                    include: [{ association: 'parent' }],
                })

                console.log([pt1_a, "AA", JSON.stringify(pt1_a.parent), "XX", JSON.stringify(await pt1_a.getParent()), ]);
                console.log(await ProductType.findByPk(pt1_a.parentId));

            });

        } catch (e) {
            console.error(e);
        }



        try {

            const results = await sequelize.transaction(async t => {

                const pt1_a = await ProductType.findOne({
                    where: {
                        name: "pt1_a",
                    },
                })

                await pt1_a.addDerivatives([
                    await ProductType.create({
                        name: "pt1_a_zh_HK",
                        desc: "pt1_a_zh_HK desc here",
                        langId: lang_zh_HK.id,
                    })
                ])

                const pts_display_and_base_results = await ProductType.findAndCountAll({
                    where: {
                        baseId: {[Op.ne]: null},
                    },
                    include: [{ association: 'base' }],
                })

                return [pts_display_and_base_results]
            });

            console.log(JSON.stringify(results));

        } catch (e) {
            console.error(e);
        }




        return {
            UserPermission,
            UserRole,
            UserRolePermissionMapping,
            User,
            UserCredential,
            UserSession,
            UserContact,
            UserShipping,
            UserBilling,
            UserPayment,
            UserCartItem,
            Shop,
            ShopOwnerMapping,
            Product,
            ProductType,
            ShopProductMapping,
            ProductTypeProductMapping,
            ShopProductTypeMapping,
            Lang,
            Post,
            PostType,
            PostTypePostMapping,
            Order,
            OrderItem,
            OrderBilling,
            OrderShipping,
            OrderPayment,
            OrderInvoice,
            OrderStatus,
            OrderItemStatus,
            ShopOrderMapping,
            CustomerOrderMapping,
        }
        
    
    } catch (error) {
        console.error('Unable to connect to the database:', error);

        return null;
    }
}

