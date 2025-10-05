import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBPostTypePostMapping = {
    makeAssociations: ({Me, PostType, Post}) => {
        AssociationHelpers.belongsToMany(PostType, Post, { 
            through: Me,
            as: 'posts',
            foreignKey: 'postTypeId',
        });
        AssociationHelpers.belongsToMany(Post, PostType, { 
            through: Me,
            as: 'postTypes',
            foreignKey: 'postId',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            postTypeId: DataTypes.UUID,
            postId: DataTypes.UUID,
        }
    },
}
