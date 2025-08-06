import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBPostTypePostMapping = {
    makeAssociations: ({Me, PostType, Post}) => {
        PostType.belongsToMany(Post, { 
            through: Me,
            as: 'posts',
            foreignKey: 'postTypeId',
            constraints: Settings.constraints,
        });
        Post.belongsToMany(PostType, { 
            through: Me,
            as: 'postTypes',
            foreignKey: 'postId',
            constraints: Settings.constraints,
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
