import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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
