import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

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
